const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'emojiUpdate',
	async execute(oldEmoji, newEmoji, client) {

        // LOG CHANNEL
        const modLogChannel = newEmoji.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // EMOJI NAME CHANGE


        // EMOJI NAME CHANGE







        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`Emoji Deleted`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};