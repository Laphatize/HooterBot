const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'inviteDelete',
	async execute(invite, client) {

        // LOG CHANNEL
        const modLogChannel = invite.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`Server Invite Deleted`)
            .setDescription(`**Invite URL:**${invite.url}\n**Creator:** ${invite.inviter}\n**Created At:** ${invite.createdAt}**Uses:** ${invite.uses}\n**Channel:** ${invite.channel}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};