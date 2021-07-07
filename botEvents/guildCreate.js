const discord = require('discord.js');
const config = require('../config.json');
const guildSchema = require('../Database/guildSchema');

module.exports = {
	name: 'guildCreate',
	async execute(member, client) {
      
            const introduceYourselfChannel = client.channels.cache.get(config.introductionsChannelId)

            // DM EMBED MESSAGE
            const botJoinEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`👋 **Hello fellow owls!** ${config.emjTempleT}`)
                .setDescription(`I'm ${config.botName}, a bot built by <@${config.botAuthor}> to help out in the server. I like throwing long error messages at MrMusicMan789 and exploring new features on Discord. I don't know what I'm going to study at Temple since I've not been given machine learning code (...yet, right?), but I'm looking forward to hanging out with everyone in the server! :)\nIf you want to learn more about me and what I can do, head to <#${config.botchannelId}> and run my commands \`\`<PREFIX>botinfo.\`\` and \`\`<PREFIX>help\`\`.'`)
            
            // SEND TO #introduce-yourself CHANNEL
            await introduceYourselfChannel.send({embeds: [botJoinEmbed]})
            .catch(err => console.log(err))
            .then(async msg => {


                // CREATE DATABASE ENTRY FOR GUILD
                const result = await guildSchema.findOne({
                    // CONTENT USED TO FIND UNIQUE ENTRY
                    GUILD_NAME: msg.guild.name,
                    GUILD_ID: msg.guild.id
                })
                
                console.log(`result = ${result}`)

                // if(!result){
                //     await guildSchema.insertOne({
                //         GUILD_NAME: msg.guild.name,
                //         GUILD_ID: msg.guild.id,
                //         REGISTERED: Date.now(),
                //         PREFIX: config.prefix,
                //         TICKET_CAT_ID: null,
                //         VERIF_PROMPT_CH_ID: null,
                //         VERIF_PROMPT_MSG_ID: null
                //     },{ 
                //         // IF DNE, CREATE ENTRY FOR GUILD
                //         upsert: true
                //     })
                // }
            })
            .catch(err => console.log(err))
	},
};