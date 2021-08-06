const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel, client) {

        // IGNORE VERIFICATION CHANNELS
        if(oldChannel.name.startsWith('verify-'))   return;



        // LOG CHANNEL
        const modLogChannel = oldChannel.guild.channels.cache.find(ch => ch.name === `mod-log`)

        
        // CHANNEL NAME CHANGE CHECK
        if(oldChannel.name !== newChannel.name) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Channel Name Update`)
                .setDescription(`**Old:** \`\`${oldChannel.name}\`\`\n**New:** \`\`${newChannel.name}\`\``)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }

        // CHANNEL DESCRIPTION CHANGE CHECK




        // CHANNEL POSITION CHANGE CHECK




        // CHANNEL TOPIC CHANGE CHECK




        // CHANNEL PERMISSIONS CHANGE CHECK

	},
};