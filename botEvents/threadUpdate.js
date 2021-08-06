const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'threadUpdate',
	async execute(oldThread, newThread, client) {

        // LOCATING MOD-LOG CHANNEL
        const modLogChannel = newThread.guild.channels.cache.find(ch => ch.name === `mod-log`)
 

        var threadDurationTimeString

        // CONVERTING THE ARCHIVE DURATION TO MINUTES OR DAYS DEPENDING ON VALUE
        if(newThread.autoArchiveDuration <= 60) {
            threadDurationTimeString = `${newThread.autoArchiveDuration} minutes`
        }
        if(newThread.autoArchiveDuration > 60 && newThread.autoArchiveDuration <= 1440 ) {
            threadDurationTimeString = `${newThread.autoArchiveDuration / (60)} hours`
        }
        if(newThread.autoArchiveDuration > 1440) {
            threadDurationTimeString = `${newThread.autoArchiveDuration / (60 * 24)} days`
        }


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