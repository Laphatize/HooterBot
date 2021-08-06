const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, newMessage, client) {

        // LOG CHANNEL
        const modLogChannel = oldMessage.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Message Updated`)
            .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL({ dynamic:true }))
            .addField(`Channel:`, `${oldMessage.channel}`)
            .addField(`Old Message`, `${oldMessage.content}`)
            .addField(`New Message`, `${newMessage.content}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};