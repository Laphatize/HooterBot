const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'roleDelete',
	async execute(role, client) {

        // LOG CHANNEL
        const modLogChannel = role.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedOrange)
            .setTitle(`Role Deleted`)
            .addField(`Role Name:`, `${role.name}`, true)
            .addField(`ID:`, `${role.id}`, true)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};