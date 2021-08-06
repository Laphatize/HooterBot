const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'guildUpdate',
	async execute(oldGuild, newGuild, client) {

        // LOG CHANNEL
        const modLogChannel = member.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logLeaveGuild = new discord.MessageEmbed()
            .setColor(config.embedOrange)
            .setTitle(`Server Updated`)
            .addField(`User:`, `${member}`, true)
            .addField(`Tag:`, `${member.user.tag}`, true)
            .addField(`ID:`, `${member.id}`, true)
            .addField(`Time in server:`, `${memberDuration}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logLeaveGuild]})
	},
};