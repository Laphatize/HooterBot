const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember, client) {

        // LOG CHANNEL
        const modLogChannel = oldMember.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // FINDING THE ROLE ADDED/REMOVED
        let roleChangeId = oldMember.roles.cache.difference(newMember.roles.cache).map(role => role.id).toString()


        // ROLE ADDED TO USER
        if(oldMember.roles.cache.size < newMember.roles.cache.size) {
  
            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_ROLE_UPDATE'
            })
          
            // FETCH AUDIT LOG INFO FOR MAIN LOG
            const roleAddLog = fetchedLogs.entries.first()
            if (!roleAddLog) return
            const { executor, target } = roleAddLog

            
            // FETCH ROLE IN GUILD TO GET ROLE OBJECT
            let newRole = newMember.roles.cache.get(roleChangeId)


            // USER GIVEN ROLE BY SOMEONE ELSE
            if(executor.id !== target.id) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedBlurple)
                    .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL({ dynamic:true }))
                    .setTitle(`Role Added`)
                    .setDescription(`**Role:** ${newRole}\n**Added by:** <@${executor.id}>`)
                    .setTimestamp()

                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
            // USER GIVES THEMSELVES THE ROLE
            else {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedBlurple)
                    .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL({ dynamic:true }))
                    .setTitle(`Role Added`)
                    .setDescription(`**Role:** ${newRole}`)
                    .setTimestamp()

                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
        }

        // ROLE REMOVED FROM USER
        if(oldMember.roles.cache.size > newMember.roles.cache.size) {

            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_ROLE_UPDATE'
            })
            
            // FETCH AUDIT LOG INFO FOR MAIN LOG
            const roleAddLog = fetchedLogs.entries.first()
            if (!roleAddLog) return
            const { executor, target } = roleAddLog


            // FETCH ROLE IN GUILD TO GET ROLE OBJECT
            let oldRole = newMember.roles.cache.get(roleChangeId)
                        
            
            // ROLE REMOVED FROM USER BY SOMEONE ELSE
            if(executor.id !== target.id) {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL({ dynamic:true }))
                    .setTitle(`Role Removed`)
                    .setDescription(`**Role:** ${oldRole}\n**Added by:** <@${executor.id}>`)
                    .setTimestamp()

                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
            // USER REMOVED ROLE THEMSELVES
            else {
                // LOG EMBED
                let logEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL({ dynamic:true }))
                    .setTitle(`Role Removed`)
                    .setDescription(`**Role:** ${oldRole}`)
                    .setTimestamp()

                // LOG ENTRY
                modLogChannel.send({embeds: [logEmbed]})
            }
        }
	},
};