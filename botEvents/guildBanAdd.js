const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'guildBanAdd',
	async execute(ban, client) {

        // LOG CHANNEL
        const modLogChannel = member.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`User Banned`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};