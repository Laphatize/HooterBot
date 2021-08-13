const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'userUpdate',
	async execute(oldUser, newUser, client) {

        console.log(`The userUpdate event has fired, and if you're seeing this, it's working but the rest of your code is not!`)

        // FETCH NEW USER IN EACH GUILD
        console.log(`client.guilds.cache.keyArray() = ${client.guilds.cache.keyArray()}`)

        // for(let guild in client.guilds) {
        //     console.log(`guild.id = ${guild.id}`)
        // }

        // // LOG CHANNEL
        // const modLogChannel = oldUser.guild.channels.cache.find(ch => ch.name === `mod-log`)
        
        
        // PARTIAL USER
        if (oldUser.partial || newUser.partial) {
            try {
                await oldUser.fetch()
                await newUser.fetch()
            } catch (err) {
                return console.log(err);
            }
        }

        
        // // AVATAR CHANGE
        // if(oldUser.avatar !== newUser.avatar) {
        //     // LOG EMBED
        //     let logEmbed = new discord.MessageEmbed()
        //         .setColor(config.embedGrey)
        //         .setTitle(`Avatar Update`)
        //         .setThumbnail(newUser.user.displayAvatarURL({ dynamic:true }))
        //         .setAuthor(newUser.user.tag, oldUser.user.displayAvatarURL({ dynamic:true }))
        //         .addField(`Old:`, `[Avatar Link](${oldUser.avatarURL})`, true)
        //         .addField(`\u200b`, `🡲`, true)
        //         .addField(`New:`, `[Avatar Link](${newUser.avatarURL})`, true)
        //         .setTimestamp()
        //         .setFooter(`User ID: ${newUser.id}`)
        //     // LOG ENTRY
        //     modLogChannel.send({embeds: [logEmbed]})
        // }

        // // DISCRIMINATOR CHANGE
        // if(oldUser.discriminator !== newUser.discriminator) {
        //     // LOG EMBED
        //     let logEmbed = new discord.MessageEmbed()
        //         .setColor(config.embedGrey)
        //         .setTitle(`Discriminator Changed`)
        //         .setAuthor(newUser.user.tag, newUser.user.displayAvatarURL({ dynamic:true }))
        //         .addField(`Old:`, `${oldUser.discriminator}`, true)
        //         .addField(`\u200b`, `🡲`, true)
        //         .addField(`New:`, `${newUser.discriminator}`, true)
        //         .setTimestamp()
        //         .setFooter(`User ID: ${newUser.id}`)
        //     // LOG ENTRY
        //     modLogChannel.send({embeds: [logEmbed]})
        // }

        // // USERNAME CHANGE
        // if(oldUser.username !== newUser.username) {
        //     // LOG EMBED
        //     let logEmbed = new discord.MessageEmbed()
        //         .setColor(config.embedGrey)
        //         .setTitle(`Username Changed`)
        //         .setAuthor(newUser.user.tag, newUser.user.displayAvatarURL({ dynamic:true }))
        //         .addField(`Old:`, `${oldUser.username}`, true)
        //         .addField(`\u200b`, `🡲`, true)
        //         .addField(`New:`, `${newUser.username}`, true)
        //         .setTimestamp()
        //         .setFooter(`User ID: ${newUser.id}`)
        //     // LOG ENTRY
        //     modLogChannel.send({embeds: [logEmbed]})
        // }
	},
};