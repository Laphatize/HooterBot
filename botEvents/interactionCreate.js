const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require ('../config.json');
const guildSchema = require('../Database/guildSchema');
const ticketSchema = require('../Database/ticketSchema');
const moment = require('moment');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

        let ticketChannelName = `Verification-${interaction.user.username}`

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
                interaction.reply({ content: `**Verification started!** Please check for a DM from HooterBot to complete your verification.`, ephemeral: true })
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


                // INITIALIZING BUTTON
                let TUidCardButton = new MessageButton()
                    .setLabel("Physical TUid Card")
                    .setStyle("SECONDARY")
                    .setCustomId("physical_TUid_Card")
                    .setDisabled(false)
                let VirtualTUidCardButton = new MessageButton()
                    .setLabel("Virtual TUid Card")
                    .setStyle("SECONDARY")
                    .setCustomId("virtual_TUid_Card")
                    .setDisabled(true)
                let TuPortalButton = new MessageButton()
                    .setLabel("TUportal")
                    .setStyle("SECONDARY")
                    .setCustomId("TU_portal")
                    .setDisabled(true)
                let CancelButton = new MessageButton()
                    .setLabel("Quit Verification")
                    .setStyle("DANGER")
                    .setCustomId("quit")
                    .setDisabled(false)

                // BUTTON ROW
                let initialButtonRow = new MessageActionRow()
                    .addComponents(
                        TUidCardButton,
                        VirtualTUidCardButton,
                        TuPortalButton,
                        CancelButton
                    );



                // DMING USER THE INITIAL VERIFICATION PROMPT
                let firstDMmsg = await interaction.user.send({embeds: [ticketOpenEmbed], components: [initialButtonRow] })
                    .catch(err => {
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
                            
                        // UPDATING THE INITIAL EPHEMERAL MESSAGE IN #ROLES
                        interaction.editReply({ content: `${config.emjREDTICK} **Error!** I was not able to start verification because **I am not able to DM you!**\nYou'll need to allow DMs from server members until the verification process is completed. You can turn this on in the **privacy settings** for the server.\nOnce enabled, please try to begin verification again. Submit a ModMail ticket if this issue persists.`, ephemeral: true })
                            .catch(err => console.log(err))
                    })


                // GRABBING THE DM MESSAGE ATTEMPT
                // SUCESSFUL
                if(firstDMmsg) {
                    console.log(`the initial DM is VALID and the bot will DM and create the channel.`)
                    // FETCH TICKET CATEGORY FROM DATABASE
                    if(dbGuildData.TICKET_CAT_ID) {
                        ticketCategory = dbGuildData.TICKET_CAT_ID;
                    }


                    // GRABBING BOT ROLE
                    let botRole = interaction.guild.me.roles.cache.find((role) => role.name == 'HooterBot');


                    // CREATE TICKET CHANNEL USING CLICKER'S USERNAME
                    interaction.guild.channels.create(`${ticketChannelName}`, {
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


                    // CREATE INTRO EMBED FOR ADMIN/MOD TICKET CHANNEL
                    let newTicketEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`**Verification Ticket Opened**`)
                        .addField(`User:`, `${interaction.user}`, true)
                        .addField(`User Tag:`, `${interaction.user.tag}`, true)
                        .addField(`User ID:`, `${interaction.user.id}`, true)
                        .setFooter(`Please do not send a message in this channel unless it is in response to a user's question.`)


                    // SENDING INTRO EMBED TO ADMIN/MOD TICKET CHANNEL
                    modAdminChId = interaction.guild.channels.cache.find(ch => ch.name === ticketChannelName).id

                    interaction.guild.channels.fetch(ch => ch.id === modAdminChId).send({ embeds: [newTicketEmbed]})
                    


                //     // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
                //     const dbTicketData = await ticketSchema.findOne({
                //         GUILD_ID: interaction.guild.id
                //     }).exec();

                //     // LOG DATABASE INFORMATION FOR TICKET
                //     if(!dbTicketData) {
                //         await ticketSchema.findOneAndUpdate({
                //             GUILD_ID: interaction.guild.id
                //         },{
                //             GUILD_ID: interaction.guild.id,
                //             GUILD_NAME: interaction.guild.name,
                //             CREATOR_NAME: interaction.user.username,
                //             CREATOR_ID: interaction.user.id,
                //             DM_INITIALMSG_ID: "",
                //             DM_2NDMSG_ID: "",
                //             STAFF_CH_ID: newTicketChannel.id,
                //         },{
                //             upsert: true
                //         }).exec();
                //     }



                //     // DB - GRABBING INITIAL VERIFICATION PROMPT MESSAGE ID
                //     await ticketSchema.findOneAndUpdate({
                //         GUILD_ID: interaction.guild.id
                //     },{
                //         DM_INITIALMSG_ID: firstDMmsg.id,
                //     },{
                //         upsert: true
                //     }).exec();


                    
                //     // LOGGING TICKET OPENING IN LOGS CHANNEL
                //     let logErrorEmbed = new discord.MessageEmbed()
                //         .setColor(config.embedGreen)
                //         .setTitle(`${config.emjGREENTICK} New Verification Ticket!`)
                //         .addField(`User:`, `${interaction.user}`, true)
                //         .addField(`User ID:`, `${interaction.user.id}`, true)
                //         .addField(`Mod/Admin Channel:`, `${newTicketChannel}`, true)
                //         .addField(`Ticket Closing Date:`, `${moment(Date.now()).add(7, 'days').utcOffset(-5).format("dddd, MMMM DD YYYY, h:mm:ss a")}`)
                //         .setTimestamp()
                        

                //     // LOG ENTRY
                //     client.channels.cache.get(config.logActionsChannelId).send({embeds: [logErrorEmbed]})
                // }
                
                // // USER IS DM-ABLE, CONTINUE
                // else {
                //     console.log(`the initial DM is INVALID, do not create a channel and end here.`)
                //     return;
                // }                
                }
                // END OF "BEGIN VERIFICATION (INITIAL PROMPT in #ROLES)" PROMPT BUTTON




                // /***********************************************************/
                // /*      PHYSICAL TUID CARD                                 */
                // /***********************************************************/
                // if(interaction.customId === 'physical_TUid_Card') {
                //     await interaction.deferUpdate()
                //     await wait(2000);

                //     let disabledTUidCardButton = new MessageButton()
                //     .setLabel("Physical TUid Card")
                //     .setStyle("SECONDARY")
                //     .setCustomId("physical_TUid_Card")
                //     .setDisabled(true)

                //     // BUTTON ROW
                //     let buttonRow = new MessageActionRow()
                //         .addComponents(
                //             disabledTUidCardButton,
                //             VirtualTUidCardButton,
                //             TuPortalButton,
                //             CancelButton
                //         );

                //     // POST THE PHYSICAL TUID CARD EMBED
                //     await interaction.reply({embeds: [ticketEmbed], components: [buttonRow] })


                // }







            }
            // END OF "BEGIN VERIFICATION" PROMPT BUTTON




            /***********************************************************/
            /*      QUIT VERIFICATION (ANY PROMPT IN DMS)              */
            /***********************************************************/

                if(interaction.customId === 'quit') {

                    // GENERATING QUIT CONFIRMATION EMBED FOR DM
                    let quitConfirmEmbed = new discord.MessageEmbed()
                        .setColor(config.embedTempleRed)
                        .setTitle(`**Close confirmation.**`)
                        .setDescription(`Please confirm ticket cancellation.`)

                    // INITIALIZING BUTTON
                    let quitConfirmButton = new MessageButton()
                        .setLabel("Yes, Quit")
                        .setStyle("DANGER")
                        .setCustomId("quit_confirmation")
                    let cancelQuitButton = new MessageButton()
                        .setLabel("Cancel")
                        .setStyle("SECONDARY")
                        .setCustomId("cancel_quit")
            
                    // BUTTON ROW
                    let buttonRow = new MessageActionRow()
                    .addComponents(
                        quitConfirmButton,
                        cancelQuitButton
                    );

                    // DMING USER THE INITIAL QUIT PROMPT
                    interaction.user.send({embeds: [quitConfirmEmbed], components: [buttonRow] })
                        .catch(err => console.log(err))

                }
                // END OF "QUIT" BUTTON




                /***********************************************************/
                /*      QUIT CONFIRM (2nd QUIT IN DMS)                     */
                /***********************************************************/
                if(interaction.customId === 'quit_confirmation') {

                    // DELETING DATABASE ENTRY

                        // *****NEED TO ADD*****

                    // GENERATING QUIT CONFIRMATION EMBED FOR DM
                    let quitConfirmedEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`**${config.emjGREENTICK} Ticket Closed.**`)
                        .setDescription(`Your verification ticket has been closed. The information in this DM has been purged from the bot.
                        \n\nIf you wish to verify later, please open a new ticket using the verification prompt in <#${config.rolesChannelId}>.`)

                    // DMING USER THE QUIT CONFIRMATION
                    interaction.user.send({embeds: [quitConfirmedEmbed] })
                        .catch(err => console.log(err))
                }
                // END OF "QUIT CONFIRM" BUTTON






















                /***********************************************************/
                /*      QUIT CONFIRM (2nd QUIT IN DMS)                     */
                /***********************************************************/









        }
	},
};