const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'guildMemberRemove',
	async execute(member, client) {

        // LOGGING NEW USER JOINING GUILD
        const modLogChannel = member.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // JOIN EMBED
        let logLeaveGuild = new discord.MessageEmbed()
                .setColor(config.embedOrange)
                .setTitle(`Server Member Left`)
                .addField(`User:`, `${member}`, true)
                .addField(`Tag:`, `${member.user.tag}`, true)
                .addField(`ID:`, `${member.id}`, true)
                .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logLeaveGuild]})
	},
};