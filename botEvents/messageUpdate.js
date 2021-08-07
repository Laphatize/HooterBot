const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, newMessage, client) {

        // IGNORE BOT
        if(newMessage.author.bot || newMessage.channel.type === 'DM') return;



        // CHECK IF NULL EDIT
        if(oldMessage.content == newMessage.content) return;

        // LOG CHANNEL
        const modLogChannel = oldMessage.guild.channels.cache.find(ch => ch.name === `mod-log`)

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`Message Updated`)
            .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL({ dynamic:true }))
            .setDescription(`**Channel:** ${oldMessage.channel}\n**Old:** ${oldMessage.content}\n**New:** ${newMessage.content}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};