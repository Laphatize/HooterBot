const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'guildStickersUpdate',
	async execute(oldSticker, newSticker, client) {

        // LOG CHANNEL
        const modLogChannel = oldSticker.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Sticker Updated`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};