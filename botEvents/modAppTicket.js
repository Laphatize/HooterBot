const discord = require('discord.js');
const config = require ('../config.json');


module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

        /***********************************************************/
        /*      MOD APPLICATION BUTTON                             */
        /***********************************************************/

        // MOD APP CHANNEL NAME
        let modAppChannelName = `modApp-${interaction.user.username.toLowerCase()}-${interaction.user.id}`;


        // IGNORNING NON-BUTTON INTERACTIONS
        if(interaction.isButton()) {

            if(interaction.customId === 'modAppApply') {
                
                var memberDuration;
                const monthRequirement = (1) * 2628002880

                // GET INTERACTION MEMBER AS GUILD MEMBER
                interaction.guild.members.fetch(interaction.user.id)
                    .then( guildMemberApplicant => {
                        // CALCULATE TIME MEMBER HAS BEEN IN SERVER
                        memberDuration = Math.abs(new Date - new Date(guildMemberApplicant.joinedAt))
                    })


            // USER JOINED LESS THAN 1 MONTH AGO
            if(memberDuration < monthRequirement) {
                return interaction.reply({
                    content: `Sorry, you are not eligible to apply at this time. (Joined less than 1 month ago)`,
                    ephemeral: true })
            }


            // IF MEMBER IS CURRENTLY MUTED
            if(interaction.member.roles.cache.some((role) => role.name === 'Muted :(')) {
                return interaction.reply({
                    content: `Sorry, you are not eligible to apply at this time.`,
                    ephemeral: true })
            }


            // IF MEMBER IS MOD OR ADMIN
            if(interaction.member.roles.cache.some((role) => role.name.toLowerCase() === 'moderator')
            || interaction.member.roles.cache.some((role) => role.name.toLowerCase() === 'admin')) {
                return interaction.reply({
                    content: `Sorry, you are not eligible to apply. You're already in, silly!`,
                    ephemeral: true })
            }


            // CHECK IF THERE EXISTS A TICKET CHANNEL FOR THE USER CURRENTLY
            if (interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === modAppChannelName)) {
                // CANCEL AND RESPOND WITH EPHEMERAL - USER ALREADY IN VERIFYING PROCESS
                return interaction.reply({
                    content: `Sorry, you're **already in the process of verifying!** Check your DMs with <@${config.botId}>!\n*(If this is an error, please submit a ModMail ticket and let us know.)*`,
                    ephemeral: true })
            }


            interaction.reply({ content: `Your ticket will start (...once MMM builds the code for that.)`})


            //     // EMPHEMERAL REPLY TO BUTTON PRESS - IF ELIGIBLE TO APPLY
            //     interaction.reply({ content: `**Verification started!** Please check for a DM from HooterBot to complete your verification.\n**Didn't receive a DM?** Please create a ModMail ticket and let us know!`, ephemeral: true })
            //         .catch(err => console.log(err))



            //     // GENERATING INITIAL EMBED FOR DM
            //     let ticketOpenEmbed = new discord.MessageEmbed()
            //         .setColor(config.embedTempleRed)
            //         .setTitle(`**Verification - Ticket Opened**`)
            //         .setDescription(`Thanks for wanting to verify in the <:TempleT:857293539779018773> **Temple University server**. This verification ticket will be open for 1 week, closing automatically on ${moment(Date.now()).add(7, 'days').utcOffset(-4).format("dddd, MMMM DD")}. When this ticket is completed or closed, its contents are permanently deleted.
            //             \nThere are three ways you can verify you are a student or employee:
            //             \n${config.indent}**1.** Use a physical TUid card
            //             \n${config.indent}**2.** Use a virtual TUid card
            //             \n${config.indent}**3.** Using TUportal
            //             \n\nSelect a method using the buttons below to receive further instructions. You may quit verification at any time using the red "Quit Verification" button.
            //             \n**Have questions?** Please send a message here in DMs to Hooterbot and a member of the server staff will respond shortly. If your message gets a green check reaction, it was sent successfully. Messages sent in the channel cannot be edited or deleted on the mod/admin side once sent.`)


            //     // INITIALIZING BUTTONS 
            //     let TUidCardButton = new MessageButton()
            //         .setLabel("Physical TUid Card")
            //         .setStyle("SECONDARY")
            //         .setCustomId("physical_TUid_Card")
            //         .setDisabled(false)
            //     let VirtualTUidCardButton = new MessageButton()
            //         .setLabel("Virtual TUid Card")
            //         .setStyle("SECONDARY")
            //         .setCustomId("virtual_TUid_Card")
            //         .setDisabled(false)
            //     let TuPortalButton = new MessageButton()
            //         .setLabel("TUportal")
            //         .setStyle("SECONDARY")
            //         .setCustomId("TU_portal")
            //         .setDisabled(false)
            //     let InfoButton = new MessageButton()
            //         .setLabel("Data & Privacy Info")
            //         .setStyle("PRIMARY")
            //         .setCustomId("Data_Privacy")
            //         .setDisabled(false)
            //     let QuitButton = new MessageButton()
            //         .setLabel("Quit Verification")
            //         .setStyle("DANGER")
            //         .setCustomId("quit_DM")
            //         .setDisabled(false)

            //     // BUTTON ROWS
            //     let initialButtonRow = new MessageActionRow()
            //         .addComponents(
            //             TUidCardButton,
            //             VirtualTUidCardButton,
            //             TuPortalButton,
            //         );

            //     let secondButtonRow = new MessageActionRow()
            //     .addComponents(
            //         InfoButton,
            //         QuitButton
            //     );



            //     // DMING USER THE INITIAL VERIFICATION PROMPT
            //     let firstDMmsg = await interaction.user.send({ embeds: [ticketOpenEmbed], components: [initialButtonRow, secondButtonRow] })
            //         .catch(err => {

            //             // UPDATING THE INITIAL EPHEMERAL MESSAGE IN #ROLES
            //             interaction.editReply({ content: `${config.emjREDTICK} **Error!** I was not able to start verification because **I am not able to DM you!**\nYou'll need to allow DMs from server members until the verification process is completed. You can turn this on in the **privacy settings** for the server.\nOnce enabled, please try to begin verification again. Submit a ModMail ticket if this issue persists.`, ephemeral: true })
            //                 .catch(err => console.log(err))
            //             // THE USER DOES NOT ALLOW DMs FROM THE BOT B/C PRIVACY SETTINGS! - DO NOT LOG, WE KNOW THE CHANNEL DOESN'T EXIST
            //             // LOGGING TICKET OPEN ERROR
            //             let logVerifStartErrorEmbed = new discord.MessageEmbed()
            //                 .setColor(config.embedOrange)
            //                 .setTitle(`${config.emjORANGETICK} Verification Attempt Issue!`)
            //                 .addField(`User:`, `${interaction.user}`, true)
            //                 .addField(`User ID:`, `${interaction.user.id}`, true)
            //                 .addField(`Problem:`, `The user does not allow DMs from server members. HooterBot is not able to initiate the verification process.\n\nIf this error continues to appear, **please reach out to the user.**`)
            //                 .setTimestamp()
                    

            //             // LOG ENTRY
            //             interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logVerifStartErrorEmbed] })
            //         })

                    


            //     // GRABBING THE DM MESSAGE ATTEMPT
            //     // SUCESSFUL
            //     if(firstDMmsg) {
                    
            //         // CHECK IF DATABASE HAS AN ENTRY
            //         const dbGuildData = await guildSchema.findOne({
            //             GUILD_ID: interaction.guild.id
            //         }).exec();


            //         let ticketCategory;

            //         // FETCH TICKET CATEGORY FROM DATABASE
            //         if(dbGuildData.TICKET_CAT_ID) {
            //             ticketCategory = dbGuildData.TICKET_CAT_ID;
            //         }


            //         // GRABBING BOT ROLE
            //         let botRole = interaction.guild.me.roles.cache.find((role) => role.name == 'HooterBot');

            //         // GRABBING MOD AND ADMIN ROLES
            //         let modRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() == 'moderator');
            //         let adminRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() == 'admin');


            //         // GRABBING CURRENT DATE+TIME TO GENERATE CLOSE DATE AND REMINDER DATES
            //         closeDate = moment(Date.now()).add(7, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")
            //         FirstReminder = moment(Date.now()).add(2, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")
            //         SecondReminder = moment(Date.now()).add(6, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")

            //         // CREATE TICKET CHANNEL USING CLICKER'S USERNAME
            //         await interaction.guild.channels.create(`${ticketChannelName}`, {
            //             type: 'GUILD_TEXT',
            //             parent: ticketCategory,
            //             topic: `**\*\*Do not change this channel's name!\*\*** Messages sent here will go to the user's DMs and **cannot be edited or deleted once sent!**`,
            //             permissionOverwrites: [
            //                 {
            //                     // EVERYONE ROLE - HIDE (EVEN FROM USER)
            //                     id: interaction.guild.roles.everyone.id,
            //                     deny: [`VIEW_CHANNEL`, `USE_PUBLIC_THREADS`, `USE_PRIVATE_THREADS`]
            //                 },{
            //                     // ADMINS - VIEW AND RESPOND
            //                     id: adminRole.id,
            //                     allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`]
            //                 },{
            //                     // MODERATORS - VIEW AND RESPOND
            //                     id: modRole.id,
            //                     allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`]
            //                 },{
            //                     // HOOTERBOT ROLE - VIEW AND RESPOND
            //                     id: botRole.id,
            //                     allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`]
            //                 }
            //             ],
            //             reason: `Part of the verification process ran by HooterBot. Used to communicate with users while verifying.`
            //         })
            //             .then(async modAdminTicketCh => {
            //                 // CREATE INTRO EMBED FOR ADMIN/MOD TICKET CHANNEL
            //                 let newTicketEmbed = new discord.MessageEmbed()
            //                     .setColor(config.embedGreen)
            //                     .setTitle(`**Verification Ticket Opened**`)
            //                     .addField(`User:`, `${interaction.user}`, true)
            //                     .addField(`User Tag:`, `${interaction.user.tag}`, true)
            //                     .addField(`User ID:`, `${interaction.user.id}`, true)
            //                     .addField(`Check-in Reminder:`, `${FirstReminder}`, true)
            //                     .addField(`Close Notice Reminder:`, `${SecondReminder}`, true)
            //                     .addField(`Ticket Auto-Close:`, `${closeDate}`, true)
            //                     .setDescription(`**All messages** sent in this channel are sent to the user's DMs. **Messages cannot be edited or deleted once sent.** Threads cannot be created in this channel. Please do not send messages unless in response to a user.`)

            //                 let QuitButton = new MessageButton()
            //                     .setLabel("End Verification")
            //                     .setStyle("DANGER")
            //                     .setCustomId("quit_CH")
            //                     .setDisabled(false)
            
            //                 // BUTTON ROW
            //                 let QuitButtonModBtn = new MessageActionRow()
            //                     .addComponents(
            //                         QuitButton
            //                     );


            //                 // SENDING INTRO EMBED TO ADMIN/MOD TICKET CHANNEL
            //                 modAdminTicketCh.send({ embeds: [newTicketEmbed], components: [QuitButtonModBtn] })
            //                     .catch(err => console.log(err))
            //                     .then( ticketMsg => {
                                        
            //                     // LOG DATABASE INFORMATION FOR TICKET
            //                     ticketSchema.findOneAndUpdate({
            //                         CREATOR_ID: interaction.user.id
            //                     },{
            //                         GUILD_ID: interaction.guild.id,
            //                         GUILD_NAME: interaction.guild.name,
            //                         CREATOR_NAME: interaction.user.username.toLowerCase(),
            //                         CREATOR_ID: interaction.user.id,
            //                         DM_INITIALMSG_ID: firstDMmsg.id,
            //                         DM_2NDMSG_ID: "",
            //                         STAFF_CH_ID: modAdminTicketCh.id,
            //                         TICKET_CLOSE: closeDate,
            //                         REMINDER1_MSG_ID: "",
            //                         REMINDER2_MSG_ID: "",
            //                         TICKETCH1_MSG_ID: ticketMsg.id,
            //                     },{
            //                         upsert: true
            //                     }).exec();
            //                 })

                            
            //                 // LOGGING TICKET OPENING IN LOGS CHANNEL
            //                 let logTicketOpenEmbed = new discord.MessageEmbed()
            //                     .setColor(config.embedGreen)
            //                     .setTitle(`${config.emjGREENTICK} New Verification Ticket!`)
            //                     .addField(`User:`, `${interaction.user}`, true)
            //                     .addField(`User ID:`, `${interaction.user.id}`, true)
            //                     .addField(`Mod/Admin Channel:`, `${modAdminTicketCh}`, true)
            //                     .setDescription(`**Ticket Auto-Close:** ${closeDate}`)
            //                     .setTimestamp()


            //                 // LOG ENTRY
            //                 interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logTicketOpenEmbed] })
            //                     .catch(err => console.log(err))
            //             })
            //     }
            //     // END OF "BEGIN VERIFICATION (INITIAL PROMPT in #ROLES)" PROMPT BUTTON
            }
        }
	},
};