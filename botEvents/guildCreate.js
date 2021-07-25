const discord = require('discord.js');
const config = require('../config.json');
const guildSchema = require('../Database/guildSchema');

module.exports = {
	name: 'guildCreate',
	async execute(member, client) {

        console.log(`======================================`)
        console.log(`GUILD EVENT: NEW SERVER JOINED`)


        // DM EMBED MESSAGE
        const botJoinEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`👋 **Hello fellow owls!** ${config.emjTempleT}`)
            .setDescription(`I'm ${config.botName}, a bot built by <@${config.botAuthorId}> to help out in the server *(please yell at him if I ever break)*. I like long walks on the beach and throwing long callstacks at MrMusicMan789 when he makes silly programming mistakes. I don't know what I'm going to study at Temple since I've not been given machine learning code (...yet?), but I'm looking forward to hanging out with everyone in the server.
            \nIf you want to learn more about me and what I can do, head to <#${config.botchannelId}> and run my commands \`\`${config.prefix}botinfo\`\` and \`\`${config.prefix}help\`\`.'`)


        // SEND TO #introduce-yourself CHANNEL
        const message = await client.channels.cache.get(config.introductionsChannelId).send({embeds: [botJoinEmbed]})
        console.log(`GUILD NAME: ${message.guild.name}`)


        // CREATE GUILD ENTRY - FOR NOW LEFT TO UPDATE SINCE DATABASE DELETION IS NOT CONFIGURED
        dbData = await guildSchema.findOneAndUpdate({ GUILD_NAME: message.guild.name }).exec();
        console.log(`======================================\n\n`)
	},
};