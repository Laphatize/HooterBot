const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadUpdate',
	async execute(channel, client) {

        const modLogChannel = channel.guild.cache.get(guild.id).channels.cache.find(ch => ch.name === `mod-log`)

        // LOG ENTRY
        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Thread Updated`)
            .addField(`Thread:`, `${channel}`, true)
            .addField(`Parent Channel:`, `<#${channel.parent.id}>`, true)
            .setDescription(`This could mean the thread has been renamed or the thread has been archived. The API makes no distinction.`)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        modLogChannel.send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};