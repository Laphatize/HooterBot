const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member, client) {

        // LOGGING NEW USER JOINING GUILD
        const modLogChannel = member.guild.channels.cache.find(ch => ch.name === `mod-log`)
            
        let memberDuration = Date.now() - Date.parse(member.user.joinedAt)

        console.log(`memberDuration = ${memberDuration}`)


        // JOIN EMBED
        let logJoinGuild = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`Server Member Left`)
                .addField(`User:`, `${member}`, true)
                .addField(`Tag:`, `${member.user.tag}`, true)
                .addField(`ID:`, `${member.id}`, true)
                .addField(`Time in server:`, `(text here soon)`)
                .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logJoinGuild]})
	},
};