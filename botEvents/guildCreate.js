const discord = require('discord.js');
const config = require('../config.json');
const guildSchema = require('../Database/guildSchema');

module.exports = {
	name: 'guildCreate',
	async execute(member, client) {

        console.log(`======================================`)
        console.log(`GUILD EVENT: NEW SERVER JOINED`)
        console.log(`======================================`)


        // DM EMBED MESSAGE
        const botJoinEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`👋 **Hello fellow owls!** ${config.emjTempleT}`)
            .setDescription(`I'm ${config.botName}, a bot built by <@${config.botAuthorId}> to help out in the server *(please yell at him if I ever break)*. I like long walks on the beach and throwing long error messages at MrMusicMan789. I don't know what I'm going to study at Temple since I've not been given machine learning code (...yet?), but I'm looking forward to hanging out with everyone in the server.
            \nIf you want to learn more about me and what I can do, head to <#${config.botchannelId}> and run my commands \`\`${config.prefix}botinfo\`\` and \`\`${config.prefix}help\`\`.'`)


        // SEND TO #introduce-yourself CHANNEL
        const message = await client.channels.cache.get(config.introductionsChannelId).send({embeds: [botJoinEmbed]})


        // CREATE GUILD ENTRY - FOR NOW LEFT TO UPDATE SINCE DATABASE DELETION IS NOT CONFIGURED
        await guildSchema.findOneAndUpdate({
            // CONTENT USED TO FIND UNIQUE ENTRY
            GUILD_NAME: message.guild.name,
            GUILD_ID: message.guild.id
        },{
            // CONTENT TO BE UPDATED
            PREFIX: config.prefix
        },{ 
            upsert: true
        })



        // console.log(`======================================\n\n`)
	},
};