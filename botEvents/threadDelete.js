const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadDelete',
	async execute(channel, client) {

        console.log('A thread was deleted.')


        parentChannel = client.channels.cache.get(parent_id)

        // LOG ENTRY
        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Thread Deleted`)
            .addField(`Parent Channel:`, `${parentChannel}`, true)
            .addField(`Thread:`, `${channel.name}`)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        client.channels.cache.get(config.logActionsChannelId).send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};