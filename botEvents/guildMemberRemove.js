const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'guildMemberRemove',
	async execute(member, client) {

        // LOGGING NEW USER JOINING GUILD
        const modLogChannel = member.guild.channels.cache.find(ch => ch.name === `mod-log`)


        // USER TIME IN GUILD CALCULATION
        let totalSeconds = moment(new Date()).diff(member.user.joinedAt, 'seconds')


        console.log(`totalSeconds = ${totalSeconds}`)
        
        // YEARS CALCULATION
        let yearValue = Math.floor(totalSeconds / 31536000 );
            totalSeconds %= 31536000

        // MONTHS CALCULATION
        let monthValue = Math.floor(totalSeconds / 2628288 );
            totalSeconds %= 2628288

        // DAYS CALCULATION
        let dayValue = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;

        // HOURS CALCULATION
        let hourValue = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;

        // MINUTES CALCULATION
        let minuteValue = Math.floor(totalSeconds / 60);

        // SECONDS CALCULATION
        let secondValue = Math.floor(totalSeconds % 60);


        // AGE IN RELATIVE TIME
        let durationArray = [];
            if(yearValue > 1) durationArray.push(`${yearValue} years, `)
            if(yearValue == 1) durationArray.push(`${yearValue} year, `)
            
            if(monthValue > 1) durationArray.push(`${monthValue} months, `)
            if(monthValue == 1) durationArray.push(`${monthValue} month, `)
            if(monthValue == 0 && yearValue > 0) durationArray.push(`${monthValue} months, `)

            if(dayValue > 1 || dayValue == 0) durationArray.push(`${dayValue} days, `)
            if(dayValue == 1) durationArray.push(`${dayValue} day, `)
            if(dayValue == 0 && monthValue > 0) durationArray.push(`${dayValue} days, `)

            if(hourValue > 1 || hourValue == 0) durationArray.push(`${hourValue} hours, `)
            if(hourValue == 1) durationArray.push(`${hourValue} hour, `)
            if(hourValue == 0 && dayValue > 0) durationArray.push(`${hourValue} hours, `)

            if(minuteValue > 1 || minuteValue == 0) durationArray.push(`${minuteValue} minutes, `)
            if(minuteValue == 1) durationArray.push(`${minuteValue} minute, `)
            if(minuteValue == 0 && hourValue > 0) durationArray.push(`${minuteValue} minutes, `)

            if(secondValue > 1 || secondValue == 0) durationArray.push(`and ${secondValue} seconds. `)
            if(secondValue == 1) durationArray.push(`and ${secondValue} second.`)
            if(secondValue == 0 && secondValue > 0) durationArray.push(`and ${secondValue} seconds. `)

        const memberDuration = durationArray.join('')


        // JOIN EMBED
        let logLeaveGuild = new discord.MessageEmbed()
                .setColor(config.embedOrange)
                .setTitle(`Server Member Left`)
                .addField(`User:`, `${member}`, true)
                .addField(`Tag:`, `${member.user.tag}`, true)
                .addField(`ID:`, `${member.id}`, true)
                .addField(`Time in server:`, `${memberDuration}`)
                .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logLeaveGuild]})
	},
};