const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'threadUpdate',
	async execute(thread, client) {

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


        // CALCULATING ARCHIVE TIME
        var threadArchiveTimeStampNoAdjust = moment(thread.archiveTimestamp).add(thread.autoArchiveDuration, 'minutes').utcOffset(-4).format("LLLL")


        // THREAD AUTO-ARCHIVED
        if(!thread.archived && thread.locked && (threadArchiveTimeStampNoAdjust == moment(Date.now()).utcOffset(-4).format("LLLL"))) {
            // GENERATE NOTICE EMBED
            let threadLogEntry = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Thread Auto-Archived`)
                .addField(`Thread:`, `${thread}`, true)
                .addField(`Thread ID:`, `${thread.id}`, true)
                .addField(`Thread Type:`, `${thread.type}`, true)
                .addField(`Parent Channel:`, `<#${thread.parent.id}>`, true)
                .addField(`Creator:`, `<@${thread.ownerId}>`, true)
                .addField(`Creator ID:`, `${thread.ownerId}`, true)
                .addField(`Scheduled Close:`, `After *${threadDurationTimeString}* of inactivity.`)
                .addField(`Archived?`, `${!thread.archived}`, true)
                .addField(`Locked?`, `${!thread.locked}`, true)
                .setTimestamp()

            // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
            modLogChannel.send({ embeds: [threadLogEntry] })
                .catch(err => console.log(err))
        }

        console.log(`moment(Date.now()).utcOffset(-4).format("LLLL") = ${moment(Date.now()).utcOffset(-4).format("LLLL")}`)
        console.log(`threadArchiveTimeStampNoAdjust =                  ${threadArchiveTimeStampNoAdjust}`)

        // THREAD LOCKED BY ADMIN/MOD
        if(!thread.archived && thread.locked && (threadArchiveTimeStampNoAdjust !== moment(Date.now()).utcOffset(-4).format("LLLL"))) {
            // GENERATE NOTICE EMBED
            let threadLogEntry = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Thread Locked by Server Staff`)
                .addField(`Thread:`, `${thread}`, true)
                .addField(`Thread ID:`, `${thread.id}`, true)
                .addField(`Thread Type:`, `${thread.type}`, true)
                .addField(`Parent Channel:`, `<#${thread.parent.id}>`, true)
                .addField(`Creator:`, `<@${thread.ownerId}>`, true)
                .addField(`Creator ID:`, `${thread.ownerId}`, true)
                .addField(`Scheduled Close:`, `After *${threadDurationTimeString}* of inactivity.`)
                .addField(`Archived?`, `${!thread.archived}`, true)
                .addField(`Locked?`, `${!thread.locked}`, true)
                .setTimestamp()

            // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
            modLogChannel.send({ embeds: [threadLogEntry] })
                .catch(err => console.log(err))
        }

        // THREAD UNLOCKED BY ADMIN/MOD
        if(thread.locked) {
            // GENERATE NOTICE EMBED
            let threadLogEntry = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Thread Unlocked by Server Staff`)
                .addField(`Thread:`, `${thread}`, true)
                .addField(`Thread ID:`, `${thread.id}`, true)
                .addField(`Thread Type:`, `${thread.type}`, true)
                .addField(`Parent Channel:`, `<#${thread.parent.id}>`, true)
                .addField(`Creator:`, `<@${thread.ownerId}>`, true)
                .addField(`Creator ID:`, `${thread.ownerId}`, true)
                .addField(`Scheduled Close:`, `After *${threadDurationTimeString}* of inactivity.`)
                .addField(`Archived?`, `${!thread.archived}`, true)
                .addField(`Locked?`, `${!thread.locked}`, true)
                .setTimestamp()

            // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
            modLogChannel.send({ embeds: [threadLogEntry] })
                .catch(err => console.log(err))
        }
	},
};