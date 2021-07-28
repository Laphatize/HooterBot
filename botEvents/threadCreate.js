const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadCreate',
	async execute(channel, client) {

        console.log('A thread was created.')

        parentChannel = client.channels.cache.get(channel.parent_id)

        // LOG ENTRY
        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Thread Created`)
            .addField(`Thread:`, `${channel}`, true)
            .addField(`Parent Channel:`, `<#${channel.parent_id}>`, true)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        client.channels.cache.get(config.logActionsChannelId).send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};