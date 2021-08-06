const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'stageInstanceUpdate',
	async execute(stage, client) {

        // LOG CHANNEL
        const modLogChannel = stage.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Stage Instance Updated`)
            .addField(`Before:`, `something`, true)
            .addField(`After:`, `else`, true)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};