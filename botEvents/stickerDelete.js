const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'stickerDelete',
	async execute(sticker, client) {

        // LOG CHANNEL
        const modLogChannel = sticker.guild.channels.cache.find(ch => ch.name === `mod-log`)

        let stickerTags = sticker.tags

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`Sticker Deleted:`)
            .setDescription(`**Name:** ${sticker.name}\n**Format** ${sticker.format}\n**Tags** ${stickerTags.join(`, `)}\n**Description: ${sticker.description}\n**Original File:**`)
            .setImage(sticker.url)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};