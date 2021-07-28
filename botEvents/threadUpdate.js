const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadUpdate',
	async execute(channel, threadmember, client) {

        console.log('A thread was updated.')

        parentChannel = client.channels.cache.get(channel.parent_id)

        // LOG ENTRY
        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Thread Created`)
            .addField(`Creator:`, `${threadmember}`, true)
            .addField(`User ID:`, `${threadmember.id}`, true)
            .addField(`Parent Channel:`, `${parentChannel}`, true)
            .addField(`Thread:`, `${channel}`, true)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        client.channels.cache.get(config.logActionsChannelId).send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};