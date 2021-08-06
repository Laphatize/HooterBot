const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'stageInstanceCreate',
	async execute(stage, client) {

        // LOG CHANNEL
        const modLogChannel = member.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedOrange)
            .setTitle(`New Stage Instance`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};