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
        if(oldChannel.name !== newChannel.name && (newChannel.type === 'GUILD_TEXT' || newChannel.type === 'GUILD_VOICE' || newChannel.type === `GUILD_STAGE_VOICE `)) {
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
            if(oldChannel.parent.id == newChannel.parent.id) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`Channel Moved`)
                    .setDescription(`**Channel:** ${newChannel}\n**Catgory:** ${newChannel.parent.name}`)
                    .setTimestamp()
                    .setFooter(`Channel ID: ${newChannel.id}`)
                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
            // MOVED TO DIFFERENT CATEGORY
            if(oldChannel.parent.id !== newChannel.parent.id) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`Channel Moved`)
                    .setDescription(`**Channel:** ${newChannel}\n**Old Catgory:** \`\` ${oldChannel.parent.name.toUpperCase()} \`\`\n**New Catgory:** \`\` ${newChannel.parent.name.toUpperCase()} \`\``)
                    .setTimestamp()
                    .setFooter(`Channel ID: ${newChannel.id}`)
                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
        }


        // CHANNEL SLOWMODE CHECK
        if(oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {

            // SLOWMODE APPLIED
            if(newChannel.rateLimitPerUser > 0 && oldChannel.rateLimitPerUser == 0) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`Slowmode Enabled`)
                    .setDescription(`**Channel:** ${newChannel}\n**Slowmode:** ${newChannel.rateLimitPerUser}s`)
                    .setTimestamp()
                    .setFooter(`Channel ID: ${newChannel.id}`)
                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
            // SLOWMODE REMOVED
            if(newChannel.rateLimitPerUser == 0 && oldChannel.rateLimitPerUser > 0) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`Slowmode Removed`)
                    .setDescription(`**Channel:** ${newChannel}`)
                    .setTimestamp()
                    .setFooter(`Channel ID: ${newChannel.id}`)
                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
            // SLOWMODE ADJUSTED
            if(newChannel.rateLimitPerUser > 0 && oldChannel.rateLimitPerUser > 0) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`Slowmode Adjusted`)
                    .setDescription(`**Channel:** ${newChannel}`)
                    .addField(`Old Rate:`, `${oldChannel.rateLimitPerUser}s`, true)
                    .addField(`\u200b`, `🡲`, true)
                    .addField(`New Rate:`, `${newChannel.rateLimitPerUser}s`, true)
                    .setTimestamp()
                    .setFooter(`Channel ID: ${newChannel.id}`)
                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
        }


        // // CHANNEL PERMISSIONS CHANGE CHECK
        // if(oldChannel.permissions !== newChannel.permissions) {

        //     console.log(`The permissions of this channel have changed in some way...`)
            


        //     // LOOP THROUGH ALL ROLES ON A CHANNEL
        //     guild.roles.cache.each(role => {
                
        //         const oldPerms = role.permissions.serialize()
        //         const newPerms = role.permissions.serialize()

        //         const permsUpdated = []

        //         // IF THIS ROLE'S PERMISSIONS HAVE BEEN UPDATED
        //         if(oldPerms !== newPerms) {
        //             // CHECKING ROLE'S PERMISSIONS
        //             for (const [key, element] of Object.entries(oldPerms)) {
        //                 if(newPerms[key] !== element) permsUpdated.push(key);
        //             }
        //         }

        //         let permUpdated;

        //         // CREATING MARKERS FOR NOTING UPDATES
        //         if(oldChannel.permissions > newChannel.permissions) {
        //             permUpdated = permsUpdated.join(`\n ${config.emjGREYTICK}🡲${config.emjGREENTICK}`)

        //             // LOG EMBED
        //             let logEmbed = new discord.MessageEmbed()
        //                 .setColor(config.embedGrey)
        //                 .setTitle(`Role Permissions Changed`)
        //                 .setDescription(`**Role:** ${role}\n${permUpdated}`)
        //                 .setTimestamp()

        //             // LOG ENTRY
        //             modLogChannel.send({embeds: [logEmbed]})
        //         }
        //         if(oldChannel.permissions < newChannel.permissions) {
        //             permUpdated = permsUpdated.join(`\n ${config.emjGREYTICK}🡲${config.emjREDTICK}`)

        //             // LOG EMBED
        //             let logEmbed = new discord.MessageEmbed()
        //                 .setColor(config.embedGrey)
        //                 .setTitle(`Role Permissions Changed`)
        //                 .setDescription(`**Role:** ${role}\n${permUpdated}`)
        //                 .setTimestamp()

        //             // LOG ENTRY
        //             modLogChannel.send({embeds: [logEmbed]})
        //         }
        //     })
        // }
	},
};