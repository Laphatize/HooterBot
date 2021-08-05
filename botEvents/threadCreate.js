const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'threadCreate',
	async execute(thread, client) {

                let threadDataEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`THREAD CREATED`)
                .addField(`thread:`, `${thread}`)
                .addField(`thread.name:`, `${thread.name}`)
                .addField(`thread.type:`, `${thread.type}`)
                .addField(`thread.ownerId:`, `${thread.ownerId}`)
                .addField(`thread.owner [object]:`, `<@${thread.ownerId}>`)
                .addField(`thread.guild:`, `${thread.guild}`)
                .addField(`thread.guild.id:`, `${thread.guild.id}`)
                .addField(`thread.guild.name:`, `${thread.guild.name}`)
                .addField(`thread.parent.id:`, `${thread.parent.id}`)
                .addField(`thread.parent [object]:`, `<#${thread.parent.id}>`)
                .addField(`thread.autoArchiveDuration:`, `${thread.autoArchiveDuration} minutes`)
                .addField(`thread.sendable:`, `${thread.sendable}`)
                .addField(`thread.archived:`, `${thread.archived}`)
                .addField(`thread.locked:`, `${thread.locked}`)


        // LOCATING MOD-LOG CHANNEL
        const modLogChannel = thread.guild.channels.cache.find(ch => ch.name === `mod-log`)
 

        var threadDurationTimeString

        // CONVERTING THE ARCHIVE DURATION TO MINUTES OR DAYS DEPENDING ON VALUE
        if(thread.autoArchiveDuration <= 60) {
                threadDurationTimeString = `${thread.autoArchiveDuration} minutes`
        }
        if(thread.autoArchiveDuration > 60 && thread.autoArchiveDuration <= 1440 ) {
                threadDurationTimeString = `${thread.autoArchiveDuration / (60)} hours`
        }
        if(thread.autoArchiveDuration > 1440) {
                threadDurationTimeString = `${thread.autoArchiveDuration / (60 * 24)} days`
        }

        var threadArchiveTimeStampNoAdjust = moment(thread.archiveTimestamp).add(thread.autoArchiveDuration, 'minutes').utcOffset(-4).format("LLLL")

        // LOG ENTRY
        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Thread Created`)
            .addField(`Thread:`, `${thread}`, true)
            .addField(`Thread ID:`, `${thread.id}`, true)
            .addField(`Thread Type:`, `${thread.type}`, true)
            .addField(`Parent Channel:`, `<#${thread.parent.id}>`, true)
            .addField(`Creator:`, `<@${thread.ownerId}>`, true)
            .addField(`Creator ID:`, `${thread.ownerId}`, true)
            .addField(`Scheduled Close:`, `${threadDurationTimeString}`, true)
            .addField(`Archive Timestamp:`, `${threadArchiveTimeStampNoAdjust} EST`, true)
            .addField(`\u200b`, `\u200b`, true)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
        modLogChannel.send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};