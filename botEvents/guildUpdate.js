const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'guildUpdate',
	async execute(oldGuild, newGuild, client) {

        // LOG CHANNEL
        const modLogChannel = oldGuild.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logLeaveGuild = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Server Updated`)
            .addField(`Before:`, `something`, true)
            .addField(`After:`, `else`, true)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logLeaveGuild]})
	},
};