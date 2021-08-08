const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, newMessage, client) {

        console.log(`oldMessage = ${oldMessage}`)


        // FETCH IF PARTIAL
        if(oldMessage.partial){
            try {
                await oldMessage.fetch()
            } catch (err) {
                return console.log(err);
            }
        }

        console.log(`oldMessage = ${oldMessage}`)

        
        // IGNORE BOT
        if(newMessage.channel.type === 'DM' || oldMessage.channel.type === 'DM') return;

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