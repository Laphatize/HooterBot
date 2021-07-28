const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadUpdate',
	async execute(channel, threadmember, client) {

        console.log('A thread was updated.')

        // LOG ENTRY
        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Thread Updated`)
            .addField(`Thread:`, `${channel}`, true)
            .addField(`Parent Channel:`, `<#${channel.parent.id}>`, true)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        client.channels.cache.get(config.logActionsChannelId).send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};