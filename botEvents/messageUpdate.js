const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, newMessage, client) {

        // IGNORE DMS
        if(newMessage.channel.type === 'DM') return;

        // FETCH IF PARTIAL
        if(oldMessage.partial){
            try {
                await oldMessage.fetch()
            } catch (err) {
                return console.log(err);
            }
        }

        // IF OLD MESSAGE CONTENT CANNOT BE OBTAINED
        if (oldMessage.content == 'null' || oldMessage.content == null)   return;


        // CHECK IF NULL EDIT
        if(oldMessage.content == newMessage.content) return;


        // LOG CHANNEL
        const modLogChannel = oldMessage.guild.channels.cache.find(ch => ch.name === `mod-log`)


        let embedDescription = `**Channel:** ${oldMessage.channel}\n**Old:** ${oldMessage.content}\n**New:** ${newMessage.content}`

        if(embedDescription.length >= 4096) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Message Updated`)
                .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL({ dynamic:true }))
                .setDescription(`**Channel:** ${oldMessage.channel}\n*The content of the combined original and edited message exceeds 4096 characters and cannot be displayed.*`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }
        else {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Message Updated`)
                .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL({ dynamic:true }))
                .setDescription(`**Channel:** ${oldMessage.channel}\n**Old:** ${oldMessage.content}\n— — — — — — — — — — — — — — — —\n**New:** ${newMessage.content}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }
	},
};