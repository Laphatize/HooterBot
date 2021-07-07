const discord = require('discord.js')
const guildSchema = require('../../Database/guildSchema')
const updateCache = require('../../Events/updateCache')
const config = require('../../config.json')

module.exports = {
    name: `setprefix`,
    aliases: [`botprefix`, `changeprefix`],
    description: `(${config.emjAdmin}) A command to change the prefix of ${config.botName}.`,
    expectedArgs: ' <new_prefix> ',
    cooldown: -1,
    minArgs: 1,
    maxArgs: 1,
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );


        // IF PREFIX LONGER THAN 5 CHARACTERS
        if (arguments[0].length > 5) {
            let longPrefixEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`${config.emjREDTICK} Error!`)
            .setDescription(`Sorry, please provide a prefix that is 5 characters long or smaller.`)
            return message.channel.send({embeds: [longPrefixEmbed]})
        }


        const newPrefix = arguments[0]

        let prefixChanger = message.author;

        await guildSchema.findOneAndUpdate({
            // CONTENT USED TO FIND UNIQUE ENTRY
            GUILD_NAME: message.guild.name,
            GUILD_ID: message.guild.id
        },{
            // CONTENT TO BE UPDATED
            PREFIX: newPrefix
        },{ 
            upsert: true
        })


        // DEFINING UPDATE EMBED
        let updatePrefixEmbed = new discord.MessageEmbed()
        .setColor(config.embedGreen)
        .setTitle(`${config.emjGREENTICK} Prefix Updated!`)
        .setDescription(`The new prefix is **${newPrefix}** (e.g. \`\`${newPrefix}command\`\`).`)


        // SENDING EMBED
        message.channel.send({embeds: [updatePrefixEmbed]})
        

        // DEFINING LOG EMBED
        let logPrefixUpdateEmbed = new discord.MessageEmbed()
        .setColor(config.embedDarkGrey)
        .setTitle(`Prefix Updated`)
        .setDescription(`**New command prefix:** \`\` ${newPrefix} \`\`\n**Changed by:** ${prefixChanger}`)
        .setTimestamp()
        

        // LOG ENTRY
        client.channels.cache.get(config.logActionsChannelId).send({embeds: [logPrefixUpdateEmbed]})
        

        // UPDATE CACHE
        updateCache(message.guild.id, newPrefix)
    }
}