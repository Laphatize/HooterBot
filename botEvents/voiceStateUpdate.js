const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState, client) {

        // LOG CHANNEL
        const modLogChannel = oldState.guild.channels.cache.find(ch => ch.name === `mod-log`)


        // JOIN VOICE CHANNEL




        // LEAVE VOICE CHANNEL



        // CHANGE VOICE CHANNEL

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedOrange)
            .setTitle(`Logging \`\`voiceStateUpdate\`\` info`)
            .addField(`Channel:`, `oldState.channel: ${oldState.channel}\nnewState.channel${newState.channel}`)
            .addField(`Member:`, `oldState.member: ${oldState.member}\nnewState.member${newState.member}`)
            .addField(`Server Mute:`, `oldState.serverMute: ${oldState.serverMute}\nnewState.serverMute${newState.serverMute}`)
            .addField(`Session ID:`, `oldState.sessionId: ${oldState.sessionId}\nnewState.sessionId${newState.sessionId}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};