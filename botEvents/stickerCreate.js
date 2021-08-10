const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'stickerCreate',
	async execute(sticker, client) {

        // LOG CHANNEL
        const modLogChannel = sticker.guild.channels.cache.find(ch => ch.name === `mod-log`)

        let stickerTags = sticker.tags

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`Sticker Created:`)
            .setThumbnail(sticker.url)
            .setDescription(`**Name:** ${sticker.name}\n**Sticker ID:** ${sticker.id}\n**Uploaded by:** ${sticker.user}\n**Format** ${sticker.format}\n**Tags** ${stickerTags.join(`, `)}\n**Description: ${sticker.description}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};