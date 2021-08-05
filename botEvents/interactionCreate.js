const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require ('../config.json');
const guildSchema = require('../Database/guildSchema');
const ticketSchema = require('../Database/ticketSchema');
const ticketBlacklistSchema = require('../Database/ticketBlacklistSchema');
const moment = require('moment');
const fs = require(`fs`)
const pjson = require('../package.json');


module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

        /***********************************************************/
        /*      SLASH COMMANDS                                     */
        /***********************************************************/
        if(interaction.isCommand()) {
            const slashCmd = client.slashCommands.get(interaction.commandName)

            // IF NOT SLASH COMMAND
            if(!slashCmd) {
                // DEFINING EMBED TO SEND IN CHANNEL
                let errorEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error!`)
                    .setDescription(`There was an error trying to execute that slash command. Please inform <@${config.botAuthorId}>.`)

                // SENDING EMBED
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            }


            // SLASH COMMAND USER PERMISSION REQUIREMENT
            if (slashCmd.permissions) {
                const authorPerms = interaction.channel.permissionsFor(interaction.user);

                if (!authorPerms || !authorPerms.has(slashCmd.permissions)) {

                    // DEFINING EMBED TO SEND
                    let cmdUserPermErrEmbed = new discord.MessageEmbed()
                        .setColor(config.embedOrange)
                        .setTitle(`${config.emjORANGETICK} Sorry!`)
                        .setDescription(`You must have the \`\`${slashCmd.permissions}\`\` permission to use this slash command.`)


                    return interaction.reply({ embeds: [cmdUserPermErrEmbed], ephemeral: true })
                }
            }


            // SLASH COMMAND COOLDOWN SETUP
            const { cooldowns } = client;

            if (!cooldowns.has(slashCmd.name)) {
                cooldowns.set(slashCmd.name, new discord.Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(slashCmd.name);
            const cooldownTime = (slashCmd.cooldown || 0) * 1000;


            // SLASH COMMAND COOLDOWN
            if (timestamps.has(interaction.user.id)) {
                const expireTime = timestamps.get(interaction.user.id) + cooldownTime;
        
                if (now < expireTime) {

                    const timeLeft = (((expireTime - now) + 1) / 1000).toFixed(0);

                    // DEFINING EMBED TO SEND
                    let cooldownWaitEmbed = new discord.MessageEmbed()
                        .setColor(config.embedOrange)
                        .setTitle(`${config.emjORANGETICK} Not so fast!`)
                        .setDescription(`You just ran that command. Please wait ${timeLeft} more second(s) before running \`\`${slashCmd.name}\`\` again.`)
            

                    // SENDING COOLDOWN WAIT NOTICE
                    return interaction.reply({ embeds: [cooldownWaitEmbed], ephemeral: true })
                }
            }

            // SETTING COOLDOWN TIMEOUT
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownTime);


            // ARGUMENTS
            const args = [];
            interaction.options.data.map((x) => {
                args.push(x.value)
            })


            // RUN INTERACTION
            slashCmd.run(client, interaction, args)
        }




        
        /***********************************************************/
        /*      VERIFICATION TICKET INTERACTIONS                   */
        /***********************************************************/

        // TICKET CHANNEL NAME
        let ticketChannelName = `verify-${interaction.user.username.toLowerCase()}`;


        // IGNORNING NON-BUTTON INTERACTIONS
        if(interaction.isButton()) {

            
            /***********************************************************/
            /*      BEGIN VERIFICATION (INITIAL PROMPT in #ROLES)      */
            /***********************************************************/
            if(interaction.customId === 'begin_verification_button') {
                
                // CHECK IF THE USER IS BLACKLISTED
                const dbBlacklistData = await ticketBlacklistSchema.findOne({
                    USER_ID: interaction.user.id
                }).exec();

                if(dbBlacklistData) {
                    // CANCEL AND RESPOND WITH EPHEMERAL - USER ALREADY VERIFIED
                    return interaction.reply({
                        content: `Sorry, you are not eligible to create a verification ticket.\n*(If this is an error, please submit a ModMail ticket.)*`,
                        ephemeral: true })
                }

                const verifiedRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === 'verified')

                // CHECK IF USER HAS VERIFIED ROLE
                if(interaction.member.roles.cache.some((role) => role.id === verifiedRole.id)) {
                    // CANCEL AND RESPOND WITH EPHEMERAL - USER ALREADY VERIFIED
                    return interaction.reply({
                        content: `Sorry, you're **already verified!**\n*(If this is an error, please submit a ModMail ticket and let us know.)*`,
                        ephemeral: true })
                }



                // CHECK IF THERE EXISTS A TICKET CHANNEL FOR THE USER CURRENTLY
                if (interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === ticketChannelName)) {
                    // CANCEL AND RESPOND WITH EPHEMERAL - USER ALREADY IN VERIFYING PROCESS
                    return interaction.reply({
                        content: `Sorry, you're **already in the process of verifying!** Check your DMs with <@${config.botId}>!\n*(If this is an error, please submit a ModMail ticket and let us know.)*`,
                        ephemeral: true })
                }



                // EMPHEMERAL REPLY TO BUTTON PRESS - IF ELIGIBLE TO APPLY
                interaction.reply({ content: `**Verification started!** Please check for a DM from HooterBot to complete your verification.\n**Didn't receive a DM?** Please create a ModMail ticket and let us know!`, ephemeral: true })
                    .catch(err => console.log(err))



                // GENERATING INITIAL EMBED FOR DM
                let ticketOpenEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`**Verification - Ticket Opened**`)
                    .setDescription(`Thanks for wanting to verify in the <:TempleT:857293539779018773> **Temple University server**. This verification ticket will be open for 1 week, closing automatically on ${moment(Date.now()).add(7, 'days').utcOffset(-4).format("dddd, MMMM DD")}. When this ticket is completed or closed, its contents are permanently deleted.
                        \nThere are three ways you can verify you are a student or employee:
                        \n${config.indent}**1.** Use a physical TUid card
                        \n${config.indent}**2.** Use a virtual TUid card
                        \n${config.indent}**3.** Using TUportal
                        \n\nSelect a method using the buttons below to receive further instructions. You may quit verification at any time using the red "Quit Verification" button.
                        \n**Have questions?** Please send a message here in DMs to Hooterbot and a member of the server staff will respond shortly. If your message gets a green check reaction, it was sent successfully.`)


                // INITIALIZING BUTTONS 
                let TUidCardButton = new MessageButton()
                    .setLabel("Physical TUid Card")
                    .setStyle("SECONDARY")
                    .setCustomId("physical_TUid_Card")
                    .setDisabled(false)
                let VirtualTUidCardButton = new MessageButton()
                    .setLabel("Virtual TUid Card")
                    .setStyle("SECONDARY")
                    .setCustomId("virtual_TUid_Card")
                    .setDisabled(false)
                let TuPortalButton = new MessageButton()
                    .setLabel("TUportal")
                    .setStyle("SECONDARY")
                    .setCustomId("TU_portal")
                    .setDisabled(false)
                let InfoButton = new MessageButton()
                    .setLabel("Data & Privacy Info")
                    .setStyle("PRIMARY")
                    .setCustomId("Data_Privacy")
                    .setDisabled(false)
                let QuitButton = new MessageButton()
                    .setLabel("Quit Verification")
                    .setStyle("DANGER")
                    .setCustomId("quit_DM")
                    .setDisabled(false)

                // BUTTON ROWS
                let initialButtonRow = new MessageActionRow()
                    .addComponents(
                        TUidCardButton,
                        VirtualTUidCardButton,
                        TuPortalButton,
                    );

                let secondButtonRow = new MessageActionRow()
                .addComponents(
                    InfoButton,
                    QuitButton
                );



                // DMING USER THE INITIAL VERIFICATION PROMPT
                let firstDMmsg = await interaction.user.send({ embeds: [ticketOpenEmbed], components: [initialButtonRow, secondButtonRow] })
                    .catch(err => {

                        // UPDATING THE INITIAL EPHEMERAL MESSAGE IN #ROLES
                        interaction.editReply({ content: `${config.emjREDTICK} **Error!** I was not able to start verification because **I am not able to DM you!**\nYou'll need to allow DMs from server members until the verification process is completed. You can turn this on in the **privacy settings** for the server.\nOnce enabled, please try to begin verification again. Submit a ModMail ticket if this issue persists.`, ephemeral: true })
                            .catch(err => console.log(err))
                        // THE USER DOES NOT ALLOW DMs FROM THE BOT B/C PRIVACY SETTINGS! - DO NOT LOG, WE KNOW THE CHANNEL DOESN'T EXIST
                        // LOGGING TICKET OPEN ERROR
                        let logVerifStartErrorEmbed = new discord.MessageEmbed()
                            .setColor(config.embedOrange)
                            .setTitle(`${config.emjORANGETICK} Verification Attempt Issue!`)
                            .addField(`User:`, `${interaction.user}`, true)
                            .addField(`User ID:`, `${interaction.user.id}`, true)
                            .addField(`Problem:`, `The user does not allow DMs from server members. HooterBot is not able to initiate the verification process.\n\nIf this error continues to appear, **please reach out to the user.**`)
                            .setTimestamp()
                    

                        // LOG ENTRY
                        interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logVerifStartErrorEmbed] })
                    })

                    


                // GRABBING THE DM MESSAGE ATTEMPT
                // SUCESSFUL
                if(firstDMmsg) {
                    
                    // CHECK IF DATABASE HAS AN ENTRY
                    const dbGuildData = await guildSchema.findOne({
                        GUILD_ID: interaction.guild.id
                    }).exec();


                    // FETCH TICKET CATEGORY FROM DATABASE
                    if(dbGuildData.TICKET_CAT_ID) {
                        ticketCategory = dbGuildData.TICKET_CAT_ID;
                    }


                    // GRABBING BOT ROLE
                    let botRole = interaction.guild.me.roles.cache.find((role) => role.name == 'HooterBot');

                    // GRABBING MOD AND ADMIN ROLES
                    let modRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() == 'moderator');
                    let adminRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() == 'admin');


                    // GRABBING CURRENT DATE+TIME TO GENERATE CLOSE DATE AND REMINDER DATES
                    closeDate = moment(Date.now()).add(7, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")
                    FirstReminder = moment(Date.now()).add(2, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")
                    SecondReminder = moment(Date.now()).add(6, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")

                    // CREATE TICKET CHANNEL USING CLICKER'S USERNAME
                    await interaction.guild.channels.create(`${ticketChannelName}`, {
                        type: 'GUILD_TEXT',
                        parent: ticketCategory,
                        topic: `**\*\*Do not change this channel's name!\*\*** Messages sent here will go to the user's DMs and **cannot be edited or deleted once sent!**`,
                        permissionOverwrites: [
                            {
                                // EVERYONE ROLE - HIDE (EVEN FROM USER)
                                id: interaction.guild.roles.everyone.id,
                                deny: [`VIEW_CHANNEL`, `USE_PUBLIC_THREADS`, `USE_PRIVATE_THREADS`]
                            },{
                                // ADMINS - VIEW AND RESPOND
                                id: adminRole.id,
                                allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`]
                            },{
                                // MODERATORS - VIEW AND RESPOND
                                id: modRole.id,
                                allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`]
                            },{
                                // HOOTERBOT ROLE - VIEW AND RESPOND
                                id: botRole.id,
                                allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`]
                            }
                        ],
                        reason: `Part of the verification process ran by HooterBot. Used to communicate with users while verifying.`
                    })
                        .then(async modAdminTicketCh => {
                            // CREATE INTRO EMBED FOR ADMIN/MOD TICKET CHANNEL
                            let newTicketEmbed = new discord.MessageEmbed()
                                .setColor(config.embedGreen)
                                .setTitle(`**Verification Ticket Opened**`)
                                .addField(`User:`, `${interaction.user}`, true)
                                .addField(`User Tag:`, `${interaction.user.tag}`, true)
                                .addField(`User ID:`, `${interaction.user.id}`, true)
                                .addField(`Check-in Reminder:`, `${FirstReminder}`, true)
                                .addField(`Close Notice Reminder:`, `${SecondReminder}`, true)
                                .addField(`Ticket Auto-Close:`, `${closeDate}`, true)
                                .setDescription(`**All messages** sent in this channel are sent to the user's DMs. **Messages cannot be edited or deleted once sent.** Bot commands will not work. Please do not send messages unless in response to a user.`)

                            let QuitButton = new MessageButton()
                                .setLabel("End Verification")
                                .setStyle("DANGER")
                                .setCustomId("quit_CH")
                                .setDisabled(false)
            
                            // BUTTON ROW
                            let QuitButtonModBtn = new MessageActionRow()
                                .addComponents(
                                    QuitButton
                                );


                            // SENDING INTRO EMBED TO ADMIN/MOD TICKET CHANNEL
                            modAdminTicketCh.send({ embeds: [newTicketEmbed], components: [QuitButtonModBtn] })
                                .catch(err => console.log(err))
                                .then( ticketMsg => {
                                        
                                // LOG DATABASE INFORMATION FOR TICKET
                                ticketSchema.findOneAndUpdate({
                                    CREATOR_ID: interaction.user.id
                                },{
                                    GUILD_ID: interaction.guild.id,
                                    GUILD_NAME: interaction.guild.name,
                                    CREATOR_NAME: interaction.user.username.toLowerCase(),
                                    CREATOR_ID: interaction.user.id,
                                    DM_INITIALMSG_ID: firstDMmsg.id,
                                    DM_2NDMSG_ID: "",
                                    STAFF_CH_ID: modAdminTicketCh.id,
                                    TICKET_CLOSE: closeDate,
                                    REMINDER1_MSG_ID: "",
                                    REMINDER2_MSG_ID: "",
                                    TICKETCH1_MSG_ID: ticketMsg.id,
                                },{
                                    upsert: true
                                }).exec();
                            })

                            
                            // LOGGING TICKET OPENING IN LOGS CHANNEL
                            let logTicketOpenEmbed = new discord.MessageEmbed()
                                .setColor(config.embedGreen)
                                .setTitle(`${config.emjGREENTICK} New Verification Ticket!`)
                                .addField(`User:`, `${interaction.user}`, true)
                                .addField(`User ID:`, `${interaction.user.id}`, true)
                                .addField(`Mod/Admin Channel:`, `${modAdminTicketCh}`, true)
                                .setDescription(`**Ticket Auto-Close:** ${closeDate}`)
                                .setTimestamp()


                            // LOG ENTRY
                            interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logTicketOpenEmbed] })
                                .catch(err => console.log(err))



                            // UPDATE TICKET CATEGORY COUNTER
                            // GRAB TICKET CATEGORY USING ID
                            let ticketCategory = client.channels.cache.get(dbGuildData.TICKET_CAT_ID)


                            // COUNT OF TICKETS IN DB
                            var ticketCount = await ticketSchema.find({
                                GUILD_ID: interaction.guild.id
                            }).countDocuments()
                            .exec();


                            // COUNT TOTAL TICKETS IN VERIFICATION CATEGORY
                            let catChCount = interaction.guild.channels.cache.filter(ch => ch.type === `GUILD_TEXT` && ch.parent.name.startsWith(`VERIFICATION`)).size;

                            ticketCategory.setName(`VERIFICATION (OPEN: ${ticketCount}) [${catChCount}/50]`)
                        })
                }
                // END OF "BEGIN VERIFICATION (INITIAL PROMPT in #ROLES)" PROMPT BUTTON
            }
            // END OF "BEGIN VERIFICATION" PROMPT BUTTON




            /***********************************************************/
            /*      QUIT VERIFICATION (ANY PROMPT IN DMS)              */
            /***********************************************************/
            if(interaction.customId === 'quit_DM') {
                
                // DEFERRING BUTTON ACTION
                interaction.deferUpdate()


                // GENERATING QUIT CONFIRMATION EMBED FOR DM
                let quitConfirmEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`**Please confirm ticket cancellation.**`)
                    .setFooter(`This message will self-destruct in 10 seconds...`)


                // INITIALIZING BUTTON
                let quitConfirmButton = new MessageButton()
                    .setLabel("Yes, Quit")
                    .setStyle("DANGER")
                    .setCustomId("quit_confirmation_DM")
        

                // BUTTON ROW
                let buttonRow = new MessageActionRow()
                .addComponents(
                    quitConfirmButton
                );


                // SENDING THE QUIT CONFIRMATION                
                interaction.user.send({ embeds: [quitConfirmEmbed], components: [buttonRow] })
                    // DELETING AFTER 10 SECONDS IF NO ACTION
                    .then(msg => {
                        setTimeout(() => msg.delete(), 10000 );
                    })
                    .catch(err => console.log(err))
            }
            // END OF "QUIT_DM" BUTTON




            /***********************************************************/
            /*      QUIT VERIFICATION (ANY PROMPT IN THE MOD/ADMIN CH) */
            /***********************************************************/
            if(interaction.customId === 'quit_CH') {
                
                // DEFERRING BUTTON ACTION
                interaction.deferUpdate()


                // GENERATING QUIT CONFIRMATION EMBED FOR DM
                let quitConfirmEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`**Please confirm ticket cancellation.**`)
                    .setFooter(`This message will self-destruct in 10 seconds...`)


                // INITIALIZING BUTTON
                let quitConfirmButton = new MessageButton()
                    .setLabel("Yes, Quit")
                    .setStyle("DANGER")
                    .setCustomId("quit_confirmation_CH")
        

                // BUTTON ROW
                let buttonRow = new MessageActionRow()
                .addComponents(
                    quitConfirmButton
                );


                // SENDING THE QUIT CONFIRMATION                
                interaction.channel.send({ embeds: [quitConfirmEmbed], components: [buttonRow] })
                    // DELETING AFTER 10 SECONDS IF NO ACTION
                    .then(msg => {
                        setTimeout(() => msg.delete(), 10000 );
                    })
                    .catch(err => console.log(err))
            }
            // END OF "QUIT_CH" BUTTON




            /***********************************************************/
            /*      QUIT CONFIRM (2nd QUIT IN DMS PROMPT)              */
            /***********************************************************/
            if(interaction.customId === 'quit_confirmation_DM') {

                // DEFERRING BUTTON ACTION
                interaction.deferUpdate()

                
                // GRAB DATABASE ENTRY
                const dbTicketData = await ticketSchema.findOne({
                    CREATOR_ID: interaction.user.id
                }).exec();


                // FETCH INITIAL DM MESSAGE FROM DATABASE TO EDIT INITIAL PROMPT WITH BUTTONS DISABLED
                interaction.user.createDM()
                    .then(dmCh => {

                        // GRABBING THE INITIAL DM MESSAGE FROM TICKET
                        initialDmMsg = dmCh.messages.fetch(dbTicketData.DM_INITIALMSG_ID)
                            .then(msg => {
                                    
                                // COPY OF THE INITIAL EMBED MESSAGE SO BUTTONS CAN BE DISABLED
                                let ticketOpenEmbed = new discord.MessageEmbed()
                                    .setColor(config.embedTempleRed)
                                    .setTitle(`**Verification - Ticket Opened**`)
                                    .setDescription(`Thanks for wanting to verify in the <:TempleT:857293539779018773> **Temple University server**.
                                        \nThere are three ways you can verify you are a student or employee:
                                        \n${config.indent}**1.** Use a physical TUid card
                                        \n${config.indent}**2.** Use a virtual TUid card
                                        \n${config.indent}**3.** Using TUportal
                                        \n\nThis ticket has been **closed**. If you have not completed verification, you may open a new verification ticket in <#829417860820238356>.`)


                                // INITIALIZING BUTTONS - ALL DISABLED
                                let TUidCardButtonDisabled = new MessageButton()
                                    .setLabel("Physical TUid Card")
                                    .setStyle("SECONDARY")
                                    .setCustomId("physical_TUid_Card")
                                    .setDisabled(true)
                                let VirtualTUidCardButtonDisabled = new MessageButton()
                                    .setLabel("Virtual TUid Card")
                                    .setStyle("SECONDARY")
                                    .setCustomId("virtual_TUid_Card")
                                    .setDisabled(true)
                                let TuPortalButtonDisabled = new MessageButton()
                                    .setLabel("TUportal")
                                    .setStyle("SECONDARY")
                                    .setCustomId("TU_portal")
                                    .setDisabled(true)
                                let InfoButtonDisabled = new MessageButton()
                                    .setLabel("Data & Privacy Info")
                                    .setStyle("PRIMARY")
                                    .setCustomId("Data_Privacy")
                                    .setDisabled(true)
                                let QuitButtonDisabled = new MessageButton()
                                    .setLabel("Quit Verification")
                                    .setStyle("DANGER")
                                    .setCustomId("quit")
                                    .setDisabled(true)

                                // DISABLED BUTTON ROWS
                                let initialButtonRowDisabled = new MessageActionRow()
                                    .addComponents(
                                        TUidCardButtonDisabled,
                                        VirtualTUidCardButtonDisabled,
                                        TuPortalButtonDisabled
                                    );

                                let secondButtonRowDisabled = new MessageActionRow()
                                    .addComponents(
                                        InfoButtonDisabled,
                                        QuitButtonDisabled
                                    );


                                // EDITING THE INITIAL DM PROMPT TO DISABLE BUTTONS
                                msg.edit({ embeds: [ticketOpenEmbed], components: [initialButtonRowDisabled, secondButtonRowDisabled] })
                                    .catch(err => console.log(err))
                            })
                    


                        // DELETE THE 2ND PROMPT MESSAGE IF IT EXISTS
                        if(dbTicketData.DM_2NDMSG_ID) {
                                                        
                            // FETCH MESSAGE BY ID
                            secondDmMsg = dmCh.messages.fetch(dbTicketData.DM_2NDMSG_ID)
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 0 );
                                })
                                .catch(err => console.log(err))
                        }


                        // DELETE 1ST REMINDER IF EXISTS
                        if(dbTicketData.REMINDER1_MSG_ID) {
                                                        
                            // FETCH MESSAGE BY ID
                            firstReminderMsg = dmCh.messages.fetch(dbTicketData.REMINDER1_MSG_ID)
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 0 );
                                })
                                .catch(err => console.log(err))
                        }


                        // DELETE 2ND REMINDER IF EXISTS
                        if(dbTicketData.REMINDER2_MSG_ID) {
                                                        
                            // FETCH MESSAGE BY ID
                            firstReminderMsg = dmCh.messages.fetch(dbTicketData.REMINDER2_MSG_ID)
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 0 );
                                })
                                .catch(err => console.log(err))
                        }


                        // EDIT THE INITIAL TICKET MESSAGE TO DISABLE BUTTON
                        // GRAB TICKET CHANNEL, THEN MESSAGE
                        let userTicketCh = client.channels.cache.find(ch => ch.name === ticketChannelName)
                            
                        userTicketCh.messages.fetch(dbTicketData.TICKETCH1_MSG_ID)
                            .then(msg => {
                                // CREATE EDITED INTRO EMBED FOR ADMIN/MOD TICKET CHANNEL
                                let newTicketEditedEmbed = new discord.MessageEmbed()
                                    .setColor(config.embedGreen)
                                    .setTitle(`**Verification Ticket Closed**`)
                                    .addField(`User:`, `${interaction.user}`, true)
                                    .addField(`User Tag:`, `${interaction.user.tag}`, true)
                                    .addField(`User ID:`, `${interaction.user.id}`, true)
                                    .setDescription(`*This ticket has been closed. See the last message in the channel for information.*`)

                                let QuitButton = new MessageButton()
                                    .setLabel("End Verification")
                                    .setStyle("DANGER")
                                    .setCustomId("quit_CH")
                                    .setDisabled(true)
                
                                // BUTTON ROW
                                let QuitButtonModBtn = new MessageActionRow()
                                    .addComponents(
                                        QuitButton
                                    );

                                // EDITING THE INITIAL DM PROMPT TO DISABLE BUTTONS
                                msg.edit({ embeds: [newTicketEditedEmbed], components: [QuitButtonModBtn] })
                                    .catch(err => console.log(err))
                            })
                    })        

                // FETCH GUILD ID THROUGH TICKET DB VALUE
                let ticketGuildId = dbTicketData.GUILD_ID


                // CHECK IF DATABASE HAS AN ENTRY
                const dbGuildData = await guildSchema.findOne({
                    GUILD_ID: ticketGuildId
                }).exec();


                // UPDATE TICKET CATEGORY COUNTER
                // GRAB TICKET CATEGORY USING ID
                let ticketCategory = client.channels.cache.get(dbGuildData.TICKET_CAT_ID)


                // COUNT OF TICKETS IN DB
                var ticketCount = await ticketSchema.find({
                    GUILD_ID: ticketGuildId
                }).countDocuments()
                .exec();
                
                
                // COUNT TOTAL TICKETS IN VERIFICATION CATEGORY
                let catChCount = interaction.guild.channels.cache.filter(ch => ch.type === `GUILD_TEXT` && ch.parent.name.startsWith(`VERIFICATION`)).size;

                // SETTING NEW CATEGORY NAME
                ticketCategory.setName(`VERIFICATION (OPEN: ${ticketCount-1}) [${catChCount}/50]`)



                // DELETING DATABASE ENTRY
                await ticketSchema.deleteOne({
                    CREATOR_ID: interaction.user.id
                }).exec();



                // GENERATING QUIT CONFIRMATION EMBED FOR DM
                let quitConfirmedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`**${config.emjORANGETICK} Ticket Closed.**`)
                    .setDescription(`You have closed this verification ticket and you have **not** been verified.
                    \nAll the information for this ticket has been purged.
                    \nIf you wish to verify at a later time, please open a new ticket using the prompt in <#829417860820238356>.`)


                // DMING USER THE TICKET CLOSE CONFIRMATION             
                interaction.channel.send({ embeds: [quitConfirmedEmbed]})
                    .catch(err => console.log(err))


                // LOGGING TICKET CLOSURE
                let logCloseTicketEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Verification Ticket Closed`)
                    .addField(`User:`, `${interaction.user}`, true)
                    .addField(`User ID:`, `${interaction.user.id}`, true)
                    .addField(`Verified?`, `\`\` NO \`\``, true)
                    .addField(`Ticket closed early by:`, `${interaction.user}`)
                    .setTimestamp()
                

                // FETCHING THE GUILD FROM DATABASE
                let guild = client.guilds.cache.get(dbTicketData.GUILD_ID)
                guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logCloseTicketEmbed] })
                    .catch(err => console.log(err))

                
                // CLOSURE NOTICE TO CHANNEL
                let closeNotice = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Verification Close Notice`)
                    .setDescription(`**${interaction.user.username}** has closed this ticket early. This message constitutes as the last message of the transcript; the DM-channel communications with the user have been severed.\n\nIf the contents of this ticket do not need to be archived for moderation actions, press \`\`Confirm Ticket Close\`\` to **permanently delete this channel *immediately***.\n\nIf this channel needs to be archived for moderation actions, press \`\`Do Not Close\`\` to keep this channel.`)


                // BUTTONS
                let InfoButton = new MessageButton()
                    .setLabel("Confirm Ticket Close")
                    .setStyle("SUCCESS")
                    .setCustomId("Confirm_Ticket_Close")
                let QuitButton = new MessageButton()
                    .setLabel("Do Not Close")
                    .setStyle("DANGER")
                    .setCustomId("Ticket_DoNotClose")


                // BUTTON ROW
                let TicketCloseReviewButtonRow = new MessageActionRow()
                .addComponents(
                    InfoButton,
                    QuitButton
                );


                // FETCHING TICKET CHANNEL AND SENDING CLOSURE NOTICE
                client.channels.cache.find(ch => ch.name === ticketChannelName).send({ embeds: [closeNotice], components: [TicketCloseReviewButtonRow] })
                    .then(msg => {
                        // CHANGING TICKET CHANNEL NAME TO "closed-(username)" TO CUT DM-CHANNEL COMMS
                        msg.channel.setName(`closed-${interaction.user.username.toLowerCase()}`)
                    })
                    .catch(err => console.log(err))
            }
            // END OF "QUIT CONFIRM DMS" BUTTON




            /***********************************************************/
            /*      QUIT CONFIRM (2nd QUIT IN MOD/ADMIN CHANNEL)       */
            /***********************************************************/
            if(interaction.customId === 'quit_confirmation_CH') {   

                // DEFERRING BUTTON ACTION
                interaction.deferUpdate()


                // FETCH THE TICKET USER VIA CHANNEL NAME
                dmUsername = interaction.channel.name.split('-').pop()
      
                
                // GRAB DATABASE ENTRY
                const dbTicketData = await ticketSchema.findOne({
                    // THE NAMES ARE SAVED AS LOWERCASE, SO SHOULD BE EXACT MATCH
                    CREATOR_NAME: dmUsername
                }).exec();


                // CHECK IF DATABASE HAS AN ENTRY
                const dbGuildData = await guildSchema.findOne({
                    GUILD_ID: interaction.guild.id
                }).exec();


                // FETCHING THE GUILD FROM DATABASE
                guild = client.guilds.cache.get(dbTicketData.GUILD_ID)

                
                // EDIT THE INITIAL TICKET MESSAGE TO DISABLE BUTTON
                // IN THE CHANNEL, GRAB THE INITIAL MESSAGE
                interaction.channel.messages.fetch(dbTicketData.TICKETCH1_MSG_ID)
                    .then(msg => {
                        // CREATE EDITED INTRO EMBED FOR ADMIN/MOD TICKET CHANNEL
                        let newTicketEditedEmbed = new discord.MessageEmbed()
                            .setColor(config.embedGreen)
                            .setTitle(`**Verification Ticket Closed**`)
                            .addField(`User:`, `${interaction.user}`, true)
                            .addField(`User Tag:`, `${interaction.user.tag}`, true)
                            .addField(`User ID:`, `${interaction.user.id}`, true)
                            .setDescription(`*This ticket has been closed. See the last message in the channel for information.*`)

                        let QuitButton = new MessageButton()
                            .setLabel("End Verification")
                            .setStyle("DANGER")
                            .setCustomId("quit_CH")
                            .setDisabled(true)
        
                        // BUTTON ROW
                        let QuitButtonModBtn = new MessageActionRow()
                            .addComponents(
                                QuitButton
                            );

                        // EDITING THE INITIAL DM PROMPT TO DISABLE BUTTONS
                        msg.edit({ embeds: [newTicketEditedEmbed], components: [QuitButtonModBtn] })
                            .catch(err => console.log(err))
                    })



                // FETCH THE USER USING THEIR ID FROM THE DATABASE USING THE CHANNEL NAME
                const dmUser = await guild.members.fetch(dbTicketData.CREATOR_ID)


                // FETCH INITIAL DM MESSAGE FROM DATABASE TO EDIT INITIAL PROMPT WITH BUTTONS DISABLED
                dmUser.createDM()
                    .then(dmCh => {

                        // GRABBING THE INITIAL DM MESSAGE FROM TICKET
                        initialDmMsg = dmCh.messages.fetch(dbTicketData.DM_INITIALMSG_ID)
                            .then(msg => {
                                    
                                // COPY OF THE INITIAL EMBED MESSAGE SO BUTTONS CAN BE DISABLED
                                let ticketOpenEmbed = new discord.MessageEmbed()
                                    .setColor(config.embedTempleRed)
                                    .setTitle(`**Verification - Ticket Opened**`)
                                    .setDescription(`Thanks for wanting to verify in the <:TempleT:857293539779018773> **Temple University server**.
                                        \nThere are three ways you can verify you are a student or employee:
                                        \n${config.indent}**1.** Use a physical TUid card
                                        \n${config.indent}**2.** Use a virtual TUid card
                                        \n${config.indent}**3.** Using TUportal
                                        \n\nThis ticket has been **closed**. If you have not completed verification, you may open a new verification ticket in <#829417860820238356>.`)


                                // INITIALIZING BUTTONS - ALL DISABLED
                                let TUidCardButtonDisabled = new MessageButton()
                                    .setLabel("Physical TUid Card")
                                    .setStyle("SECONDARY")
                                    .setCustomId("physical_TUid_Card")
                                    .setDisabled(true)
                                let VirtualTUidCardButtonDisabled = new MessageButton()
                                    .setLabel("Virtual TUid Card")
                                    .setStyle("SECONDARY")
                                    .setCustomId("virtual_TUid_Card")
                                    .setDisabled(true)
                                let TuPortalButtonDisabled = new MessageButton()
                                    .setLabel("TUportal")
                                    .setStyle("SECONDARY")
                                    .setCustomId("TU_portal")
                                    .setDisabled(true)
                                let InfoButtonDisabled = new MessageButton()
                                    .setLabel("Data & Privacy Info")
                                    .setStyle("PRIMARY")
                                    .setCustomId("Data_Privacy")
                                    .setDisabled(true)
                                let QuitButtonDisabled = new MessageButton()
                                    .setLabel("Quit Verification")
                                    .setStyle("DANGER")
                                    .setCustomId("quit")
                                    .setDisabled(true)

                                // DISABLED BUTTON ROWS
                                let initialButtonRowDisabled = new MessageActionRow()
                                    .addComponents(
                                        TUidCardButtonDisabled,
                                        VirtualTUidCardButtonDisabled,
                                        TuPortalButtonDisabled
                                    );

                                let secondButtonRowDisabled = new MessageActionRow()
                                    .addComponents(
                                        InfoButtonDisabled,
                                        QuitButtonDisabled
                                    );


                                // EDITING THE INITIAL DM PROMPT TO DISABLE BUTTONS
                                msg.edit({ embeds: [ticketOpenEmbed], components: [initialButtonRowDisabled, secondButtonRowDisabled] })
                            })


                        // DELETE THE 2ND PROMPT MESSAGE IF IT EXISTS
                        if(dbTicketData.DM_2NDMSG_ID) {
                                                        
                            // FETCH MESSAGE BY ID
                            secondDmMsg = dmCh.messages.fetch(dbTicketData.DM_2NDMSG_ID)
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 0 );
                                })
                                .catch(err => console.log(err))
                        }

                        // DELETE 1ST REMINDER IF EXISTS
                        if(dbTicketData.REMINDER1_MSG_ID) {
                                                        
                            // FETCH MESSAGE BY ID
                            firstReminderMsg = dmCh.messages.fetch(dbTicketData.REMINDER1_MSG_ID)
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 0 );
                                })
                                .catch(err => console.log(err))
                        }

                        // DELETE 2ND REMINDER IF EXISTS
                        if(dbTicketData.REMINDER2_MSG_ID) {
                                                        
                            // FETCH MESSAGE BY ID
                            firstReminderMsg = dmCh.messages.fetch(dbTicketData.REMINDER2_MSG_ID)
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 0 );
                                })
                                .catch(err => console.log(err))
                        }
                    })


                // UPDATE TICKET CATEGORY COUNTER
                // GRAB TICKET CATEGORY USING ID
                let ticketCategory = client.channels.cache.get(dbGuildData.TICKET_CAT_ID)


                // COUNT OF TICKETS IN DB
                var ticketCount = await ticketSchema.find({
                    GUILD_ID: interaction.guild.id
                }).countDocuments()
                .exec();


                // COUNT TOTAL TICKETS IN VERIFICATION CATEGORY
                let catChCount = interaction.guild.channels.cache.filter(ch => ch.type === `GUILD_TEXT` && ch.parent.name.startsWith(`VERIFICATION`)).size;

                // SETTING NEW CATEGORY NAME
                ticketCategory.setName(`VERIFICATION (OPEN: ${ticketCount-1}) [${catChCount}/50]`)



                // DELETING DATABASE ENTRY
                await ticketSchema.deleteOne({
                    CREATOR_ID: dmUser.id
                }).exec();



                // GENERATING QUIT CONFIRMATION EMBED FOR DM
                let quitConfirmedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`**${config.emjORANGETICK} Ticket Closed.**`)
                    .setDescription(`A staff member of the Temple University server has closed this ticket and you have **not** been verified.
                    \nAll the information for this ticket has been purged.
                    \nIf you wish to verify at a later time, please open a new ticket using the prompt in <#829417860820238356>.`)


                // DMING USER THE TICKET CLOSE CONFIRMATION             
                await dmUser.send({ embeds: [quitConfirmedEmbed]})
                    .catch(err => console.log(err))


                // LOGGING TICKET CLOSURE
                let logCloseTicketEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Verification Ticket Closed`)
                    .addField(`User:`, `${dmUser}`, true)
                    .addField(`User ID:`, `${dmUser.id}`, true)
                    .addField(`Verified?`, `\`\` NO \`\``, true)
                    .addField(`Ticket closed early by:`, `${interaction.user} (Server Staff)`)
                    .setTimestamp()
                

                // FETCHING THE LOG CHANNEL FROM DATABASE
                guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logCloseTicketEmbed] })
                    .catch(err => console.log(err))


                // CLOSURE NOTICE TO CHANNEL
                let closeNotice = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Verification Close Notice`)
                    .setDescription(`**${interaction.user.username}** has closed this ticket early. This message constitutes as the last message of the transcript; the DM-channel communications with the user have been severed.\n\nIf the contents of this ticket do not need to be archived for moderation actions, press \`\`Confirm Ticket Close\`\` to **permanently delete this channel *immediately***.\n\nIf this channel needs to be archived for moderation actions, press \`\`Do Not Close\`\` to keep this channel.`)


                // BUTTONS
                let InfoButton = new MessageButton()
                    .setLabel("Confirm Ticket Close")
                    .setStyle("SUCCESS")
                    .setCustomId("Confirm_Ticket_Close")
                let QuitButton = new MessageButton()
                    .setLabel("Do Not Close")
                    .setStyle("DANGER")
                    .setCustomId("Ticket_DoNotClose")


                // BUTTON ROW
                let TicketCloseReviewButtonRow = new MessageActionRow()
                .addComponents(
                    InfoButton,
                    QuitButton
                );


                // FETCHING TICKET CHANNEL AND SENDING CLOSURE NOTICE
                interaction.channel.send({ embeds: [closeNotice], components: [TicketCloseReviewButtonRow] })
                    .then(msg => {
                        // CHANGING TICKET CHANNEL NAME TO "closed-(username)" TO CUT DM-CHANNEL COMMS
                        msg.channel.setName(`closed-${dmUsername.toLowerCase()}`)
                    })
                    .catch(err => console.log(err))
            }
            // END OF "QUIT CONFIRM ADMIN/MOD CH" BUTTON




            /***********************************************************/
            /*      PHYSICAL TUID CARD                                 */
            /***********************************************************/
            if(interaction.customId === 'physical_TUid_Card') {
                await interaction.deferUpdate()


                // EMBED MESSAGE
                let physicalTUidEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`**Physical TUid Card**`)
                    .setDescription(`**1.** Hold your TUid card up next to your screen with Discord open.
                        \n**2.** Take a picture of your card and Discord screen. Make sure the bottom-left corner of Discord is visible so your avatar, username, and tag are visible.
                        ***Note:** If you have a custom status, you'll need to hover your mouse over the area so your tag is visible.*
                        \n**3.** Reply to this message below with the picture as an attachment <:AttachmentIcon:870727871646289970>.
                        \n**Before sending, please obscure any personally identifiable information (pictures, names) you wish to not share.**
                        \n**4.** Wait for a response from server staff. Responses may take up to a day.
                        \n\nWhen ready, attach your image in a DM below and send it to the bot (no message text needed). Want to use a different method? Select a button in the initial prompt above.`)


                // CHECK IF DATABASE HAS AN ENTRY
                const dbTicketData = await ticketSchema.findOne({
                    CREATOR_ID: interaction.user.id
                }).exec();


                // IF 2ND DM MESSAGE EXISTS, EDIT WITH NEW EMBED
                if(dbTicketData.DM_2NDMSG_ID) {
                    interaction.user.createDM()
                        .then(dmCh => {
                            // FETCH MESSAGE FROM THE MESSAGE ID
                            dmCh.messages.fetch(dbTicketData.DM_2NDMSG_ID)
                                .then(msg => {
                                    msg.edit({ embeds: [physicalTUidEmbed], components: [] })
                                })
                        })
                }


                // IF 2ND DM MESSAGE DNE, POST THEN LOG MESSAGE ID
                else {
                    let SecondDmMsg = await interaction.user.send({ embeds: [physicalTUidEmbed], components: [] })
                        .catch(err => console.log(err))
                    
                    // LOG DATABASE INFORMATION FOR 2ND MESSAGE
                    ticketSchema.findOneAndUpdate({
                        CREATOR_NAME: interaction.user.username.toLowerCase()
                    },{
                        DM_2NDMSG_ID: SecondDmMsg.id,
                    },{
                        upsert: true
                    }).exec();
                }


                // FETCHING USER'S TICKET CHANNEL IN GUILD
                let ticketChannel = client.channels.cache.find(ch => ch.name === ticketChannelName);


                // GENERATE NOTICE EMBED
                let quitConfirmedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setDescription(`**${interaction.user.username}** has selected the **"Physical TUid Card"** option.`)


                // SEND MESSAGE IN TICKET CHANNEL INFORMING THAT THE USER HAS SELECTED THE PHYSICAL TUID CARD OPTION
                ticketChannel.send({ embeds: [quitConfirmedEmbed]})
                    .catch(err => console.log(err))
            }
            // END OF "PHYSICAL TUID CARD"




            /***********************************************************/
            /*      VIRTUAL TUID CARD                                  */
            /***********************************************************/
            if(interaction.customId === 'virtual_TUid_Card') {
                await interaction.deferUpdate()


                // EMBED MESSAGE
                let virtualTUidEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`**Virtual TUid Card**`)
                    .setDescription(`**1.** Open [TUportal](https://tuportal5.temple.edu/). From the \`\`Home\`\` tab, look in the "TUAPPLICATIONS" section for the "Get My TUid" link.
                        \n**2.** Put the window showing your virtual TUid next to Discord and take a screenshot or picture. Make sure the bottom-left corner of Discord is visible so your avatar, username, and tag are visible.
                        ***Note:** If you have a custom status, you'll need to hover your mouse over the area so your tag is visible.*
                        \n**3.** Reply to this message below with the picture as an attachment <:AttachmentIcon:870727871646289970>.
                        \n**Before sending, please obscure any personally identifiable information (pictures, names) you wish to not share.**
                        \n**4.** Wait for a response from server staff. Responses may take up to a day.
                        \n\nWhen ready, attach your image in a DM below and send it to the bot (no message text needed). Want to use a different method? Select a button in the initial prompt above.`)


                // CHECK IF DATABASE HAS AN ENTRY
                const dbTicketData = await ticketSchema.findOne({
                    CREATOR_ID: interaction.user.id
                }).exec();


                // IF 2ND DM MESSAGE EXISTS, EDIT WITH NEW EMBED
                if(dbTicketData.DM_2NDMSG_ID) {
                    interaction.user.createDM()
                        .then(dmCh => {
                            // FETCH MESSAGE FROM THE MESSAGE ID
                            dmCh.messages.fetch(dbTicketData.DM_2NDMSG_ID)
                                .then(msg => {
                                    msg.edit({ embeds: [virtualTUidEmbed], components: [] })
                                })
                        })
                }


                // IF 2ND DM MESSAGE DNE, POST THEN LOG MESSAGE ID
                else {
                    let SecondDmMsg = await interaction.user.send({ embeds: [virtualTUidEmbed], components: [] })
                        .catch(err => console.log(err))
                    
                    // LOG DATABASE INFORMATION FOR 2ND MESSAGE
                    ticketSchema.findOneAndUpdate({
                        CREATOR_ID: interaction.user.id
                    },{
                        DM_2NDMSG_ID: SecondDmMsg.id,
                    },{
                        upsert: true
                    }).exec();
                }


                // FETCHING USER'S TICKET CHANNEL IN GUILD
                let ticketChannel = client.channels.cache.find(ch => ch.name === ticketChannelName);


                // GENERATE NOTICE EMBED
                let quitConfirmedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setDescription(`**${interaction.user.username}** has selected the **"Virtual TUid Card"** option.`)


                // SEND MESSAGE IN TICKET CHANNEL INFORMING THAT THE USER HAS SELECTED THE PHYSICAL TUID CARD OPTION
                ticketChannel.send({ embeds: [quitConfirmedEmbed]})
                    .catch(err => console.log(err))
            }
            // END OF "VIRTUAL TUID CARD"




            /***********************************************************/
            /*      TUPORTAL STUDENT DASHBOARD                         */
            /***********************************************************/
            if(interaction.customId === 'TU_portal') {
                await interaction.deferUpdate()


                // EMBED MESSAGE
                let tuPortalEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`**TUportal**`)
                    .setDescription(`**1.** Open [TUportal](https://tuportal5.temple.edu/). From the \`\`Student Tools\`\` tab, look for the "Student Dashboard" section.
                        \n**2.** Put the window showing the student dashbaord next to Discord and take a screenshot or picture. Make sure the bottom-left corner of Discord is visible so your avatar, username, and tag are visible.
                        ***Note:** If you have a custom status, you'll need to hover your mouse over the area so your tag is visible.*
                        \n**3.** Reply to this message below with the picture as an attachment <:AttachmentIcon:870727871646289970>.
                        \n**Before sending, please obscure any personally identifiable information (pictures, names) you wish to not share.**
                        \n**4.** Wait for a response from server staff. Responses may take up to a day.
                        \n\nWhen ready, attach your image in a DM below and send it to the bot (no message text needed). Want to use a different method? Select a button in the initial prompt above.`)


                // CHECK IF DATABASE HAS AN ENTRY
                const dbTicketData = await ticketSchema.findOne({
                    CREATOR_ID: interaction.user.id
                }).exec();


                // IF 2ND DM MESSAGE EXISTS, EDIT WITH NEW EMBED
                if(dbTicketData.DM_2NDMSG_ID) {
                    interaction.user.createDM()
                        .then(dmCh => {
                            // FETCH MESSAGE FROM THE MESSAGE ID
                            dmCh.messages.fetch(dbTicketData.DM_2NDMSG_ID)
                                .then(msg => {
                                    msg.edit({ embeds: [tuPortalEmbed], components: [] })
                                })
                        })
                }


                // IF 2ND DM MESSAGE DNE, POST THEN LOG MESSAGE ID
                else {
                    let SecondDmMsg = await interaction.user.send({ embeds: [tuPortalEmbed], components: [] })
                        .catch(err => console.log(err))
                    
                    // LOG DATABASE INFORMATION FOR 2ND MESSAGE
                    ticketSchema.findOneAndUpdate({
                        CREATOR_ID: interaction.user.id
                    },{
                        DM_2NDMSG_ID: SecondDmMsg.id,
                    },{
                        upsert: true
                    }).exec();
                }


                // FETCHING USER'S TICKET CHANNEL IN GUILD
                let ticketChannel = client.channels.cache.find(ch => ch.name === ticketChannelName);


                // GENERATE NOTICE EMBED
                let quitConfirmedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setDescription(`**${interaction.user.username}** has selected the **"TUportal"** option.`)


                // SEND MESSAGE IN TICKET CHANNEL INFORMING THAT THE USER HAS SELECTED THE PHYSICAL TUID CARD OPTION
                ticketChannel.send({ embeds: [quitConfirmedEmbed]})
                    .catch(err => console.log(err))
            }
            // END OF "VIRTUAL TUID CARD"




            /***********************************************************/
            /*      DATA & PRIVACY PROMPT                              */
            /***********************************************************/
            if(interaction.customId === 'Data_Privacy') {
                await interaction.deferUpdate()


                // EMBED MESSAGE
                let DataPrivacyEmbed = new discord.MessageEmbed()
                    .setColor(config.embedBlurple)
                    .setTitle(`**Data & Privacy**`)
                    .setDescription(`**What info is collected?**\nThe bot temporarily collects information to function. Please click the \`\`Info Collected\`\` button at the bottom for specifics.
                                 \n\n**Where is the information stored?**\nIn a remote and secured [MongoDB database](https://www.mongodb.com/). ${config.botName} and ${config.botAuthorUsername} are the only users who can modify information in the database. Moderators and admins have access to view and inspect the database.
                                 \n\n**How is the data used?**\n***No information is sold or shared,*** it is only collected and used by ${config.botName} to keep it's ticketing functions operational over the week-long duration of a ticket. When a ticket is completed or closed, all the data is purged.
                                 \n\n**How do I know nothing malicious is going on?**\nWell, it'd be against Discord's Developer Policy (so ${config.botName} wouldn't exist...), but I invite you to check out all the code on the [public GitHub repository](${pjson.repository.url.split(`+`).pop()}) and send any questions you have at any time.`)
                    .addField('\u200B', '\u200B') // BLANK FIELD FOR SEPARATION
                    .addField(`Still have questions?`, `Please send them in the chat below or create a ModMail ticket and ${config.botAuthorUsername} will be happy to answer your questions.`)

                    let CollectedInfoButton = new MessageButton()
                        .setLabel("Info Collected")
                        .setStyle("PRIMARY")
                        .setCustomId("Info_Collected")
                    let CloseButton = new MessageButton()
                        .setLabel("Close")
                        .setStyle("SECONDARY")
                        .setCustomId("close_2nd_Prompt")


                    // BUTTON ROW
                    let CollectedInfoButtonRow = new MessageActionRow()
                        .addComponents(
                            CollectedInfoButton,
                            CloseButton
                        );

                // CHECK IF DATABASE HAS AN ENTRY
                const dbTicketData = await ticketSchema.findOne({
                    CREATOR_ID: interaction.user.id
                }).exec();


                // IF 2ND DM MESSAGE EXISTS, EDIT WITH NEW EMBED
                if(dbTicketData.DM_2NDMSG_ID) {
                    interaction.user.createDM()
                        .then(dmCh => {
                            // FETCH MESSAGE FROM THE MESSAGE ID
                            dmCh.messages.fetch(dbTicketData.DM_2NDMSG_ID)
                                .then(msg => {
                                    msg.edit({ embeds: [DataPrivacyEmbed], components: [CollectedInfoButtonRow] })
                                })
                        })
                }


                // IF 2ND DM MESSAGE DNE, POST THEN LOG MESSAGE ID
                else {
                    let SecondDmMsg = await interaction.user.send({ embeds: [DataPrivacyEmbed], components: [CollectedInfoButtonRow] })
                        .catch(err => console.log(err))
                    
                    // LOG DATABASE INFORMATION FOR 2ND MESSAGE
                    ticketSchema.findOneAndUpdate({
                        CREATOR_ID: interaction.user.id
                    },{
                        DM_2NDMSG_ID: SecondDmMsg.id,
                    },{
                        upsert: true
                    }).exec();
                }
            }
            // END OF "DATA & PRIVACY PROMPT"

            


            /***********************************************************/
            /*      COLLECTED DATA PROMPT                              */
            /***********************************************************/
            if(interaction.customId === 'Info_Collected') {
                await interaction.deferUpdate()


                // EMBED MESSAGE
                let MoreInfoEmbed = new discord.MessageEmbed()
                    .setColor(config.embedBlurple)
                    .setTitle(`**Collected Data**`)
                    .setDescription(`The following information is collected by the bot when you create a ticket:`)
                    .addField(`SERVER INFO:`, ` • Guild ID = An 18-digit number representing the Temple server.\n • Guild Name = the name of the Temple server (where you created the ticket).\n • Channel ID = a string of numbers representing a channel in the Temple server where mods/admins oversee ticket progress.\n`)
                    .addField(`USER INFO:`, ` • Your username = \`\`${interaction.user.username}\`\`\n • Your User ID = \`\`${interaction.user.id}\`\``)
                    .addField(`BOT INFO:`, ` • DM Message IDs = the ID's of the individual DM messages ${config.botName} sends during verification *(like this one!)*`)
                    .addField(`MISCELLANEOUS:`, ` • \_id = A randomly-generated identifier created and controlled by the database.\n• Ticket Close Date = The day the ticket is scheduled to automatically close\n• Creation Date = The day/time you created the ticket.\n• Updated Date = When the database entry was last modified by the bot.\n\n\nThis is a screenshot from the database showing an example of data collected by the bot when creating a ticket:`)
                    .setImage(`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/Testing/ExampleDbInfo.png`)

                    let BackDataPrivacyButton = new MessageButton()
                        .setLabel("Back")
                        .setStyle("PRIMARY")
                        .setCustomId("Data_Privacy")
                    let CloseButton = new MessageButton()
                        .setLabel("Close")
                        .setStyle("SECONDARY")
                        .setCustomId("close_2nd_Prompt")


                    // BUTTON ROW
                    let BackDataPrivacyButtonRow = new MessageActionRow()
                        .addComponents(
                            BackDataPrivacyButton,
                            CloseButton
                        );

                // CHECK IF DATABASE HAS AN ENTRY
                const dbTicketData = await ticketSchema.findOne({
                    CREATOR_ID: interaction.user.id
                }).exec();


                // IF 2ND DM MESSAGE EXISTS, EDIT WITH NEW EMBED
                if(dbTicketData.DM_2NDMSG_ID) {
                    interaction.user.createDM()
                        .then(dmCh => {
                            // FETCH MESSAGE FROM THE MESSAGE ID
                            dmCh.messages.fetch(dbTicketData.DM_2NDMSG_ID)
                                .then(msg => {
                                    msg.edit({ embeds: [MoreInfoEmbed], components: [BackDataPrivacyButtonRow] })
                                })
                        })
                }


                // IF 2ND DM MESSAGE DNE, POST THEN LOG MESSAGE ID
                else {
                    let SecondDmMsg = await interaction.user.send({ embeds: [MoreInfoEmbed], components: [BackDataPrivacyButtonRow] })
                        .catch(err => console.log(err))                    
                    
                    // LOG DATABASE INFORMATION FOR 2ND MESSAGE
                    ticketSchema.findOneAndUpdate({
                        CREATOR_ID: interaction.user.id
                    },{
                        DM_2NDMSG_ID: SecondDmMsg.id,
                    },{
                        upsert: true
                    }).exec();
                }
            }
            // END OF "DATA & PRIVACY PROMPT"




            /***********************************************************/
            /*      CLOSE BUTTON                                       */
            /***********************************************************/
            if(interaction.customId === 'close_2nd_Prompt') {
                await interaction.deferUpdate()


                // CHECK IF DATABASE HAS AN ENTRY
                const dbTicketData = await ticketSchema.findOne({
                    CREATOR_ID: interaction.user.id
                }).exec();


                // FETCH THE 2ND MESSAGE ID AND DELETE THE MESSAGE
                interaction.user.createDM()
                .then(dmCh => {
                    // FETCH MESSAGE FROM THE MESSAGE ID
                    dmCh.messages.fetch(dbTicketData.DM_2NDMSG_ID)
                        .then(msg => {
                            setTimeout(() => msg.delete(), 0 );
                        })
                })


                // REMOVING 2ND MESSAGE ID FROM DATABASE
                ticketSchema.findOneAndUpdate({
                    CREATOR_ID: interaction.user.id
                },{
                    DM_2NDMSG_ID: "",
                },{
                    upsert: true
                }).exec();
            }
            // END OF "CLOSE" BUTTON            




            /***********************************************************/
            /*      ROLES CHANNEL DATA PRIVACY BUTTON                  */
            /***********************************************************/
            if(interaction.customId === 'dataPrivacy_Roles') {
                
                // EMBED FOR EPHEMERAL REPLY
                let DataPrivacyEphemeralEmbed = new discord.MessageEmbed()
                    .setColor(config.embedBlurple)
                    .setTitle(`**Collected Data**`)
                    .setDescription(`The bot temporarily collects the following information to function:`)
                    .addField(`Guild ID`, `An 18-digit number identifying the Temple server on Discord.`)
                    .addField(`Guild Name`, `The name of the Temple server.`)
                    .addField(`Channel ID`, `A string of numbers representing a channel in the Temple server where mods/admins oversee ticket progress.`)
                    .addField(`Your username`, `\`\`${interaction.user.username}\`\``)
                    .addField(`Your User ID`, `\`\`${interaction.user.id}\`\``)
                    .addField(`DM Message IDs`, `Identifiers for the DM messages ${config.botName} sends during the verification process. (Users' messages are never stored)`)
                    .addField(`Ticket Close Date`, `The day the ticket is scheduled to automatically close.`)
                    .addField(`Creation Date`, `The day/time you created the ticket.`)
                    .addField(`Updated Date`, `When the database entry was last modified by the bot.`)

                let DataCollectedEphemeralEmbed = new discord.MessageEmbed()
                    .setColor(config.embedBlurple)
                    .setTitle(`**Data & Privacy**`)
                    .addField(`Where is the information stored?`, `In a remote and secured [MongoDB database](https://www.mongodb.com/).`)
                    .addField(`Who has access to the database?`, `${config.botName} and ${config.botAuthorUsername} are the only users who can modify database information. Moderators and admins have access to view and inspect the database.`)
                    .addField(`How is the data used?`, `*No information is sold or shared.* Data is only collected temporarily and used by ${config.botName} to keep it's ticketing functions operational over the week-long duration of a ticket.`)
                    .addField(`What happens when my ticket is closed/completed?`, `All the data the bot has stored in the database is purged automatically. Nothing is saved by the bot.`)
                    .addField(`How do I know nothing malicious is going on?`, `${config.botAuthorUsername} follows [Discord's Developer Policies](https://discord.com/developers/docs/legal) and invites you to check out all the source code for the bot on the [public GitHub repository](${pjson.repository.url.split(`+`).pop()}).`)
                    .addField(`What if I do not want to share information with the bot?`, `While the information ${config.botName} stores is basic and public information on Discord, **do not create a verification ticket** if you wish to not share this information.`)
                    .addField(`Still have questions?`, `Please create a <@${config.ModMailId}> ticket and ${config.botAuthorUsername} will be happy to answer your questions.`)
                
                
                await interaction.reply({
                    embeds: [DataPrivacyEphemeralEmbed, DataCollectedEphemeralEmbed],
                    ephemeral: true
                })
            }
            // END OF "ROLES CHANNEL DATA PRIVACY" BUTTON  




            /***********************************************************/
            /*      PROOF APPROVED BUTTON                              */
            /***********************************************************/
            if(interaction.customId === 'Proof_Approved') {
                
                // DEFERRING BUTTON ACTION
                interaction.deferUpdate()
                

                // FETCH THE TICKET USER VIA CHANNEL NAME
                dmUsername = interaction.channel.name.split('-').pop()
        
                
                // GRAB DATABASE ENTRY
                const dbTicketData = await ticketSchema.findOne({
                    // THE NAMES ARE SAVED AS LOWERCASE, SO SHOULD BE EXACT MATCH
                    CREATOR_NAME: dmUsername
                }).exec();


                // CHECK IF DATABASE HAS AN ENTRY
                const dbGuildData = await guildSchema.findOne({
                    GUILD_ID: interaction.guild.id
                }).exec();


                // FETCHING THE GUILD FROM DATABASE
                guild = client.guilds.cache.get(dbTicketData.GUILD_ID)


                // FETCH THE USER USING THEIR ID FROM THE DATABASE USING THE CHANNEL NAME
                const dmUser = await guild.members.fetch(dbTicketData.CREATOR_ID)

                
                // GRANT THE USER THE VERIFIED ROLE
                let verifRole = guild.roles.cache.find(role => role.name.toLowerCase() === 'verified')
                dmUser.roles.add(verifRole)


                // MESSAGE THE USER
                let userVerifiedSuccessfullyEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjVerified} You're Verified!`)
                    .setDescription(`**You have been given the Verified role in the Temple University server.**\nYou now have access to the following new features:
                        - Image posting and GIF embedding *server-wide!*
                        - Access to:\n${config.indent}• <#829445602868854804> - find roommates for the upcoming term
                        ${config.indent}• <#831527136438255626> - connect with other owls on social media
                        ${config.indent}• <#832976391985168445> - discuss scheduling and classes
                        ${config.indent}• <#829629393629872159> - talk about IRL events happening on/near campus
                        - Posting abilities in <#829732282079903775>
                        - Screen sharing in voice channels.
                        \nEnjoy!
                        \n***This ticket is now closed; all the information the bot has stored for this ticket has been deleted.***`)
                    .setFooter(`Have feedback about this process (good or bad)? Please consider sharing your thoughts with the server staff in a a ModMail ticket. We'd appreciate it!`)
                
                    // SEND CONFIRMATION EMBED
                await dmUser.send({ embeds: [userVerifiedSuccessfullyEmbed] })
                    .catch(err => console.log(err))


                // FETCH INITIAL DM MESSAGE FROM DATABASE TO EDIT INITIAL PROMPT WITH BUTTONS DISABLED
                dmUser.createDM()
                    .then(dmCh => {

                        // GRABBING THE INITIAL DM MESSAGE FROM TICKET
                        initialDmMsg = dmCh.messages.fetch(dbTicketData.DM_INITIALMSG_ID)
                            .then(msg => {
                                    
                                // COPY OF THE INITIAL EMBED MESSAGE SO BUTTONS CAN BE DISABLED
                                let ticketOpenEmbed = new discord.MessageEmbed()
                                    .setColor(config.embedTempleRed)
                                    .setTitle(`**Verification - Ticket Opened**`)
                                    .setDescription(`Thanks for wanting to verify in the <:TempleT:857293539779018773> **Temple University server**.
                                        \nThere are three ways you can verify you are a student or employee:
                                        \n${config.indent}**1.** Use a physical TUid card
                                        \n${config.indent}**2.** Use a virtual TUid card
                                        \n${config.indent}**3.** Using TUportal
                                        \n\nThis ticket has been **closed**. Thank you for verifying!`)


                                // INITIALIZING BUTTONS - ALL DISABLED
                                let TUidCardButtonDisabled = new MessageButton()
                                    .setLabel("Physical TUid Card")
                                    .setStyle("SECONDARY")
                                    .setCustomId("physical_TUid_Card")
                                    .setDisabled(true)
                                let VirtualTUidCardButtonDisabled = new MessageButton()
                                    .setLabel("Virtual TUid Card")
                                    .setStyle("SECONDARY")
                                    .setCustomId("virtual_TUid_Card")
                                    .setDisabled(true)
                                let TuPortalButtonDisabled = new MessageButton()
                                    .setLabel("TUportal")
                                    .setStyle("SECONDARY")
                                    .setCustomId("TU_portal")
                                    .setDisabled(true)
                                let InfoButtonDisabled = new MessageButton()
                                    .setLabel("Data & Privacy Info")
                                    .setStyle("PRIMARY")
                                    .setCustomId("Data_Privacy")
                                    .setDisabled(true)
                                let QuitButtonDisabled = new MessageButton()
                                    .setLabel("Quit Verification")
                                    .setStyle("DANGER")
                                    .setCustomId("quit")
                                    .setDisabled(true)

                                // DISABLED BUTTON ROW
                                let initialButtonRowDisabled = new MessageActionRow()
                                    .addComponents(
                                        TUidCardButtonDisabled,
                                        VirtualTUidCardButtonDisabled,
                                        TuPortalButtonDisabled
                                    );

                                let secondButtonRowDisabled = new MessageActionRow()
                                    .addComponents(
                                        InfoButtonDisabled,
                                        QuitButtonDisabled
                                    );


                                // EDITING THE INITIAL DM PROMPT TO DISABLE BUTTONS
                                msg.edit({ embeds: [ticketOpenEmbed], components: [initialButtonRowDisabled, secondButtonRowDisabled] })
                            })
                    


                        // DELETE THE 2ND PROMPT MESSAGE IF IT EXISTS
                        if(dbTicketData.DM_2NDMSG_ID) {
                                                        
                            // FETCH MESSAGE BY ID
                            secondDmMsg = dmCh.messages.fetch(dbTicketData.DM_2NDMSG_ID)
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 0 );
                                })
                                .catch(err => console.log(err))
                        }


                        // DELETE 1ST REMINDER IF EXISTS
                        if(dbTicketData.REMINDER1_MSG_ID) {
                                                        
                            // FETCH MESSAGE BY ID
                            firstReminderMsg = dmCh.messages.fetch(dbTicketData.REMINDER1_MSG_ID)
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 0 );
                                })
                                .catch(err => console.log(err))
                        }


                        // DELETE 2ND REMINDER IF EXISTS
                        if(dbTicketData.REMINDER2_MSG_ID) {
                                                        
                            // FETCH MESSAGE BY ID
                            firstReminderMsg = dmCh.messages.fetch(dbTicketData.REMINDER2_MSG_ID)
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 0 );
                                })
                                .catch(err => console.log(err))
                        }


                        // EDIT THE INITIAL TICKET MESSAGE TO DISABLE BUTTON
                        // GRAB TICKET CHANNEL, THEN MESSAGE
                        let userTicketCh = client.channels.cache.find(ch => ch.name === ticketChannelName)
                            
                        userTicketCh.messages.fetch(dbTicketData.TICKETCH1_MSG_ID)
                            .then(msg => {
                                // CREATE EDITED INTRO EMBED FOR ADMIN/MOD TICKET CHANNEL
                                let newTicketEditedEmbed = new discord.MessageEmbed()
                                    .setColor(config.embedGreen)
                                    .setTitle(`**Verification Ticket Closed**`)
                                    .addField(`User:`, `${interaction.user}`, true)
                                    .addField(`User Tag:`, `${interaction.user.tag}`, true)
                                    .addField(`User ID:`, `${interaction.user.id}`, true)
                                    .setDescription(`*This ticket has been closed. See the last message in the channel for information.*`)

                                let QuitButton = new MessageButton()
                                    .setLabel("End Verification")
                                    .setStyle("DANGER")
                                    .setCustomId("quit_CH")
                                    .setDisabled(true)
                
                                // BUTTON ROW
                                let QuitButtonModBtn = new MessageActionRow()
                                    .addComponents(
                                        QuitButton
                                    );

                                // EDITING THE INITIAL DM PROMPT TO DISABLE BUTTONS
                                msg.edit({ embeds: [newTicketEditedEmbed], components: [QuitButtonModBtn] })
                                    .catch(err => console.log(err))
                            })
                    })


                // UPDATE TICKET CATEGORY COUNTER
                // GRAB TICKET CATEGORY USING ID
                let ticketCategory = client.channels.cache.get(dbGuildData.TICKET_CAT_ID)


                // COUNT OF TICKETS IN DB
                var ticketCount = await ticketSchema.find({
                    GUILD_ID: interaction.guild.id
                }).countDocuments()
                .exec();


                // COUNT TOTAL TICKETS IN VERIFICATION CATEGORY
                let catChCount = interaction.guild.channels.cache.filter(ch => ch.type === `GUILD_TEXT` && ch.parent.name.startsWith(`VERIFICATION`)).size;
                
                // SETTING NEW CATEGORY NAME
                ticketCategory.setName(`VERIFICATION (OPEN: ${ticketCount-1}) [${catChCount}/50]`)


                // DELETING DATABASE ENTRY
                await ticketSchema.deleteOne({
                    CREATOR_ID: dmUser.id
                }).exec();



                // CLOSURE NOTICE TO CHANNEL
                let closeNotice = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Close Verification?`)
                    .setDescription(`This user has been granted the ${config.emjVerified} **verified role** and this ticket is now completed.\n\nIf the contents of this ticket do not need to be archived for moderation actions, press \`\`Confirm Ticket Close\`\` to **permanently delete this channel *immediately***.\n\nIf this channel needs to be archived for moderation actions, press \`\`Do Not Close\`\` to keep this channel.`)


                // BUTTONS
                let InfoButton = new MessageButton()
                    .setLabel("Confirm Ticket Close")
                    .setStyle("SUCCESS")
                    .setCustomId("Confirm_Ticket_Close")
                let QuitButton = new MessageButton()
                    .setLabel("Do Not Close")
                    .setStyle("DANGER")
                    .setCustomId("Ticket_DoNotClose")


                // BUTTON ROW
                let TicketCloseReviewButtonRow = new MessageActionRow()
                .addComponents(
                    InfoButton,
                    QuitButton
                );
    

                // LOG ENTRY
                // GENERATE NOTICE EMBED
                let proofApprovedLogEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjVerified} Verification Complete`)
                    .addField(`User:`, `${dmUser}`)
                    .addField(`User ID:`, `${dmUser.id}`, true)
                    .addField(`Verified?`, `\`\` YES \`\``, true)
                    .addField(`Staff Member Responsible:`, `${interaction.user}`)
                    .setTimestamp()

                // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
                guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [proofApprovedLogEmbed] })
                    .catch(err => console.log(err))



                // FETCHING TICKET CHANNEL AND SENDING CLOSURE NOTICE
                interaction.channel.send({ embeds: [closeNotice], components: [TicketCloseReviewButtonRow] })
                    .then(msg => {
                        // CHANGING TICKET CHANNEL NAME TO "closed-(username)" TO CUT DM-CHANNEL COMMS
                        msg.channel.setName(`closed-${dmUsername.toLowerCase()}`)
                    })
                    .catch(err => console.log(err))
            }
            // END OF "PROOF APPROVED" BUTTON 
            



            /***********************************************************/
            /*      PROOF REJECTED BUTTON                              */
            /***********************************************************/
            if(interaction.customId === 'Proof_Rejected') {
                
                // DEFERRING BUTTON ACTION
                interaction.deferUpdate()
                
                
                // FETCH THE TICKET USER VIA CHANNEL NAME
                dmUsername = interaction.channel.name.split('-').pop()
      
                
                // GRAB DATABASE ENTRY
                const dbTicketData = await ticketSchema.findOne({
                    // THE NAMES ARE SAVED AS LOWERCASE, SO SHOULD BE EXACT MATCH
                    CREATOR_NAME: dmUsername
                }).exec();


                // FETCHING THE GUILD FROM DATABASE
                guild = client.guilds.cache.get(dbTicketData.GUILD_ID)


                // FETCH THE USER USING THEIR ID FROM THE DATABASE USING THE CHANNEL NAME
                const dmUser = await guild.members.fetch(dbTicketData.CREATOR_ID)
                

                // GENERATE EMBED FOR USER
                let userProofRejectedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} You have not been verified.`)
                    .setDescription(`A member of the server staff will reply with more information.`)
                    .setTimestamp()

                // SEND EMBED TO USER
                await dmUser.send({ embeds: [userProofRejectedEmbed] })


                // GENERATE EMBED FOR MOD/ADMIN CHANNEL
                let proofRejectedModEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Verification Proof Rejected`)
                    .setDescription(`${interaction.user.username}, you have rejected this user's verification proof.\n\nPlease send a message below to provide the user with a short explanation on why and/or what they can do to improve their proof so they may resubmit.`)
                    .setTimestamp()


                // SEND EMBED TO MOD/ADMIN CHANNEL
                interaction.channel.send({ embeds: [proofRejectedModEmbed], components: [] })
                    .catch(err => console.log(err))
                


                // LOG ENTRY
                // GENERATE NOTICE EMBED
                let proofRejectedLogEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Verification Proof Rejected`)
                    .addField(`User:`, `${dmUser}`)
                    .addField(`User ID:`, `${dmUser.id}`, true)
                    .addField(`Verified?`, `\`\` NO \`\``, true)
                    .addField(`Staff Member Responsible:`, `${interaction.user}`)
                    .setTimestamp()
                
                // FETCHING TICKET CHANNEL AND SENDING CLOSURE NOTICE
                guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [proofRejectedLogEmbed] })
                    .catch(err => console.log(err))
            }
            // END OF "PROOF REJECTED" BUTTON




            /***********************************************************/
            /*      CONFIRM TICKET CLOSE BUTTON                        */
            /***********************************************************/
            if(interaction.customId === 'Confirm_Ticket_Close') {
                                
                // DEFERRING BUTTON ACTION
                interaction.deferUpdate()

                // GENERATE EMBED TO NOTE PENDING DELETION
                let initialDeletionEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`This channel will be deleted in 10s...`)
                    .setDescription(`*Why are you seeing this?* To prevent issues with the database and the API!\n✨ ***The more you know...*** ✨`)


                // SEND EMBED TO MOD/ADMIN CHANNEL - 10 SECONDS REMAIN
                interaction.channel.send({ embeds: [initialDeletionEmbed], components: [] })
                    .catch(err => console.log(err))
                    
                    // 5 SECONDS REMAIN - EDIT EMBED
                    .then(msg => {
                        let halfwayDeletionEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`This channel will be deleted in 5s...`)
                        .setDescription(`*Why are you seeing this?* To prevent issues with the database and the API!\n✨ ***The more you know...*** ✨`)

                        setTimeout(() => msg.edit({ embeds: [halfwayDeletionEmbed], components: [] }), 5000 )
                    })
                    
                    // 0 SECONDS REMAINING - DELETE CHANNEL
                    .then(setTimeout(() => interaction.channel.delete(), 10000 ))
                        .catch(err => console.log(err))                    
            }
            // END OF "CONFIRM TICKET CLOSE" BUTTON



            /***********************************************************/
            /*      DO NOT CLOSE BUTTON                                */
            /***********************************************************/
            if(interaction.customId === 'Ticket_DoNotClose') {

                // FETCH THE ORIGINAL TICKET USER NAME VIA CHANNEL NAME
                ticketUserName = interaction.channel.name.split('-').pop()

                // CHANGING TICKET CHANNEL NAME TO "archived-(username)" SINCE THE TICKET IS NOW ARCHIVED
                interaction.channel.setName(`archived-${ticketUserName}`)
                    .catch(err => console.log(err))

                // CLOSURE NOTICE TO CHANNEL
                let closeNoticeDisabled = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`🔒 Verification Transcript Archived`)
                    .setDescription(`This ticket is completed but has not been deleted at the decision of **${interaction.user.username}** for archival/moderation reasons. This message constitutes as the last message of the transcript; the DM-channel communications with the user have been severed.\n\n***DO NOT DELETE.***`)


                // BUTTONS
                let InfoButtonDisabled = new MessageButton()
                    .setLabel("Confirm Ticket Close")
                    .setStyle("SUCCESS")
                    .setCustomId("Confirm_Ticket_Close")
                    .setDisabled(true)
                let QuitButtonDisabled = new MessageButton()
                    .setLabel("Do Not Close")
                    .setStyle("DANGER")
                    .setCustomId("Ticket_DoNotClose")
                    .setDisabled(true)


                // BUTTON ROW
                let TicketCloseReviewButtonRow = new MessageActionRow()
                .addComponents(
                    InfoButtonDisabled,
                    QuitButtonDisabled
                );

                await interaction.update({ embeds: [closeNoticeDisabled], components: [TicketCloseReviewButtonRow] })
            }
            // END OF "DO NOT CLOSE" BUTTON



            /***********************************************************/
            /*      END OF TICKET BUTTONS                              */
            /***********************************************************/
        }
	},
};