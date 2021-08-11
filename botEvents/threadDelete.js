const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'threadDelete',
	async execute(thread, client) {

        // LOCATING MOD-LOG CHANNEL
        const modLogChannel = thread.guild.channels.cache.find(ch => ch.name === `mod-log`)


        // LOG ENTRY
        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedOrange)
            .setTitle(`${config.emjThreadChannel} Thread Deleted`)
            .addField(`Thread Name:`, `${thread.name}`, true)
            .addField(`Thread ID:`, `${thread.id}`, true)
            .addField(`Thread Type:`, `${thread.type}`, true)
            .addField(`Parent Channel:`, `${thread.parent}`, true)
            .addField(`Creator:`, `<@${thread.ownerId}>`, true)
            .addField(`Creator ID:`, `${thread.ownerId}`, true)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
        modLogChannel.send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};