const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'threadCreate',
	async execute(thread, client) {

        // LOCATING MOD-LOG CHANNEL
        const modLogChannel = thread.guild.channels.cache.find(ch => ch.name === `mod-log`)
 

        let threadDurationTimeString

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

        // // CALCULATING ARCHIVE TIME
        // let threadArchiveTimeStampNoAdjust = moment(thread.archiveTimestamp).add(thread.autoArchiveDuration, 'minutes').utcOffset(-4).format("LLLL")

        // LOG ENTRY
        // GENERATE NOTICE EMBED
        let threadLogEntry = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjThreadChannel} Thread Created`)
            .addField(`Thread:`, `${thread}`, true)
            .addField(`Thread ID:`, `${thread.id}`, true)
            .addField(`Thread Type:`, `${thread.type}`, true)
            .addField(`Parent Channel:`, `${thread.parent}`, true)
            .addField(`Creator:`, `<@${thread.ownerId}>`, true)
            .addField(`Creator ID:`, `${thread.ownerId}`, true)
            .addField(`Archive:`, `After *${threadDurationTimeString}* of inactivity.`)
            .setTimestamp()

        // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
        modLogChannel.send({ embeds: [threadLogEntry] })
            .catch(err => console.log(err))
	},
};