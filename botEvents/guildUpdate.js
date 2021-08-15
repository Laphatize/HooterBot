const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'guildUpdate',
	async execute(oldGuild, newGuild, client) {

        if(oldGuild.available == true && newGuild.available == false) {
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`SERVER IS UNAVAILABLE - LIKELY SERVER OUTAGE`)
                .setDescription(`**NAME:** ${oldGuild.name}\n**OUTAGE START: ${moment(new Date(member.premiumSince)).format('LL')}`)
                .setTimestamp()

            // LOG ENTRY
            client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logEmbed], content: `@everyone` })
        }

        if(oldGuild.available == false && newGuild.available == true) {
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`SERVER SHOULD BE BACK ONLINE`)
                .setDescription(`**NAME:** ${oldGuild.name}`)
                .setTimestamp()

            // LOG ENTRY
            client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logEmbed] })
        }
	},
};