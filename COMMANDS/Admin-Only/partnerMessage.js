const discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `partnerMessage`,
    aliases: [`partnerAnnouncement`, `partnerMsg`],
    description: `(${config.emjAdmin}) Generate an embed in \#server-announcements to promote messages from partner servers.`,
    expectedArgs: ' <partner name> | <message> | <(optional) direct image URL>',
    cooldown: -1,
    minArgs: 1,
    maxArgs: 1,
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {  
        
        message.channel.send(hi)

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );

        
        // COMBINING ARGS INTO STRING SO FULL MESSAGE CAN BE POSTED
        const fullCommand = arguments.join(' ');


        // REJECTING IF MESSAGE DOES NOT CONTAIN AT LEAST ONE SEPARATOR
        if (!fullCommand.includes("|")) {
            // IF NO TICKET CATEGORY, SEND MESSAGE IN CHANNEL
            let notFormattedEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`${config.emjREDTICK} **Error!**`)
            .setDescription(`You need to use a \`\` | \`\` in your command. Use the following format:\n\n \`\` <partner name> | <message> \`\``)

            // SENDING TO CHANNEL
            message.channel.send({embeds: [notFormattedEmbed]})
            // DELETE AFTER 10 SECONDS
            .then(msg => {client.setTimeout(() => msg.delete(), 10000 )})
            .catch(err => console.log(err))
            return
        }


        // PARTNER NAME
        splitPoint = fullCommand.split('|')
        partnerName = splitPoint[0].trim()
        partnerMsg = splitPoint[1].trim()
        imageURL = splitPoint[2].trim()


        // EMBED MESSAGE WITHOUT IMAGE
        if(!splitPoint[2]) {
        let partnerEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`**Announcement from our partnered server:\n${partnerName}**`)
            .setDescription(`${partnerMsg}`)
            .addField('\u200B', '\u200B') // BLANK FIELD FOR SEPARATION
            .addField(`Want to join this partnered server?`, `Head to <#832684556598640691> for the invite link!`)
            
            // POSTING EMBED MESSAGE AND BUTTON
            await client.channels.cache.get(config.serverAnnouncementsId).send({embeds: [partnerEmbed]})
            .catch(err => {
                // LOGGING
                console.log(err)

                // INFORMING USER
                let msgSendErrorEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Error!`)
                .setDescription(`Sorry, there was a problem sending your Partner Message. <#${config.botAuthorId}> please investigate.\nI have recovered the message:`)
                .addField(`partnerName`, `\`\`${partnerName}\`\``)
                .addField(`partnerMsg`, `\`\`${partnerMsg}\`\``)
                .setTimestamp()
                message.channel.send({embeds: [msgSendErrorEmbed]})
            })
        }


        // EMBED MESSAGE WITH IMAGE
        if(splitPoint[2]) {
            let partnerEmbedImage = new discord.MessageEmbed()
                .setColor(config.embedDarkGrey)
                .setTitle(`**Announcement from our partnered server:\n${partnerName}**`)
                .setDescription(`${partnerMsg}`)
                .addField('\u200B', '\u200B') // BLANK FIELD FOR SEPARATION
                .setImage(`${imageURL}`)
                .addField(`Want to join this partnered server?`, `Head to <#832684556598640691> for the invite link!`)


            // POSTING EMBED MESSAGE AND BUTTON
            await client.channels.cache.get(config.serverAnnouncementsId).send({embeds: [partnerEmbedImage]})
            .catch(err => {
                // LOGGING
                console.log(err)

                // INFORMING USER
                let msgSendErrorEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Error!`)
                .setDescription(`Sorry, there was a problem sending your Partner Message. <#${config.botAuthorId}> please investigate.\nI have recovered the message:`)
                .addField(`partnerName`, `\`\`${partnerName}\`\``)
                .addField(`partnerMsg`, `\`\`${partnerMsg}\`\``)
                .addField(`imageURL`, `\`\`${imageURL}\`\``)
                .setTimestamp()
                message.channel.send({embeds: [msgSendErrorEmbed]})
            })
        }
    }
}