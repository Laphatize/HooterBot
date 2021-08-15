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
            .setDescription(`**File name:** ${emoji.name}\n**Emoji ID:** ${emoji.id}\n**Animated?** ${emoji.animated}\n**Original File:**`)
            .setImage(emoji.url)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};