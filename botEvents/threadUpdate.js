const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadUpdate',
	async execute(thread, client) {

        console.log(`\n THREAD UPDATED:`)
        console.log(`thread = ${thread}`)
        console.log(`thread.name = ${thread.name}`) 
        console.log(`thread.type = ${thread.type}`) 
        console.log(`thread.ownerId = ${thread.ownerId}`)
        console.log(`thread.guild = ${thread.guild}`)
        console.log(`thread.guild.id = ${thread.guild.id}`)
        console.log(`thread.guild.name = ${thread.guild.name}`)
        console.log(`thread.parent.id = ${thread.parent.id}`)
        console.log(`thread.metadata = ${thread.metadata}`)

        
        // // FETCHING GUILD AND THEN ITS MOD-LOG CHANNEL
        // const modLogChannel = client.guilds.cache.get(channel.guild.id)
        
        
        
        // .channels.cache.find(ch => ch.name === `mod-log`)

        
        // // LOG ENTRY
        // // GENERATE NOTICE EMBED
        // let threadLogEntry = new discord.MessageEmbed()
        //     .setColor(config.embedGrey)
        //     .setTitle(`Thread Updated`)
        //     .addField(`Thread:`, `${channel}`, true)
        //     .addField(`Parent Channel:`, `<#${channel.parent.id}>`, true)
        //     .setDescription(`This could mean the thread has been renamed or the thread has been archived. The API makes no distinction.`)
        //     .setTimestamp()

        // // FETCHING LOG CHANNEL AND SENDING CLOSURE NOTICE
        // modLogChannel.send({ embeds: [threadLogEntry] })
        //     .catch(err => console.log(err))
	},
};