const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'warn',
	async execute(info, client) {

        // LOG CHANNEL
        const modLogChannel = info.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedOrange)
            .setTitle(`Warning`)
            .addField(`Info:`, `${info}`, true)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};