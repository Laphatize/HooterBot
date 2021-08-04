const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadCreate',
	async execute(thread, client) {

        console.log(`\n THREAD CREATED:`)
        console.log(`thread = ${thread}`)
        console.log(`thread.name = ${thread.name}`) 
        console.log(`thread.type = ${thread.type}`) 
        console.log(`thread.owner.id = ${thread.owner.id}`)
        console.log(`thread.guild = ${thread.guild}`)
        console.log(`thread.guild.id = ${thread.guild.id}`)
        console.log(`thread.guild.name = ${thread.guild.name}`)
        console.log(`thread.parent.id = ${thread.parent.id}`)
        console.log(`thread.metadata = ${thread.metadata}`)


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
	},
};