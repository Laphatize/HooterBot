const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadDelete',
	async execute(thread, client) {

        console.log(`\n THREAD DELETED:`)
        console.log(`thread = ${thread}`)
        console.log(`thread.name = ${thread.name}`) 
        console.log(`thread.type = ${thread.type}`) 
        console.log(`thread.ownerId = ${thread.ownerId}`)
        console.log(`thread.guild = ${thread.guild}`)
        console.log(`thread.guild.id = ${thread.guild.id}`)
        console.log(`thread.guild.name = ${thread.guild.name}`)
        console.log(`thread.parent.id = ${thread.parent.id}`)
        console.log(`thread.metadata = ${thread.metadata}`)


        // const modLogChannel = thread.guild.cache.get(guild.id).channels.cache.find(ch => ch.name === `mod-log`)

        // // LOG ENTRY
        // // GENERATE NOTICE EMBED
        // let threadLogEntry = new discord.MessageEmbed()
        //     .setColor(config.embedGrey)
        //     .setTitle(`Thread Deleted`)
        //     .addField(`Thread Name:`, `${thread.name}`, true)
        //     .addField(`Parent Channel:`, `<#${thread.parent.id}>`, true)
        //     .setTimestamp()

        // // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        // modLogChannel.send({ embeds: [threadLogEntry] })
        //     .catch(err => console.log(err))
	},
};