const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'emojiCreate',
	async execute(emoji, client) {

        // LOG CHANNEL
        const modLogChannel = emoji.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`Emoji Created: ${emoji}`)
            .setDescription(`**File name:** ${emoji.name}\nEmoji ID: ${emoji.id}\n**Animated?** ${emoji.animated}\nOriginal File:`)
            .setImage(emoji.url)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};