const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel, client) {

        // IGNORE VERIFICATION CHANNELS
        if(oldChannel.name.startsWith('verify-') || oldChannel.name.startsWith('closed-') || oldChannel.name.startsWith('archived-'))   return;



        // LOG CHANNEL
        const modLogChannel = newChannel.guild.channels.cache.find(ch => ch.name === `mod-log`)

        
        // CHANNEL NAME CHANGE CHECK
        if(oldChannel.name !== newChannel.name) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Channel Name Update`)
                .setDescription(`**Old:** ${oldChannel.name}\n**New:** ${newChannel.name}`)
                .setTimestamp()
                .setFooter(`Channel ID: ${newChannel.id}`)

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }


        // CHANNEL DESCRIPTION/TOPIC CHANGE CHECK
        if(oldChannel.topic !== newChannel.topic) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Channel Topic Update`)
                .setDescription(`**Channel** ${newChannel}\n**Old:** \`\`${oldChannel.topic}\`\`\n**New:** \`\`${newChannel.topic}\`\``)
                .setTimestamp()
                .setFooter(`Channel ID: ${newChannel.id}`)

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }


        // // CHANNEL POSITION CHANGE CHECK
        // if(oldChannel.position !== newChannel.position) {
        //     // LOG EMBED
        //     let logEmbed = new discord.MessageEmbed()
        //         .setColor(config.embedGrey)
        //         .setTitle(`Channel Topic Update`)
        //         .setDescription(`**Old:** \`\`${oldChannel.topic}\`\`\n**New:** \`\`${newChannel.topic}\`\``)
        //         .setTimestamp()

        //     // LOG ENTRY
        //     modLogChannel.send({embeds: [logEmbed]})
        // }



        // CHANNEL PERMISSIONS CHANGE CHECK

	},
};