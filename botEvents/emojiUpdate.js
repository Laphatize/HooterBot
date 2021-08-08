const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'emojiUpdate',
	async execute(oldEmoji, newEmoji, client) {

        // LOG CHANNEL
        const modLogChannel = newEmoji.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // EMOJI NAME CHANGE
        if(oldEmoji.name !== newEmoji.name) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`Emoji Renamed`)
                .addField(`**Old Name:**`, `${oldEmoji.name}`, true)
                .addField(`**New Name:**`, `${newEmoji.name}`, true)
                .setImage(newEmoji.url)
                .setFooter(`Emoji ID: ${emoji.id}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }
	},
};