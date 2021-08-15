const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'stageInstanceUpdate',
	async execute(oldStage, newStage, client) {

        // LOG CHANNEL
        const modLogChannel = stage.guild.channels.cache.find(ch => ch.name === `mod-log`)

        .setDescription(`**Parent Channel:** ${stage.channel}\n**Discoverable?** ${stage.discoverableDisabled}\n**Privacy Level:** ${stage.privacyLevel}\n**Topic:** ${stage.topic}`)

        // DISCOVERABILITY CHANGE
        if(oldStage.discoverableDisabled !== newStage.discoverableDisabled) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Stage Discoverability Updated`)
                .addField(`Before:`, `${oldStage.discoverableDisabled}`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`After:`, `${newStage.discoverableDisabled}`, true)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }

        // PRIVACY LEVEL CHANGE
        if(oldStage.privacyLevel !== newStage.privacyLevel) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Stage Privacy Level Updated`)
                .addField(`Before:`, `${oldStage.privacyLevel}`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`After:`, `${newStage.privacyLevel}`, true)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }

        // TOPIC CHANGE
        if(oldStage.topic !== newStage.topic) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Stage Topic Updated`)
                .addField(`Before:`, `${oldStage.topic}`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`After:`, `${newStage.topic}`, true)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }
	},
};