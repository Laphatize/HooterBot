const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../config.json');
const guildSchema = require('../../Database/guildSchema');

module.exports = {
    name: `maintenance`,
    aliases: [`verificationtogle`],
    description: `(Normally ${config.emjAdmin}, but not for testing) Toggles the verification prompt on or off for maintenance mode.`,
    category: `Verification`,
    expectedArgs: '<"on" = maintenance | "off" = regular use>',
    cooldown: -1,
    minArgs: 1,
    maxArgs: 1,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        let verifChanger = message.author;

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );


        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
            GUILD_ID: message.guild.id
        }).exec();


        // IF NO VERIFICATION PROMPT, SEND MESSAGE IN CHANNEL
        if(!dbData.VERIF_PROMPT_MSG_ID) {
            let noCatEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`You first need to create a verification prompt in the server using \`\`${config.prefix}verifEmbed\`\` in <#${config.rolesChannelId}> before the verification prompt can be toggled in and out of maintenance mode.`)

            // SENDING TO CHANNEL
            message.channel.send(noCatEmbed)
            // DELETE AFTER 10 SECONDS
                .then(msg => {client.setTimeout(() => msg.delete(), 10000 )})
                .catch(err => console.log(err))
                return
        }

        // IF VERIFICATION PROMPT EXISTS
        else if(dbData.VERIF_PROMPT_MSG_ID) {
            
            let verifStatus = arguments[0].toLowerCase();

            // MAINTENANCE MODE "ON"
            if(verifStatus == "on") {

                // MAINTENANCE EMBED MESSAGE
                let ticketMaintenanceEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`**Get verified!**`)
                    .setDescription(`A ticket will open in your DMs when you click the button below to start the verification process. Make sure you allow DMs from members of the server.
                    \n\n**Verification is currently OFFLINE for maintenance. Please check back again soon to open a verification ticket.**`)


                // INITIALIZING MAINTENANCE BUTTON - DISABLED AND COLOR CHANGE
                let VerifButtonMaintenance = new MessageButton()
                    .setLabel(`Begin Verification`)
                    .setStyle(`SECONDARY`)
                    .setCustomId(`begin_verification_button_disabld`)
                    .setDisabled(true)


                // BUTTON ROW
                let buttonRow = new MessageActionRow()
                    .addComponents(
                        VerifButtonMaintenance
                    );


                // POSTING MAINTENANCE EMBED MESSAGE AND BUTTON
                await message.channel.messages.fetch(dbData.VERIF_PROMPT_MSG_ID)
                    .then(msg => {
                        msg.edit({embeds: [ticketMaintenanceEmbed], components: [buttonRow]})
                    })
                    .catch(err => console.log(err))
                
                // DEFINING LOG EMBED
                let logTicketCatUpdateEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`Verification Embed Update`)
                    .setDescription(`**Maintenance mode:** \`\` ON \`\`\n**Ticket status:** Tickets **cannot** be created until maintenance mode is turned off.\n**Changed by:** ${verifChanger}`)
                    .setTimestamp()
                    
                // LOG ENTRY
                client.channels.cache.get(config.logActionsChannelId).send({embeds: [logTicketCatUpdateEmbed]})
                    .catch(err => console.log(err))
            }


            // MAINTENANCE MODE "OFF"
            if(verifStatus == "off") {
                let ticketEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`**Get verified!**`)
                    .setDescription(`A ticket will open in your DMs when you click the button below to start the verification process. Make sure you allow DMs from members of the server.`)
                    .setFooter(`Note: The contents of tickets are permanently deleted when tickets are closed. Please submit a ModMail ticket if you have any questions.`)


                // INITIALIZING MAINTENANCE BUTTON - ENABLED
                let VerifButton = new MessageButton()
                    .setLabel(`Begin Verification`)
                    .setStyle(`SUCCESS`)
                    .setCustomId(`begin_verification_button`)


                // BUTTON ROW
                let buttonRow = new MessageActionRow()
                    .addComponents(
                        VerifButton
                    );


                // POSTING MAINTENANCE EMBED MESSAGE AND BUTTON
                await message.channel.messages.fetch(dbData.VERIF_PROMPT_MSG_ID)
                    .then(msg => {
                        msg.edit({embeds: [ticketEmbed], components: [buttonRow]})
                    })
                    .catch(err => console.log(err))

                // DEFINING LOG EMBED
                let logTicketCatUpdateEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`Verification Embed Update`)
                    .setDescription(`**Maintenance mode:** \`\` OFF \`\`\n**Ticket status:** Tickets **can** be be created using the embed in <#${config.rolesChannelId}>.\n**Changed by:** ${verifChanger}`)
                    .setTimestamp()
                
                // LOG ENTRY
                client.channels.cache.get(config.logActionsChannelId).send({embeds: [logTicketCatUpdateEmbed]})
            }
        }
    }
}