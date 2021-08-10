const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'stickerUpdate',
	async execute(oldSticker, newSticker, client) {

        // LOG CHANNEL
        const modLogChannel = oldSticker.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // STICKER NAME CHANGED
        if(oldSticker.name !== newSticker.name) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Sticker Renamed`)
                .setDescription(`**Old Name:** ${oldSticker.name}\n**New Name:** ${newSticker.name}\n**Changed by:** ${newSticker.user}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }


        // STICKER DESCRIPTION CHANGED
        if(oldSticker.description !== newSticker.description) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Sticker Description Updated`)
                .setDescription(`**Old Description:** ${oldSticker.description}\n**New Description:** ${newSticker.description}\n**Changed by:** ${newSticker.user}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }


        // STICKER TAGS CHANGED
        if(oldSticker.description !== newSticker.description) {
            let oldTags = oldSticker.tags
            let newTags = newSticker.tags

            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Sticker Tags Updated`)
                .setDescription(`**Old Tags:** ${oldTags.join(`, `)}\n**New Tags:** ${newTags.join(`, `)}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }
	},
};