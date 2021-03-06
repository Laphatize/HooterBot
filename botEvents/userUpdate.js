const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'userUpdate',
	async execute(oldUser, newUser, client) {

        // FETCH EACH GUILD, IF MEMBER PUSH INTO ARRAY OF ID'S
        let guildIdArray = []
        client.guilds.cache.each(guild => {
            if(guild.members.cache.get(newUser.id)) {
                guildIdArray.push(guild.id)
            }
        })

        
        // PARTIAL USER
        if (oldUser.partial || newUser.partial) {
            try {
                await oldUser.fetch()
                await newUser.fetch()
            } catch (err) {
                return console.log(err);
            }
        }

        
        // AVATAR CHANGE
        if(oldUser.avatar !== newUser.avatar) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Avatar Update`)
                .setThumbnail(newUser.displayAvatarURL({ dynamic:true }))
                .setAuthor(newUser.tag, oldUser.displayAvatarURL({ dynamic:true }))
                .addField(`Old:`, `[Avatar Link](${oldUser.avatarURL()})`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`New:`, `[Avatar Link](${newUser.avatarURL()})`, true)
                .setTimestamp()
                .setFooter(`User ID: ${newUser.id}\nNote: Old Avatar URLs may be invalid.`)

            // LOG ENTRY IN EACH GUILD THE USER IS IN
            guildIdArray.forEach( guildId => {
                // FETCH GUILD BY ID
                client.guilds.fetch(guildId)
                    .then(guild => {
                        guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logEmbed]})
                    })
            })
        }

        // DISCRIMINATOR CHANGE
        if(oldUser.discriminator !== newUser.discriminator) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Discriminator Changed`)
                .setAuthor(newUser.tag, newUser.displayAvatarURL({ dynamic:true }))
                .addField(`Old:`, `${oldUser.discriminator}`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`New:`, `${newUser.discriminator}`, true)
                .setTimestamp()
                .setFooter(`User ID: ${newUser.id}`)
            
            // LOG ENTRY IN EACH GUILD THE USER IS IN
            guildIdArray.forEach( guildId => {
                // FETCH GUILD BY ID
                client.guilds.fetch(guildId)
                    .then(guild => {
                        guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logEmbed]})
                    })
            })
        }

        // USERNAME CHANGE
        if(oldUser.username !== newUser.username) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`Username Changed`)
                .setAuthor(newUser.tag, newUser.displayAvatarURL({ dynamic:true }))
                .addField(`Old:`, `${oldUser.username}`, true)
                .addField(`\u200b`, `🡲`, true)
                .addField(`New:`, `${newUser.username}`, true)
                .setTimestamp()
                .setFooter(`User ID: ${newUser.id}`)
            
                // LOG ENTRY IN EACH GUILD THE USER IS IN
            guildIdArray.forEach( guildId => {
                // FETCH GUILD BY ID
                client.guilds.fetch(guildId)
                    .then(guild => {
                        guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logEmbed]})
                    })
            })
        }
	},
};