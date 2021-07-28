const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadDelete',
	async execute(channel, threadmember, client) {

        console.log('A thread was deleted.')

        // // LOG ENTRY
        // // GENERATE NOTICE EMBED
        // let threadLogEntry = new discord.MessageEmbed()
        //     .setColor(config.embedGrey)
        //     .setTitle(`Thread Created`)
        //     .addField(`Creator:`, `${threadmember}`)
        //     .addField(`User ID:`, `${threadmember.id}`, true)
        //     .addField(`Thread:`, `${channel}`)
        //     .setTimestamp()

        // // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        // client.channels.cache.get(config.logActionsChannelId).send({ embeds: [threadLogEntry] })
        //     .catch(err => console.log(err))
	},
};