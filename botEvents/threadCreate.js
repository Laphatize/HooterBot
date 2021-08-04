const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadCreate',
	async execute(thread, client) {

                let threadDataEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`THREAD CREATED`)
                .addField(`thread:`, `${thread}`)
                .addField(`thread.name:`, `${thread.name}`)
                .addField(`thread.type:`, `${thread.type}`)
                .addField(`thread.ownerId:`, `${thread.ownerId}`)
                .addField(`thread.owner [object]:`, `<@${thread.ownerId}>`)
                .addField(`thread.guild:`, `${thread.guild}`)
                .addField(`thread.guild.id:`, `${thread.guild.id}`)
                .addField(`thread.guild.name:`, `${thread.guild.name}`)
                .addField(`thread.parent.id:`, `${thread.parent.id}`)
                .addField(`thread.parent [object]:`, `<#${thread.parent.id}>`)
                .addField(`thread.autoArchiveDuration:`, `${thread.autoArchiveDuration} minutes`)
                .addField(`thread.sendable:`, `${thread.sendable}`)
                .addField(`thread.archived:`, `${thread.archived}`)
                .addField(`thread.locked:`, `${thread.locked}`)


        // const modLogChannel = channel.guild.cache.get(guild.id).channels.cache.find(ch => ch.name === `mod-log`)
 
        // // LOG ENTRY
        // // GENERATE NOTICE EMBED
        // let threadLogEntry = new discord.MessageEmbed()
        //     .setColor(config.embedGrey)
        //     .setTitle(`Thread Created`)
        //     .addField(`Thread:`, `${channel}`, true)
        //     .addField(`Parent Channel:`, `<#${channel.parent.id}>`, true)
        //     .setTimestamp()

        // // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        // modLogChannel.send({ embeds: [threadLogEntry] })
        //     .catch(err => console.log(err))
        thread.send({ embeds: [threadDataEmbed] })
	},
};