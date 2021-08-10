const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');
const ticketSchema = require('./Database/ticketSchema');

module.exports = {
	name: 'guildMemberRemove',
	async execute(member, client) {

        // LOGGING NEW USER JOINING GUILD
        const modLogChannel = member.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // JOIN EMBED
        let logLeaveGuild = new discord.MessageEmbed()
            .setColor(config.embedOrange)
            .setTitle(`Server Member Left`)
            .addField(`User:`, `${member}`, true)
            .addField(`Tag:`, `${member.user.tag}`, true)
            .addField(`ID:`, `${member.id}`, true)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logLeaveGuild]})


                
        // CHECK IF USER HAS A VERIFICATION TICKET OPEN
        const dbTicketData = await ticketSchema.find({
            CREATOR_ID: member.id
        }).exec();


        // NO TICKET
        if(!dbTicketData)  return;


        // TICKET OPEN
        if(dbTicketData) {
            guild.members.fetch(dbTicketData.CREATOR_ID)
            .then(dmUser => {

                // EDITING THE INITIAL DM MESSAGE TO DISABLE THE BUTTONS
                dmUser.createDM()
                    .then(ch => {
                        ch.messages.fetch(dbTicketData.DM_INITIALMSG_ID)
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
                                msg.edit({embeds: [ticketOpenEmbed], components: [initialButtonRowDisabled, secondButtonRowDisabled] })
                                    .catch(err => console.log(err))      
                            })

                        // DELETE THE 2ND PROMPT MESSAGE IF IT EXISTS - NOT WORTH DISABLING ANY BUTTONS ON IT
                        if(dbTicketData.DM_2NDMSG_ID) {
                                                        
                            // FETCH MESSAGE BY ID
                            secondDmMsg = dmCh.messages.fetch(dbTicketData.DM_2NDMSG_ID)
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 0 );
                                })
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

                // DELETING DATABASE ENTRY
                ticketSchema.deleteOne({
                    CREATOR_ID: dmUser.id
                }).exec();


                // LOGGING TICKET CLOSURE
                let logCloseTicketEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Verification Ticket Closed`)
                    .addField(`User:`, `${dmUser}`, true)
                    .addField(`User ID:`, `${dmUser.id}`, true)
                    .addField(`Verified?`, `\`\` NO \`\``, true)
                    .addField(`Ticket closed by:`, `<@${config.botId}> ***(automatically)***`)
                    .setTimestamp()
                

                // SENDING LOG ENTRY
                guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logCloseTicketEmbed] })
                    .catch(err => console.log(err))

                
                // CLOSURE NOTICE TO CHANNEL
                let closeNotice = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} User Left Server`)
                    .setDescription(`**<@${config.botId}>** has automatically closed this ticket since the user has left the server. This message constitutes as the last message of the transcript; the DM-channel communications with the user have been severed.\n\nIf the contents of this ticket do not need to be archived for moderation actions, press \`\`Confirm Ticket Close\`\` to **permanently delete this channel *immediately***.\n\nIf this channel needs to be archived for moderation actions, press \`\`Do Not Close\`\` to keep this channel.`)
                    .setTimestamp()


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


                dmUser = client.users.fetch(dmUser.id)
                    .then(dmUser => {
                        // FETCHING TICKET CHANNEL AND SENDING CLOSURE NOTICE
                        client.channels.cache.find(ch => ch.name === `verify-${dmUser.username.toLowerCase()}`).send({ embeds: [closeNotice], components: [TicketCloseReviewButtonRow] })
                            .then(msg => {
                                // CHANGING TICKET CHANNEL NAME TO "closed-(username)" TO CUT DM-CHANNEL COMMS
                                msg.channel.setName(`closed-${dmUser.username.toLowerCase()}`)

                                        // EDIT THE INITIAL TICKET MESSAGE TO DISABLE BUTTON
                                    // GRAB TICKET CHANNEL
                                    initialChMsg = client.channels.cache.find(ch => ch.name === `closed-${dmUser.username.toLowerCase()}`)
                                        .then(ch => {
                                            // GRABBING THE INITIAL MESSAGE FROM TICKET CHANNEL
                                            msg = ch.messages.fetch(dbTicketData.TICKETCH1_MSG_ID)

                                            // CREATE INTRO EMBED FOR ADMIN/MOD TICKET CHANNEL
                                            let newTicketEditedEmbed = new discord.MessageEmbed()
                                                .setColor(config.embedGreen)
                                                .setTitle(`**Verification Ticket Closed**`)
                                                .addField(`User:`, `${dmUser}`, true)
                                                .addField(`User Tag:`, `${dmUser.tag}`, true)
                                                .addField(`User ID:`, `${dmUser.id}`, true)
                                                .setDescription(`*This ticket has been closed because the user has left the server.*`)

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
                            .catch(err => console.log(err))
                    })
            })
        }
	},
};