const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadUpdate',
	async execute(channel, client) {

        console.log(`channel = ${channel}`) // CHANNEL OBJECT - THREAD
        console.log(`channel.guild = ${channel.guild}`) // NAME OF GUILD
        console.log(`channel.guild.id = ${channel.guild.id}`) // GUILD ID


        // HARD-CODING GUILD IDs IN (BECAUSE IT'S FRUSTRATING ME OTHERWISE)
        if(channel.guild === `MMM789 Test Server`) {
            guild = client.guilds.cache.get(`530503548937699340`)
        }
        if(channel.guild === `Temple University`) {
            guild = client.guilds.cache.get(`829409161581821992`)
        }


        console.log(`CHECKING: guild.name = ${guild.name}`)

        
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