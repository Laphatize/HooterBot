const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'stageInstanceCreate',
	async execute(stage, client) {

        // LOG CHANNEL
        const modLogChannel = stage.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`New Stage Instance`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};