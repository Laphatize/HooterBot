const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'guildEmojisUpdate',
	async execute(oldEmoji, newEmoji, client) {

        // LOG CHANNEL
        const modLogChannel = member.guild.channels.cache.find(ch => ch.name === `mod-log`)

        if(oldEmoji.name !== newEmoji.name) {       
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Emoji Updated`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }
	},
};