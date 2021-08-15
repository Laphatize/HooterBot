const discord = require('discord.js');
const config = require('../config.json');
const wait = require('util').promisify(setTimeout);

module.exports = {
	name: 'messageDeleteBulk',
	async execute(messages, client) {

        // LOG CHANNEL
        const modLogChannel = messages.first().guild.channels.cache.find(ch => ch.name === `mod-log`)

        // WAIT 5 SECONDS (PLENTY OF TIME, NO?)
        await wait(5000)

        const fetchedLogs = await messages.first().guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_BULK_DELETE',
        });
        const deletionLog = fetchedLogs.entries.first();

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedOrange)
            .setTitle(`Messages Deleted in Bulk`)
            .setDescription(`**Performed by:** <@${config.botId}>\n**Message Count:** ${messages.size}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};