const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember, client) {

        // LOG CHANNEL
        const modLogChannel = oldMember.guild.channels.cache.find(ch => ch.name === `mod-log`)



        if(oldMember.roles.cache.size < newMember.roles.cache.size) {
  
            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_ROLE_UPDATE'
            })
          
            const roleAddLog = fetchedLogs.entries.first(); 
             if (!roleAddLog) return;
            
            const { executor, target, extra } = roleAddLog;
            
            console.log(`Role ${extra} added to ${target.id} by ${executor.id}`)
        }


        console.log(`oldMember.roles.cache.difference(newMember.roles.cache).map(role => role.name).toString() = \n ${oldMember.roles.cache.difference(newMember.roles.cache).map(role => role.name).toString()}`)



        if(oldMember.roles.cache.size > newMember.roles.cache.size) {
  
            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_ROLE_UPDATE'
            })
          
            const roleAddLog = fetchedLogs.entries.first(); 
             if (!roleAddLog) return;
            
            const { executor, target, extra } = roleAddLog;
            
            console.log(`Role ${extra} removed from ${target.id} by ${executor.id}`)
        }








        // LOG EMBED
        let logLeaveGuild = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Server Member Update`)

            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logLeaveGuild]})
	},
};