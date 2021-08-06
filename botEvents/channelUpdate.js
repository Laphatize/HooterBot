const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel, client) {

        // IGNORE VERIFICATION CHANNELS
        if(oldChannel.name.startsWith('verify-'))   return;


        
        // CHANNEL NAME CHANGE CHECK




        // CHANNEL DESCRIPTION CHANGE CHECK




        // CHANNEL POSITION CHANGE CHECK




        // CHANNEL TOPIC CHANGE CHECK




        // CHANNEL PERMISSIONS CHANGE CHECK







        // LOG CHANNEL
        const modLogChannel = oldChannel.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Channel Update`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};