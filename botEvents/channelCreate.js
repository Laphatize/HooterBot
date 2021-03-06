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

            let chVar;
            if(channel.type === 'GUILD_TEXT') chVar = `${config.emjTextChannel}`
            if(channel.type === 'GUILD_VOICE') chVar = `${config.emjVoiceChannel}`
            if(channel.type === 'GUILD_STAGE_VOICE') chVar = `${config.emjStageChannel}`


            let catName;
            if(!channel.parent) catName = `*(None)*`
            else catName = channel.parent.name.toUpperCase()


            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${chVar} Channel Created`)
                .addField(`Channel:`, `${channel}`, true)
                .addField(`Name:`, `${channel.name}`, true)
                .addField(`ID:`, `${channel.id}`, true)
                .addField(`Type:`, `${channel.type}`, true)
                .addField(`Category:`, `${catName}`, true)
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