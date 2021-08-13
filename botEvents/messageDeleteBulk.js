const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'messageDeleteBulk',
	async execute(messages, client) {

        // LOG CHANNEL
        const modLogChannel = messages.first().guild.channels.cache.find(ch => ch.name === `mod-log`)

        const fetchedLogs = await messages.first().guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_BULK_DELETE',
        });
        const deletionLog = fetchedLogs.entries.first();
    

        const { executor } = deletionLog;

        if(!deletionLog) {
            // MOD LOG CHANNEL
            let modLogEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Messages Deleted in Bulk`)
                .setDescription(`**Performed By:** ${executor}\n**Message Count:** *(Could not be fetched from audit logs)*`)
                .setTimestamp()

            // SENDING MESSAGE IN MOD LOG
            modLogChannel.send({ embeds: [modLogEmbed] })
        }


        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedOrange)
            .setTitle(`Messages Deleted in Bulk`)
            .setDescription(`**Performed by:** ${executor}\n**Message Count:** ${messages.size}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};