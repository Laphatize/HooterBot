const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState, client) {

        // LOG CHANNEL
        const modLogChannel = oldState.guild.channels.cache.find(ch => ch.name === `mod-log`)


        // JOIN VOICE CHANNEL
        if(oldState.channel == null && newState.channel !== null ) {
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`${newState.member.user.username} joined ${config.emjVoiceChannel}${newState.channel.name}`)
                .setDescription(`**Session ID:** ${newState.sessionId}`)
                .setTimestamp()
                .setFooter(`User ID: ${newState.member.user.id}`)

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }

        // LEAVE VOICE CHANNEL
        if(oldState.channel !== null && newState.channel == null ) {
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`${oldState.member.user.username} left ${config.emjVoiceChannel}${oldState.channel.name}`)
                .setDescription(`**Session ID:** ${oldState.sessionId}`)
                .setTimestamp()
                .setFooter(`User ID: ${oldState.member.user.id}`)

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }

        // CHANGE VOICE CHANNEL
        if(oldState.channel !== null && newState.channel !== null ) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`${newState.member.user.username} changed ${config.emjVoiceChannel} voice channels`)
                .addField(`Old Channel:`, `${oldState.channel}\n**Session:** ${oldState.sessionId}`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`New Channel:`, `${newState.channel}\n**Session:** ${newState.sessionId}`, true)
                .setTimestamp()
                .setFooter(`User ID: ${newState.member.user.id}`)

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }
    },
};