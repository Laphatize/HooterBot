const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'roleCreate',
	async execute(role, client) {

        // LOG CHANNEL
        const modLogChannel = role.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`Role Created`)
            .addField(`Role:`, `${role}`, true)
            .addField(`ID:`, `${role.id}`, true)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};