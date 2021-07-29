const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadDelete',
	async execute(channel, client) {

        // LOG ENTRY
        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Thread Deleted`)
            .addField(`Thread:`, `${channel.name}`, true)
            .addField(`Parent Channel:`, `<#${channel.parent.id}>`, true)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        client.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};