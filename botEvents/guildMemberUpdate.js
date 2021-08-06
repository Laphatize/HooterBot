const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember, client) {

        // LOG CHANNEL
        const modLogChannel = oldMember
        // LOG EMBED
        let logLeaveGuild = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Server Member Update`)

            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logLeaveGuild]})
	},
};