const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
    name: 'channelDelete',
    async execute(channel, client) {

        // IGNORE VERIFICATION CHANNELS
        if(oldChannel.name.startsWith('verify-'))   return;

        
        // LOG CHANNEL
        const modLogChannel = channel.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
			.setColor(config.embedOrange)
			.setTitle(`Channel Deleted`)
            .addField(`Name:`, `${channel.name}`, true)
            .addField(`ID:`, `${channel.id}`, true)
            .addField(`Type:`, `${channel.name}`, true)
            .addField(`Category:`, `${channel.parent.name}`, true)
			.setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};