const discord = require('discord.js');
const config = require('../config.json');
const guildSchema = require('../Database/guildSchema');

module.exports = {
	name: 'guildCreate',
	async execute(guild, client) {

        console.log(`======================================`)
        console.log(`GUILD EVENT: NEW SERVER JOINED`)

        const botChannel = guild.channels.cache.find(ch => ch.name === `🤖｜bot-spam`)
        const introduceYourselfChannel = guild.channels.cache.find(ch => ch.name === `📢｜introduce-yourself`)
        const modLogChannel = guild.channels.cache.find(ch => ch.name === `mod-log`)

        // DM EMBED MESSAGE
        const botJoinEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`👋 **Hello Owls!** ${config.emjTempleT}`)
            .setDescription(`*How do you do, fellow college kids?* I'm ${config.botName}, a bot built by <@${config.botAuthorId}> to help out in the server *(please yell at him if I ever break)*. I like long walks on the beach and throwing long error stacks at MrMusicMan789 when he makes silly programming mistakes. I don't know what I'm going to study at Temple since I've not been given machine learning code (...yet? 👀), but I'm looking forward to hanging out with everyone in the server!
            \nIt's going to take some time for MMM to get me set me up in here, but in the meantime you can check out all my commands in ${botChannel} by typing \`\`/\`\` *(oooh, slash commands, fancy...)* and running \`\`/bot_info\`\`.`)


        // SEND TO #introduce-yourself CHANNEL
        const message = await introduceYourselfChannel.send({embeds: [botJoinEmbed]})
        console.log(`GUILD NAME: ${message.guild.name}`)


        // CREATE GUILD ENTRY - FOR NOW LEFT TO UPDATE SINCE DATABASE DELETION IS NOT CONFIGURED
        await guildSchema.findOneAndUpdate({
            GUILD_NAME: guild.name
        },{
            GUILD_NAME: guild.name,
            GUILD_ID: guild.id,
            TICKET_CAT_ID: "",
            RULES_MSG_ID: "",
            VERIF_PERKS_MSG_ID: "",
            VERIF_PROMPT_MSG_ID: ""
        },{
            upsert: true
        }).exec();
        

        console.log(`======================================\n\n`)



        // HOOTERBOT PERMISSIONS LIST
        let permissionsArray = guild.me.permissions.toArray()
        let permsHave = [];


        for (const permission of permissionsArray) {
            permsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
        }


        // LOGGING BOT JOINING GUILD
        let logJoinGuild = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`${config.botName} has joined the server!`)
            .setDescription(`**HooterBot's ID:** \`\`${config.botId}\`\`
            \n\nBefore users start using HooterBot, ${config.botAuthor} needs to configure my settings and run some tests.`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logJoinGuild]})


        // LOGGING BOT JOINING GUILD
        let logPermsIntentsJoinGuild = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`Here is a list of my enabled intents and permissions:`)
            .setDescription(`**PERMISSIONS**\n${permsHave.join(`\n`)}`)
            .addField(`INTENTS:`, `${config.emjGREENTICK} GUILDS\n${config.emjGREENTICK} GUILD_MEMBERS\n${config.emjGREENTICK} GUILD_MESSAGES\n${config.emjGREENTICK} DIRECT_MESSAGES`)
            .addField(`PARTIALS:\n${config.emjGREENTICK} CHANNEL\n${config.emjGREENTICK} MESSAGE`, true)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logPermsIntentsJoinGuild]})
	},
};