const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
    name: 'channelDelete',
    async execute(channel, client) {
        
        // LOG CHANNEL
        const modLogChannel = channel.guild.channels.cache.find(ch => ch.name === `mod-log`)


        // CHANNEL DELETED
        if(channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_VOICE' || channel.type === 'GUILD_STAGE_VOICE') {
                        
            let chVar;
            if(channel.type === 'GUILD_TEXT') chVar = `${config.emjTextChannel}`
            if(channel.type === 'GUILD_VOICE') chVar = `${config.emjVoiceChannel}`
            if(channel.type === 'GUILD_STAGE_VOICE') chVar = `${config.emjStageChannel}`


            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedOrange)
                .setTitle(`${chVar} Channel Deleted`)
                .addField(`Name:`, `${channel.name}`, true)
                .addField(`ID:`, `${channel.id}`, true)
                .addField(`Type:`, `${channel.type}`, true)
                .addField(`Category:`, `${channel.parent.name}`, true)
                .setTimestamp()

            // LOG ENTRY
            return modLogChannel.send({embeds: [logEmbed]})
        }

        // CATEGORY DELETED
        if(channel.type === 'GUILD_CATEGORY') {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedOrange)
                .setTitle(`Category Deleted`)
                .addField(`Name:`, `${channel.name}`, true)
                .addField(`ID:`, `${channel.id}`, true)
                .addField(`Type:`, `${channel.type}`, true)
                .setTimestamp()

            // LOG ENTRY
            return modLogChannel.send({embeds: [logEmbed]})
        }
	},
};