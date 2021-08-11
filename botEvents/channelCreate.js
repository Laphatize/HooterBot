const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'channelCreate',
	async execute(channel, client) {

        // IGNORE VERIFICATION CHANNELS
        if(channel.name.startsWith('verify-'))   return;


        // LOG CHANNEL
        const modLogChannel = channel.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // CHANNEL CREATION
        if(channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_VOICE' || channel.type === 'GUILD_STAGE_VOICE') {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`Channel Created`)
                .addField(`Channel:`, `${channel}`, true)
                .addField(`Name:`, `${channel.name}`, true)
                .addField(`ID:`, `${channel.id}`, true)
                .addField(`Type:`, `${channel.type}`, true)
                .addField(`Category:`, `${channel.parent.name.toUpperCase()}`, true)
                .addField(`Position in Category:`, `${channel.position + 1} from top`, true)
                .setTimestamp()

            // LOG ENTRY
            return modLogChannel.send({embeds: [logEmbed]})
        }

        // CATEGORY CREATION
        if(channel.type === 'GUILD_CATEGORY') {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`Category Created`)
                .addField(`Name:`, `${channel.name}`, true)
                .addField(`ID:`, `${channel.id}`, true)
                .setTimestamp()

            // LOG ENTRY
            return modLogChannel.send({embeds: [logEmbed]})
        }
	},
};