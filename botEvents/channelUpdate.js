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
        if(oldChannel.name !== newChannel.name && newChannel.type == 'GUILD_TEXT') {
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

        // CATEGORY NAME CHANGE CHECK
        if(oldChannel.name !== newChannel.name && newChannel.type == 'GUILD_CATEGORY') {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Category Name Update`)
                .setDescription(`**Old:** ${oldChannel.name}\n**New:** ${newChannel.name}`)
                .setTimestamp()
                .setFooter(`Category ID: ${newChannel.id}`)

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }


        // CHANNEL DESCRIPTION/TOPIC CHANGE CHECK
        if(oldChannel.topic !== newChannel.topic && newChannel.type == 'GUILD_TEXT') {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Channel Topic Update`)
                .setDescription(`**Channel:** ${newChannel}\n**Old:** \`\`${oldChannel.topic}\`\`\n**New:** \`\`${newChannel.topic}\`\``)
                .setTimestamp()
                .setFooter(`Channel ID: ${newChannel.id}`)

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }


        // CHANNEL POSITION CHANGE CHECK
        if(oldChannel.position !== newChannel.position) {

            // MOVED WITHIN SAME CATEGORY
            if(oldChannel.parent.name == newChannel.parent.name) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`Channel Moved`)
                    .setDescription(`**Channel:** ${newChannel}\n**Catgory:** ${newChannel.parent.name}`)
                    .setTimestamp()
                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
            // MOVED TO DIFFERENT CATEGORY
            if(oldChannel.parent.name !== newChannel.parent.name) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`Channel Moved`)
                    .setDescription(`**Channel:** ${newChannel}\n**Old Catgory:** \`\` ${oldChannel.parent.name.toUpperCase()} \`\`\n**Old Catgory:** \`\` ${newChannel.parent.name.toUpperCase()} \`\``)
                    .setTimestamp()

                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
        }

        // CHANNEL PERMISSIONS CHANGE CHECK

	},
};