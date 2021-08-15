const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'inviteCreate',
	async execute(invite, client) {

        // LOG CHANNEL
        const modLogChannel = invite.guild.channels.cache.find(ch => ch.name === `mod-log`)

        let expirationDate = invite.expiresAt
        if(invite.expiresAt == null) expirationDate == `*(infinite)*`


        let maxUse = invite.maxUses;
        if(invite.maxUses == 0) maxUse = `*(infinite)*`

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`Server Invite Created`)
            .setDescription(`**Invite URL:** ${invite.url}\n**Creator:** ${invite.inviter}\n**Expiration:** ${expirationDate}\n**Max Uses:** ${maxUse}\n**Temporary Membership?** ${invite.temporary}\n**Channel:** ${invite.channel}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
    },
};