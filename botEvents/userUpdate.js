const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'roleDelete',
	async execute(oldUser, newUser, client) {

        // LOG CHANNEL
        const modLogChannel = oldUser.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // // LOG EMBED
        // let logEmbed = new discord.MessageEmbed()
        //     .setColor(config.embedGrey)
        //     .setTitle(`User Updated`)
        // //     .addField(`User:`, `${member}`, true)
        // //     .addField(`Tag:`, `${member.user.tag}`, true)
        // //     .addField(`ID:`, `${member.id}`, true)
        // //     .addField(`Time in server:`, `${memberDuration}`)
        //     .setTimestamp()

        // // LOG ENTRY
        // modLogChannel.send({embeds: [logEmbed]})
	},
};