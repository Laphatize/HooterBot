const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require ('../config.json');
const guildSchema = require('../Database/guildSchema');
const ticketSchema = require('../Database/ticketSchema');
const moment = require('moment');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

        // TICKET CHANNEL NAME
        let ticketChannelName = `verify-${interaction.user.username}`;


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
                if (interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === ticketChannelName.toLowerCase())) {
                    // CANCEL AND RESPOND WITH EPHEMERAL - USER ALREADY IN VERIFYING PROCESS
                    return interaction.reply({
                        content: `Sorry, you're **already in the process of verifying!** Check your DMs with HooterBot!\n*(If this is an error, please submit a ModMail ticket and let us know.)*`,
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
                    .setDescription(`Thanks for wanting to verify in the <:TempleT:857293539779018773> **Temple University server**.
                        \nThere are three ways you can verify you are a student or employee:
                        \n${config.indent}**1.** Use a physical TUid card
                        \n${config.indent}**2.** Use a virtual TUid card
                        \n${config.indent}**3.** Using TUportal
                        \n\nSelect the method using the buttons below to receive instructions. You can quit verification at any time using the red "Quit Verification" button.\n`)


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
                    closeDate = moment(Date.now()).add(7, 'days').utcOffset(-5).format("dddd, MMMM DD, YYYY")

                    // CREATE TICKET CHANNEL USING CLICKER'S USERNAME
                    await interaction.guild.channels.create(`${ticketChannelName}`, {
                        type: 'text',
                        parent: ticketCategory,
                        topic: 'Admins/Moderators can reply in this channel to send messages to the user.',
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
                        .then(modAdminTicketCh => {
                            // CREATE INTRO EMBED FOR ADMIN/MOD TICKET CHANNEL
                            let newTicketEmbed = new discord.MessageEmbed()
                                .setColor(config.embedGreen)
                                .setTitle(`**Verification Ticket Opened**`)
                                .addField(`User:`, `${interaction.user}`, true)
                                .addField(`User Tag:`, `${interaction.user.tag}`, true)
                                .addField(`User ID:`, `${interaction.user.id}`, true)
                                .addField(`Ticket Auto-Close On:`, `${closeDate}`)
                                .setFooter(`Please do not send a message in this channel unless it is in response to a user's question. (Note: feature not online yet)`)

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
                                .addField(`Ticket Auto-Closing On:`, `${closeDate}`)
                                .setTimestamp()
                                

                            // LOG ENTRY
                            client.channels.cache.get(config.logActionsChannelId).send({embeds: [logTicketOpenEmbed]})




                            // MESSAGE COLLECTOR:  USER DM MSGS -> TICKET CHANNEL
                            const dmCollector = interaction.user.dmChannel.createMessageCollector((m) => m.author.id !== config.botAuthorId);
                            dmCollector.on('collect', m => {
                                modAdminTicketCh.send(`**${interaction.user.tag}**: ${m.content}`)
                            });
                            // TURN OFF ONLY WHEN THE TICKET CHANNEL IS DELETED
                            dmCollector.on('end', async collected => {
                                await modAdminTicketCh.delete();
                                dmCollector.stop(`collector complete`);
                            })

                            // MESSAGE COLLECTOR:  TICKET CHANNEL -> DMs
                            const modAdminChCollector = modAdminTicketCh.createMessageCollector((m) => m.author.id !== config.botAuthorId);
                            modAdminChCollector.on('collect', m => {
                                interaction.user.send(`**Temple Server Staff**: ${m.content}`)
                            });
                            // TURN OFF ONLY WHEN THE TICKET CHANNEL IS DELETED
                            modAdminChCollector.on('end', async collected => {
                                await modAdminTicketCh.delete();
                                modAdminChCollector.stop(`collector complete`);
                            })
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

                        // FETCH THE LAST MESSAGE (THE DELETION CONFIRMATION)
                        dmCh.messages.fetch({ limit: 1 })
                            .then(messages => {
                                let lastMessage = messages.first();
                                lastMessage.delete();
                            })

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
                                        QuitButtonDisabled
                                    );


                                // EDITING THE INITIAL DM PROMPT TO DISABLE BUTTONS
                                msg.edit({embeds: [ticketOpenEmbed], components: [initialButtonRowDisabled] })
                            })
                    })
                    


                // // DELETE THE 2ND PROMPT MESSAGE IF IT EXISTS - NOT WORTH DISABLING ANY BUTTONS ON IT
                // if(dbTicketData.DM_2NDMSG_ID) {
                //     secondDmMsgId = dbGuildData.DM_2NDMSG_ID;
                //     // EDIT 2ND DM MSG SO BUTTONS ARE DISABLED
                // 
                // }



                // DELETING DATABASE ENTRY
                await ticketSchema.deleteOne({
                    CREATOR_ID: interaction.user.id
                }).exec();


                // GENERATING QUIT CONFIRMATION EMBED FOR DM
                let quitConfirmedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`**${config.emjGREENTICK} Ticket Closed.**`)
                    .setDescription(`Your verification ticket has been closed and you have **not** been verified.\nAll the information for this ticket has been purged from the bot.
                    \nIf you wish to verify at a later time, please open a new ticket using the prompt in <#${config.rolesChannelId}>.`)

                // DMING USER THE QUIT CONFIRMATION             
                interaction.channel.send({embeds: [quitConfirmedEmbed]})



                // CREATE TRANSCRIPT OF CHAT

                    // ** A BIG TO DO ITEM **


                

                // // LOGGING TICKET CLOSURE - THIS NEEDS TO HAPPEN AFTER THE MODS/ADMINS OK TICKET CLOSURE
                // let logCloseTicketEmbed = new discord.MessageEmbed()
                //     .setColor(config.embedRed)
                //     .setTitle(`${config.emjREDTICK} Verification Ticket Closed`)
                //     .addField(`User:`, `${interaction.user}`, true)
                //     .addField(`User ID:`, `${interaction.user.id}`, true)
                //     .addField(`Verified?`, `**No**`, true)
                //     .addField(`Ticket closed early by:`, `${interaction.user}`)
                //     .setTimestamp()
                
                // // LOG ENTRY
                // client.channels.cache.get(config.logActionsChannelId).send({ embeds: [logCloseTicketEmbed] })

                
                // CLOSURE NOTICE TO CHANNEL
                let closeNotice = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Verification Close Notice`)
                    .setDescription(`${interaction.user.username} has closed this ticket on their end. If the contents of this ticket do not need to be archived for any moderation actions, press the button below to permanently delete this channel.`)

                client.guild.channels.cache.get(ch => ch.name === ticketChannelName).send({ embeds: [closeNotice] })

            }
            // END OF "QUIT CONFIRM DMS" BUTTON




            /***********************************************************/
            /*      QUIT CONFIRM (2nd QUIT IN MOD/ADMIN CHANNEL)       */
            /***********************************************************/


            // END OF "QUIT CONFIRM ADMIN/MOD CH" BUTTON





            // /***********************************************************/
            // /*      PHYSICAL TUID CARD                                 */
            // /***********************************************************/
            // if(interaction.customId === 'physical_TUid_Card') {
            //     await interaction.deferUpdate()

            //     let disabledTUidCardButton = new MessageButton()
            //     .setLabel("Physical TUid Card")
            //     .setStyle("SECONDARY")
            //     .setCustomId("physical_TUid_Card")
            //     .setDisabled(true)


            //     // EMBED MESSAGE
            //     let physicalTUidEmbed = new discord.MessageEmbed()
            //         .setColor(config.embedTempleRed)
            //         .setTitle(`**Physical TUid Card**`)
            //         .setDescription(`To verify with a physical TUiD card:\n
            //             ${config.indent}**1.** Hold your TUid card up next to your screen with Discord open.\n
            //             ${config.indent}**2.** Take a picture of your card and Discord screen. Make sure the bottom-left corner of Discord is visible so your avatar, username, and tag are visible.\n
            //             ${config.indent}***Note:** If you have a custom status set, you'll need to hover your mouse over the section so your tag is visible.*\n
            //             ${config.indent}**3.** Reply to this message below with the picture as an attachment. **Please obscure any personally identifiable information (pictures, names) you wish to not share before sending.**\n
            //             ${config.indent}**4.** Wait for a response from server staff. Responses may take up to 2 days.\n\n
            //             When this ticket is complete, its contents are permanently deleted. If you have any questions, please send them in the chat below. If you wish to change verification methods, select a different button in the message above.\n`)


            //     // BUTTON ROW
            //     let buttonRow = new MessageActionRow()
            //         .addComponents(
            //             disabledTUidCardButton,
            //             VirtualTUidCardButton,
            //             TuPortalButton,
            //             QuitButton
            //         );

            //     // POST THE PHYSICAL TUID CARD EMBED
            //     await interaction.user.send({embeds: [physicalTUidEmbed], components: [buttonRow] })
            // }
            // // END OF "PHYSICAL TUID CARD"
        }
	},
};