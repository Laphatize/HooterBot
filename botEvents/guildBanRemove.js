const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'guildBanRemove',
	async execute(unban, client) {

        // LOG CHANNEL
        const modLogChannel = unban.guild.channels.cache.find(ch => ch.name === `mod-log`)


        // FETCH AUDIT LOGS FOR BAN
        const fetchedLogs = await unban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_REMOVE',
        })
        const unbanLog = fetchedLogs.entries.first();

        
        const { executor, target, reason } = unbanLog

        if (!unbanLog) {
            // MOD LOG CHANNEL
            let modLogEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} USER BAN REMOVED ${config.emjREDTICK}`)
                .setDescription(`**User:** ${unban.user}\n**User ID:** ${unban.user.id}\n**Issued by:** *(Could not be fetched from audit logs)*`)
                .setTimestamp()

            // SENDING MESSAGE IN MOD LOG
            modLogChannel.send({ embeds: [modLogEmbed] })
        }


        if (target.id === unban.user.id) {
            // MOD LOG CHANNEL
            let modLogEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} USER BAN REMOVED${config.emjREDTICK}`)
                .setDescription(`**User:** ${unban.user}\n**User ID:** ${unban.user.id}\n**Issued by:** ${executor}`)
                .setTimestamp()

            // SENDING MESSAGE IN MOD LOG
            modLogChannel.send({ embeds: [modLogEmbed] })
        } else {
            // MOD LOG CHANNEL
            let modLogEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} USER BAN REMOVED ${config.emjREDTICK}`)
                .setDescription(`**User:** ${unban.user}\n**User ID:** ${unban.user.id}\n**Issued by:** *(Could not be fetched from audit logs)*`)
                .setTimestamp()

            // SENDING MESSAGE IN MOD LOG
            modLogChannel.send({ embeds: [modLogEmbed] })
        }
	},
};