const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require('../config.json');
const moment = require('moment');
const ticketSchema = require('../Database/ticketSchema')

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
            let leftUser = member.guild.members.fetch(dbTicketData.CREATOR_ID)

            // LOGGING TICKET CLOSURE
            let logCloseTicketEmbed = new discord.MessageEmbed()
                .setColor(config.embedOrange)
                .setTitle(`${config.emjORANGETICK} Verification Ticket Closed`)
                .addField(`User:`, `${member}`, true)
                .addField(`User ID:`, `${member.id}`, true)
                .addField(`Verified?`, `\`\` NO \`\``, true)
                .addField(`Ticket closed by:`, `<@${config.botId}> ***(automatically)***`)
                .setTimestamp()
            

            // SENDING LOG ENTRY
            member.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logCloseTicketEmbed] })
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


            // FETCHING TICKET CHANNEL AND SENDING CLOSURE NOTICE
            member.guild.channels.cache.find(ch => ch.name === `verify-${member.user.username.toLowerCase()}`).send({ embeds: [closeNotice], components: [TicketCloseReviewButtonRow] })
                .then(msg => {
                    // CHANGING TICKET CHANNEL NAME TO "closed-(username)" TO CUT DM-CHANNEL COMMS
                    msg.channel.setName(`closed-${member.user.username.toLowerCase()}`)
                })
                .catch(err => console.log(err))


            // DELETING DATABASE ENTRY
            ticketSchema.deleteOne({
                CREATOR_ID: member.user.id
            }).exec();
        }



        // CHECKING IF USER IS MUTED WHEN LEAVING
        if (member.roles.cache.some((role) => role.name === `Muted :(`)) {
            
            console.log(`${member.user.username} is muted in ${member.guild.name}, logging.`)
            

            // CHECK IF USER IS MUTED IN THE DATABASE
            const dbMutedData = await mutedUsersSchema.findOne({
                USER_ID: member.id
            }).exec();


            // USER DOESN'T EXIST IN DB BUT SHOULD
            if(!dbMutedData) {
                // LOG DATABASE INFORMATION
                await mutedUsersSchema.findOneAndUpdate({
                    USER_ID: member.id
                },{
                    USER_ID: member.id,
                },{
                    upsert: true
                }).exec();
            }

            console.log(`Mute has been logged.`)
        }
	},
};