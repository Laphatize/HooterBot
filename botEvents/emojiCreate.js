const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'emojiCreate',
	async execute(emoji, client) {

        // LOG CHANNEL
        const modLogChannel = emoji.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`Emoji Created`)
            .setDescription(`**Name:** ${emoji.name}\n**Uploader:** ${emoji.author}\n**Uploader:** ${emoji.author}\n**Identifier:** ${emoji.identifier}`)
            .setImage(emoji.url)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};