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
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic:true }))
            .addField(`Channel:`, `${message.channel}`)
            .addField(`Old Message`, `${oldMessage.content}`)
            .addField(`New Message`, `${newMessage.content}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};