const discord = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'guildBanAdd',
	async execute(ban, client) {

        // LOG CHANNEL
        const modLogChannel = ban.guild.channels.cache.find(ch => ch.name === `mod-log`)


        // FETCH AUDIT LOGS FOR BAN
        console.log(`User banned, fetching audit logs`)

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        })
        const banLog = fetchedLogs.entries.first();

        
        const { executor, target, reason } = banLog

        if (!banLog) {
            // MOD LOG CHANNEL
            let modLogEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} USER BANNED ${config.emjREDTICK}`)
                .setDescription(`**User:** ${ban.user}\n**User ID:** ${ban.user.id}\n**Issued by:** *(Could not be fetched from audit logs)*\n**Reason:** ${reason}`)
                .setTimestamp()

            // SENDING MESSAGE IN MOD LOG
            modLogChannel.send({ embeds: [modLogEmbed] })
        }


        if (target.id === ban.user.id) {
            // MOD LOG CHANNEL
            let modLogEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} USER BANNED ${config.emjREDTICK}`)
                .setDescription(`**User:** ${ban.user}\n**User ID:** ${ban.user.id}\n**Issued by:** ${executor}\n**Reason:** ${reason}`)
                .setTimestamp()

            // SENDING MESSAGE IN MOD LOG
            modLogChannel.send({ embeds: [modLogEmbed] })
        } else {
            // MOD LOG CHANNEL
            let modLogEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} USER BANNED ${config.emjREDTICK}`)
                .setDescription(`**User:** ${ban.user}\n**User ID:** ${ban.user.id}\n**Issued by:** *(Could not be fetched from audit logs)*\n**Reason:** ${reason}`)
                .setTimestamp(``)

            // SENDING MESSAGE IN MOD LOG
            modLogChannel.send({ embeds: [modLogEmbed] })
        }
	},
};