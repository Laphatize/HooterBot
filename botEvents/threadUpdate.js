const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'threadUpdate',
	async execute(oldThread, newThread, client) {

        // LOCATING MOD-LOG CHANNEL
        const modLogChannel = newThread.guild.channels.cache.find(ch => ch.name === `mod-log`)
 

        var threadDurationTimeString



        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Thread Updated`)
            .addField(`Thread:`, `${newThread}`, true)
            .addField(`Thread ID:`, `${newThread.id}`, true)
            .addField(`Thread Type:`, `${newThread.type}`, true)
            .addField(`Parent Channel:`, `<#${newThread.parent.id}>`, true)
            .addField(`Creator:`, `<@${newThread.ownerId}>`, true)
            .addField(`Creator ID:`, `${newThread.ownerId}`, true)
            .addField(`Scheduled Close:`, `After *${threadDurationTimeString}* of inactivity.`)
            .addField(`Archived?`, `${!newThread.archived}`, true)
            .addField(`Locked?`, `${!newThread.locked}`, true)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
        modLogChannel.send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};