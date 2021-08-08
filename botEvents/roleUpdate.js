const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'roleUpdate',
	async execute(oldRole, newRole, client) {

        // LOG CHANNEL
        const modLogChannel = oldRole.guild.channels.cache.find(ch => ch.name === `mod-log`)

        
        // ROLE RENAME
        if(oldRole.name !== newRole.name) {
                
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Role Renamed`)
                .setDescription(`**Role:** ${newRole}`)
                .addField(`Before:`, `${oldRole.name}`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`After:`, `${newRole.name}`, true)
                .setFooter(`Role ID: ${newRole.id}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }

        // ROLE RECOLOR
        if(oldRole.color !== newRole.color) {
                
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Role Recolored`)
                .setDescription(`**Role:** ${newRole}`)
                .addField(`Before:`, `[${oldRole.hexColor}](https://www.google.com/search?q=color+picker+%23${oldRole.hexColor.split('#').pop()})`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`After:`, `[${newRole.hexColor}](https://www.google.com/search?q=color+picker+%23${newRole.hexColor.split(`#`).pop()})`, true)
                .setFooter(`Role ID: ${newRole.id}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }

        // ROLE POSITION MOVE
        if(oldRole.position !== newRole.position) {
                
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Role Position Changed`)
                .setDescription(`**Role:** ${newRole}`)
                .setFooter(`Role ID: ${newRole.id}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }

        // HOIST CHANGE
        if(oldRole.hoist !== newRole.hoist) {
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Role Hoist Change`)
                .setDescription(`**Role:** ${newRole}\n**Display Separately?** ${newRole.hoist}`)
                .setFooter(`Role ID: ${newRole.id}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }

        // ROLE PERMISSION CHANGE
        if(oldRole.permissions !== newRole.permissions) {

            const oldPerms = oldRole.permissions.serialize()
            const newPerms = newRole.permissions.serialize()

            const permsUpdated = []

            // CHECKING ROLE'S PERMISSIONS
            for (const [key, element] of Object.entries(oldPerms)) {
                if(newPerms[key] !== element) {
                    permsUpdated.push(key);
                }
            }

            // CREATING MARKERS FOR NOTING UPDATES
            // PERMISSION DECREASE
            if(oldRole.permissions > newRole.permissions) {
                permsUpdated.join(`\n ${config.emjGREYTICK}🡲${config.emjREDTICK}`)

                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`Role Permissions Changed`)
                    .setDescription(`**Role:** ${newRole}\n${permUpdated}`)
                    .setFooter(`Role ID: ${newRole.id}`)
                    .setTimestamp()

                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
            // PERMISSION INCREASE
            else if(oldRole.permissions < newRole.permissions) {
                permsUpdated.join(`\n ${config.emjGREYTICK}🡲${config.emjGREENTICK}`)

                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`Role Permissions Changed`)
                    .setDescription(`**Role:** ${newRole}\n${permUpdated}`)
                    .setFooter(`Role ID: ${newRole.id}`)
                    .setTimestamp()

                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
        }
	},
};