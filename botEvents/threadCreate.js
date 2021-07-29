const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadCreate',
	async execute(channel, client) {

        // FETCH GUILD USING RETURNED "guild.id"
        guild = client.guilds.cache.get(guild.id)

        const modLogChannel = guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG ENTRY
        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Thread Created`)
            .addField(`Thread:`, `${channel}`, true)
            .addField(`Parent Channel:`, `<#${channel.parent.id}>`, true)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        modLogChannel.send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};