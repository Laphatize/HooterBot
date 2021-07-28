const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadCreate',
	async execute(channel, threadmember, client) {

        console.log('A thread was created.')

        // LOG ENTRY
        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Thread Created`)
            .addField(`threadmember:`, `${threadmember}`, true)
            .addField(`threadmember.id:`, `${threadmember.id}`, true)
            .addField(`channel`, `${channel}`, true)
            .addField(`parent_id`, `${parent_id}`, true)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        client.channels.cache.get(config.logActionsChannelId).send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};