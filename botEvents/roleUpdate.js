const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'roleUpdate',
	async execute(oldRole, newRole, client) {

        // LOG CHANNEL
        const modLogChannel = oldRole.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Role Updated`)
            .addField(`Before:`, `something`, true)
            .addField(`After:`, `else`, true)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};