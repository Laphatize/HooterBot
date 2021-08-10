const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'threadUpdate',
	async execute(oldThread, newThread, client) {

        // LOCATING MOD-LOG CHANNEL
        const modLogChannel = newThread.guild.channels.cache.find(ch => ch.name === `mod-log`)
 

        // NAME CHANGED
        if(oldThread.name !== newThread.name) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Thread Renamed`)
                .setDescription(`**Thread:** ${newThread}\n**Parent Channel:** ${newThread.parent}`)
                .addField(`**Old Name:**`, `${oldThread.name}`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`**New Name:**`, `${newThread.name}`, true)
                .setFooter(`Thread ID: ${newThread.id}`)
                .setTimestamp()

            // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
            modLogChannel.send({ embeds: [logEmbed] })
        }


        // AUTO-ARCHIVE TIME CHANGED
        if(oldThread.autoArchiveDuration !== newThread.autoArchiveDuration) {
            
            // CONVERTING THE NEW ARCHIVE DURATION TO MINUTES/DAYS
            var oldThreadDurationTimeString
            if(oldThread.autoArchiveDuration <= 60) {
                oldThreadDurationTimeString = `${oldThread.autoArchiveDuration} minutes`
            }
            if(oldThread.autoArchiveDuration > 60 && oldThread.autoArchiveDuration <= 1440 ) {
                oldThreadDurationTimeString = `${oldThread.autoArchiveDuration / (60)} hours`
            }
            if(oldThread.autoArchiveDuration > 1440) {
                oldThreadDurationTimeString = `${oldThread.autoArchiveDuration / (60 * 24)} days`
            }

            // CONVERTING THE NEW ARCHIVE DURATION TO MINUTES/DAYS
            var newThreadDurationTimeString
            if(newThread.autoArchiveDuration <= 60) {
                newThreadDurationTimeString = `${newThread.autoArchiveDuration} minutes`
            }
            if(newThread.autoArchiveDuration > 60 && newThread.autoArchiveDuration <= 1440 ) {
                newThreadDurationTimeString = `${newThread.autoArchiveDuration / (60)} hours`
            }
            if(newThread.autoArchiveDuration > 1440) {
                newThreadDurationTimeString = `${newThread.autoArchiveDuration / (60 * 24)} days`
            }

            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Thread Auto-Archive Time Changed`)
                .setDescription(`**Thread:** ${newThread}\n**Parent Channel:** ${newThread.parent}`)
                .addField(`**Old Time:**`, `${oldThreadDurationTimeString}`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`**New Time:**`, `${newThreadDurationTimeString}`, true)
                .setFooter(`Thread ID: ${newThread.id}`)
                .setTimestamp()

            // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
            modLogChannel.send({ embeds: [logEmbed] })
        }


        // THREAD ARCHIVED CHANGE - NOT MOD-LOCKED
        if(oldThread.archived !== newThread.archived && newThread.locked == false) {
            
            // THREAD NOW ARCHIVED
            if(newThread.archived == true) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`Thread Archived`)
                    .setDescription(`**Thread:** ${newThread}\n**Parent Channel:** ${newThread.parent}`)
                    .setFooter(`Thread ID: ${newThread.id}`)
                    .setTimestamp()

                // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
                modLogChannel.send({ embeds: [logEmbed] })
            }

            // THREAD NOW UNARCHIVED
            if(newThread.archived == false) {

                // CONVERTING THE NEW ARCHIVE DURATION TO MINUTES/DAYS
                var newThreadDurationTimeString
                if(newThread.autoArchiveDuration <= 60) {
                    newThreadDurationTimeString = `${newThread.autoArchiveDuration} minutes`
                }
                if(newThread.autoArchiveDuration > 60 && newThread.autoArchiveDuration <= 1440 ) {
                    newThreadDurationTimeString = `${newThread.autoArchiveDuration / (60)} hours`
                }
                if(newThread.autoArchiveDuration > 1440) {
                    newThreadDurationTimeString = `${newThread.autoArchiveDuration / (60 * 24)} days`
                }


                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`Thread Unarchived`)
                    .setDescription(`**Thread:** ${newThread}\n**Parent Channel:** ${newThread.parent}\n\nThis thread is now active and will archive after ${newThreadDurationTimeString} of inactivity.`)
                    .setFooter(`Thread ID: ${newThread.id}`)
                    .setTimestamp()

                // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
                modLogChannel.send({ embeds: [logEmbed] })
            }
        }


        // THREAD SLOWMODE
        if(oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Thread Slowmode Changed`)
                .setDescription(`**Thread:** ${newThread}\n**Parent Channel:** ${newThread.parent}`)
                .addField(`**Old Time:**`, `${oldThread.rateLimitPerUser}s`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`**New Time:**`, `${newThread.rateLimitPerUser}s`, true)
                .setFooter(`Thread ID: ${newThread.id}`)
                .setTimestamp()

            // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
            modLogChannel.send({ embeds: [logEmbed] })
        }
        

        // THREAD LOCK CHANGE
        if(oldThread.locked !== newThread.locked) {

            // THREAD NOW ARCHIVED
            if(newThread.locked == true) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`Thread Locked`)
                    .setDescription(`**Thread:** ${newThread}\n**Parent Channel:** ${newThread.parent}\n**Locked By:** (admin/mod)`)
                    .setFooter(`Thread ID: ${newThread.id}`)
                    .setTimestamp()

                // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
                modLogChannel.send({ embeds: [logEmbed] })
            }

            // THREAD NOW ARCHIVED
            if(newThread.archived == false) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`Thread Unlocked`)
                    .setDescription(`**Thread:** ${newThread}\n**Parent Channel:** ${newThread.parent}\n**Locked By:** (admin/mod)`)
                    .setFooter(`Thread ID: ${newThread.id}`)
                    .setTimestamp()

                // FETCHING LOG CHANNEL AND SENDING CREATION NOTICE
                modLogChannel.send({ embeds: [logEmbed] })
            }
        }
	},
};