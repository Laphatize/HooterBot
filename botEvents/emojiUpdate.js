const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'emojiUpdate',
	async execute(oldEmoji, newEmoji, client) {

        // LOG CHANNEL
        const modLogChannel = newEmoji.guild.channels.cache.find(ch => ch.name === `mod-log`)

        let guildEmoji = newEmoji.guild.emojis.cache.find(emoji => emoji.name === newEmoji.name)

        // EMOJI NAME CHANGE
        if(oldEmoji.name !== newEmoji.name) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Emoji Renamed`)
                .setDescription(`**Responsible:** ${guildEmoji.author}`)
                .addField(`**Old Name:**`, `${oldEmoji.name}`, true)
                .addField(`\u200b`, `🠮`, true)
                .addField(`**New Name:**`, `${newEmoji.name}`, true)
                .setImage(newEmoji.url)
                .setFooter(`Emoji ID: ${newEmoji.id}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }
	},
};