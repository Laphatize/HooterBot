const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'inviteCreate',
	async execute(invite, client) {

        // LOG CHANNEL
        const modLogChannel = invite.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`Server Invite Created`)
            .setDescription(`**Invite URL:**${invite.url}\n**Creator:** ${invite.inviter}\n**Expiration:** ${invite.expiresAt}\n**Max Uses:** ${invite.maxUses}\n**Channel:** ${invite.channel}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};