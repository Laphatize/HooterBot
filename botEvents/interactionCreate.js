const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require ('../config.json');
const guildSchema = require('../Database/guildSchema');
const ticketSchema = require('../Database/ticketSchema');
const moment = require('moment');
const pjson = require('../package.json');


module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

        // TICKET CHANNEL NAME
        let ticketChannelName = `verify-${interaction.user.username.toLowerCase()}`;


        // IGNORNING NON-BUTTON INTERACTIONS
        if(interaction.isButton()) {

            /***********************************************************/
            /*      BEGIN VERIFICATION (INITIAL PROMPT in #ROLES)      */
            /***********************************************************/
            if(interaction.customId === 'begin_verification_button') {
                

                // CHECK IF USER HAS VERIFIED ROLE
                if(interaction.member.roles.cache.some((role) => role.id === config.verifiedRoleID)) {
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


                // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
                const dbGuildData = await guildSchema.findOne({
                    GUILD_ID: interaction.guild.id
                }).exec();



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

                // BUTTON ROW
                let initialButtonRow = new MessageActionRow()
                    .addComponents(
                        TUidCardButton,
                        VirtualTUidCardButton,
                        TuPortalButton,
                        InfoButton,
                        QuitButton
                    );



                // DMING USER THE INITIAL VERIFICATION PROMPT
                let firstDMmsg = await interaction.user.send({embeds: [ticketOpenEmbed], components: [initialButtonRow] })
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
                        client.channels.cache.get(config.logActionsChannelId).send({embeds: [logVerifStartErrorEmbed]})
                    })



                // GRABBING THE DM MESSAGE ATTEMPT
                // SUCESSFUL
                if(firstDMmsg) {
                    // FETCH TICKET CATEGORY FROM DATABASE
                    if(dbGuildData.TICKET_CAT_ID) {
                        ticketCategory = dbGuildData.TICKET_CAT_ID;
                    }


                    // GRABBING BOT ROLE
                    let botRole = interaction.guild.me.roles.cache.find((role) => role.name == 'HooterBot');


                    // GRABBING CURRENT DATE+TIME TO GENERATE CLOSE DATE
                    closeDate = moment(Date.now()).add(7, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")

                    // CREATE TICKET CHANNEL USING CLICKER'S USERNAME
                    await interaction.guild.channels.create(`${ticketChannelName}`, {
                        type: 'GUILD_TEXT',
                        parent: ticketCategory,
                        topic: `**\*\*Do not change this channel's name!\*\*** Messages sent here will go to the user's DMs and **cannot be edited or deleted once sent!**`,
                        permissionOverwrites: [
                            {
                                // EVERYONE ROLE - HIDE (EVEN FROM USER)
                                id: interaction.guild.roles.everyone.id,
                                deny: [`VIEW_CHANNEL`]
                            },{
                                // ADMINS - VIEW AND RESPOND
                                id: config.adminRoleId,
                                allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`]
                            },{
                                // MODERATORS - VIEW AND RESPOND
                                id: config.modRoleId,
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
                                .setDescription(`**Ticket Auto-Close:** ${closeDate}
                                \n**All messages** sent in this channel are sent to the user's DMs. Messages **cannot be edited or deleted** once sent. Bot commands will not work. Please do not send messages unless in response to a user.`)

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


                            // LOG DATABASE INFORMATION FOR TICKET
                            ticketSchema.findOneAndUpdate({
                                GUILD_ID: interaction.guild.id
                            },{
                                GUILD_ID: interaction.guild.id,
                                GUILD_NAME: interaction.guild.name,
                                CREATOR_NAME: interaction.user.username,
                                CREATOR_ID: interaction.user.id,
                                DM_INITIALMSG_ID: firstDMmsg.id,
                                DM_2NDMSG_ID: "",
                                STAFF_CH_ID: modAdminTicketCh.id,
                                TICKET_CLOSE: closeDate
                            },{
                                upsert: true
                            }).exec();

                            
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
                            client.channels.cache.get(config.logActionsChannelId).send({embeds: [logTicketOpenEmbed]})
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
                interaction.user.send({embeds: [quitConfirmEmbed], components: [buttonRow] })
                    // DELETING AFTER 10 SECONDS IF NO ACTION
                    .then(msg => {
                        client.setTimeout(() => msg.delete(), 10000 );
                    })

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
                interaction.channel.send({embeds: [quitConfirmEmbed], components: [buttonRow] })
                    // DELETING AFTER 10 SECONDS IF NO ACTION
                    .then(msg => {
                        client.setTimeout(() => msg.delete(), 10000 );
                    })

            }
            // END OF "QUIT_CH" BUTTON




            /***********************************************************/
            /*      QUIT CONFIRM (2nd QUIT IN DMS PROMPT)              */
            /***********************************************************/
            if(interaction.customId === 'quit_confirmation_DM') {

                // DEFERRING BUTTON ACTION
                interaction.deferUpdate()

                
                // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
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
                                        \n\nThis ticket has been **closed**. If you have not completed verification, you may open a new verification ticket in <#${config.rolesChannelId}>.`)


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
                                        TuPortalButtonDisabled,
                                        InfoButtonDisabled,
                                        QuitButtonDisabled
                                    );


                                // EDITING THE INITIAL DM PROMPT TO DISABLE BUTTONS
                                msg.edit({embeds: [ticketOpenEmbed], components: [initialButtonRowDisabled] })
                            })
                    


                        // DELETE THE 2ND PROMPT MESSAGE IF IT EXISTS - NOT WORTH DISABLING ANY BUTTONS ON IT
                        if(dbTicketData.DM_2NDMSG_ID) {
                                                        
                            // FETCH MESSAGE BY ID
                            secondDmMsg = dmCh.messages.fetch(dbTicketData.DM_2NDMSG_ID)
                                .then(msg => {
                                    client.setTimeout(() => msg.delete(), 0 );
                                })
                        }
                    })



                // DELETING DATABASE ENTRY
                await ticketSchema.deleteOne({
                    CREATOR_ID: interaction.user.id
                }).exec();


                // GENERATING QUIT CONFIRMATION EMBED FOR DM
                let quitConfirmedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`**${config.emjGREENTICK} Ticket Closed.**`)
                    .setDescription(`You have closed this verification ticket and you have **not** been verified.
                    \nAll the information for this ticket has been purged.
                    \nIf you wish to verify at a later time, please open a new ticket using the prompt in <#${config.rolesChannelId}>.`)

                // DMING USER THE QUIT CONFIRMATION             
                interaction.channel.send({embeds: [quitConfirmedEmbed]})



                // CREATE TRANSCRIPT OF CHAT

                    // ** A BIG TO DO ITEM **


                

                // LOGGING TICKET CLOSURE - THIS NEEDS TO HAPPEN AFTER THE MODS/ADMINS OK TICKET CLOSURE
                let logCloseTicketEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Verification Ticket Closed`)
                    .addField(`User:`, `${interaction.user}`, true)
                    .addField(`User ID:`, `${interaction.user.id}`, true)
                    .addField(`Verified?`, `**No**`, true)
                    .addField(`Ticket closed early by:`, `${interaction.user}`)
                    .setTimestamp()
                
                // LOG ENTRY
                interaction.channels.cache.get(config.logActionsChannelId).send({ embeds: [logCloseTicketEmbed] })

                
                // // CLOSURE NOTICE TO CHANNEL
                // let closeNotice = new discord.MessageEmbed()
                //     .setColor(config.embedOrange)
                //     .setTitle(`${config.emjORANGETICK} Verification Close Notice`)
                //     .setDescription(`${interaction.user.username} has closed this ticket on their end. If the contents of this ticket do not need to be archived for any moderation actions, press the button below to permanently delete this channel.`)


                // // FETCHING TICKET CHANNEL AND SENDING CLOSURE NOTICE
                // guild = client.guilds.fetch(dbTicketData.GUILD_ID);
                // guild.channels.cache.get(ch => ch.name === ticketChannelName).send({ embeds: [closeNotice] });
            }
            // END OF "QUIT CONFIRM DMS" BUTTON




            /***********************************************************/
            /*      QUIT CONFIRM (2nd QUIT IN MOD/ADMIN CHANNEL)       */
            /***********************************************************/
                
                // COPY THE QUIT CONFIRM ABOVE ONCE FINALIZED

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
                        \n**3.** Reply to this message below with the picture as an attachment. **Before sending, please obscure any personally identifiable information (pictures, names) you wish to not share.**
                        \n**4.** Wait for a response from server staff. Responses may take up to a day.
                        \n\nWhen ready, attach your image in a DM response below. Want to use a different method? Select a button in the initial prompt above.`)


                // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
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
                                    msg.edit({embeds: [physicalTUidEmbed] })
                                })
                        })
                }


                // IF 2ND DM MESSAGE DNE, POST THEN LOG MESSAGE ID
                else {
                    let SecondDmMsg = await interaction.user.send({embeds: [physicalTUidEmbed] })
                    
                    // LOG DATABASE INFORMATION FOR 2ND MESSAGE
                    ticketSchema.findOneAndUpdate({
                        CREATOR_NAME: interaction.user.username
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
                ticketChannel.send({embeds: [quitConfirmedEmbed]})
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
                        \n**3.** Reply to this message below with the picture as an attachment. **Before sending, please obscure any personally identifiable information (pictures, names) you wish to not share.**
                        \n**4.** Wait for a response from server staff. Responses may take up to a day.
                        \n\nWhen ready, attach your image in a DM response below. Want to use a different method? Select a button in the initial prompt above.`)


                // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
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
                                    msg.edit({embeds: [virtualTUidEmbed] })
                                })
                        })
                }


                // IF 2ND DM MESSAGE DNE, POST THEN LOG MESSAGE ID
                else {
                    let SecondDmMsg = await interaction.user.send({embeds: [virtualTUidEmbed] })
                    
                    // LOG DATABASE INFORMATION FOR 2ND MESSAGE
                    ticketSchema.findOneAndUpdate({
                        CREATOR_NAME: interaction.user.username
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
                ticketChannel.send({embeds: [quitConfirmedEmbed]})
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
                        \n**3.** Reply to this message below with the picture as an attachment. **Before sending, please obscure any personally identifiable information (pictures, names) you wish to not share.**
                        \n**4.** Wait for a response from server staff. Responses may take up to a day.
                        \n\nWhen ready, attach your image in a DM response below. Want to use a different method? Select a button in the initial prompt above.`)


                // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
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
                                    msg.edit({embeds: [tuPortalEmbed] })
                                })
                        })
                }


                // IF 2ND DM MESSAGE DNE, POST THEN LOG MESSAGE ID
                else {
                    let SecondDmMsg = await interaction.user.send({embeds: [tuPortalEmbed] })
                    
                    // LOG DATABASE INFORMATION FOR 2ND MESSAGE
                    ticketSchema.findOneAndUpdate({
                        CREATOR_NAME: interaction.user.username
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
                ticketChannel.send({embeds: [quitConfirmedEmbed]})
            }
            // END OF "VIRTUAL TUID CARD"




            /***********************************************************/
            /*      MORE INFO PROMPT                                   */
            /***********************************************************/
            if(interaction.customId === 'Data_Privacy') {
                await interaction.deferUpdate()


                // EMBED MESSAGE
                let MoreInfoEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`**Data and Privacy**`)
                    .setDescription(`**What info is collected?**\nThe bot temporarily collects the minimum information it needs to function. See below for specifics.
                                 \n\n**Where is the information stored?**\nIn a remote and secured MongoDB database. ${config.botName} and ${config.botAuthorUsername} are the only users who can modify information in the database. Moderators and admins have access to view and inspect the database.
                                 \n\n**How do I know nothing malicious is going on?**\nAll the code for ${config.botName} is stored in a [public GitHub repository](${pjson.repository.url.split(`+`).pop()}). Please check it out!
                                 \n\n**What information does the bot store?**\nThe following is stored when you verify with ${config.botName} (see the image below for an example screenshot from the database for a ticket entry):`)

                    .addField(`Guild ID`, `An 18-digit number representing the server`, true)
                    .addField(`Guild Name`, `Name of the server where you created the ticket`, true)
                    .addField(`Username`, `Your username (e.g. \`\`${interaction.user.username}\`\`)`, true)
                    .addField(`UserID`, `Your unique 18-digit identifier on Discord (e.g. \`\`${interaction.user.id}\`\`)`, true)
                    .addField(`Bot message IDs`, `ID's of the messages ${config.botName} has sent you.`, true)
                    .addField(`Channel ID`, `The channel ID for mods and admins in the Temple server to oversee your ticket progress (e.g. \`\`869084159753216090\`\`)`, true)
                    .addField(`Ticket Close Date`, `The day the ticket is scheduled to automatically close (1 week after starting)`, true)
                    .addField(`Creation Date`, `When the ticket was created by you`, true)
                    .addField(`Updated Date`, `When the database entry was last modified by the bot.`, true)
                    .setImage(`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/Testing/ExampleDbInfo.png`)

                    .addField(`\nStill have questions?`, `Please send them in the chat below or create a ModMail ticket and ${config.botAuthorUsername} will be happy to answer your questions.`)


                // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
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
                                    msg.edit({embeds: [MoreInfoEmbed] })
                                })
                        })
                }


                // IF 2ND DM MESSAGE DNE, POST THEN LOG MESSAGE ID
                else {
                    let SecondDmMsg = await interaction.user.send({embeds: [MoreInfoEmbed] })
                    
                    // LOG DATABASE INFORMATION FOR 2ND MESSAGE
                    ticketSchema.findOneAndUpdate({
                        CREATOR_NAME: interaction.user.username
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
                ticketChannel.send({embeds: [quitConfirmedEmbed]})
            }
            // END OF "PHYSICAL TUID CARD"
        }
	},
};