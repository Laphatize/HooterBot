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
            .setTitle(`${config.emjAnimatedWave} **Hello Owls!** ${config.emjTempleT}`)
            .setDescription(`*How do you do, fellow college kids?* I'm ${config.botName}, a bot built by <@${config.botAuthorId}> to help out in the server *(please yell at him if I ever break)*. I like long walks on the beach and throwing long error stacks at MrMusicMan789 when he makes silly programming mistakes. I don't know what I'm going to study at Temple since I've not been given machine learning code (...yet? 👀), but I'm looking forward to hanging out with everyone in the server!
            \nIt'll take some time for MMM to get me up to my full potential in here, but in the meantime you can check out all my commands in ${botChannel} by typing \`\`/\`\` *(oooh, ✨**[slash commands](https://blog.discord.com/slash-commands-are-here-8db0a385d9e6)**✨, fancy...)* and running \`\`/bot_info\`\`.`)


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
        const generalPermsArray = [
            'ADMINISTRATOR',
            'MANAGE_CHANNELS',
            'MANAGE_ROLES',
            'MANAGE_EMOJIS_AND_STICKERS',
            'VIEW_AUDIT_LOG',
            'VIEW_GUILD_INSIGHTS',
            'MANAGE_WEBHOOKS',
            'MANAGE_GUILD',
            'CREATE_INSTANT_INVITE',
            'CHANGE_NICKNAME',
            'MANAGE_NICKNAMES',
            'KICK_MEMBERS',
            'BAN_MEMBERS',
        ]
        const textPermsArray = [
            'VIEW_CHANNEL',
            'SEND_MESSAGES', 
            'EMBED_LINKS',
            'ATTACH_FILES',
            'ADD_REACTIONS',
            'USE_EXTERNAL_EMOJIS',
            'MENTION_EVERYONE',
            'MANAGE_MESSAGES',
            'READ_MESSAGE_HISTORY',
            'SEND_TTS_MESSAGES',
            'USE_APPLICATION_COMMANDS',
        ]
        const voicePermsArray = [
            'VIEW_CHANNEL',
            'CONNECT',
            'SPEAK',
            'STREAM',
            'USE_VAD',
            'PRIORITY_SPEAKER',
            'MUTE_MEMBERS',
            'DEAFEN_MEMBERS',
            'MOVE_MEMBERS',
            'REQUEST_TO_SPEAK'
        ]


        // LOGGING BOT JOINING GUILD
        let logJoinGuild = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`${config.botName} has joined the server!`)
            .setDescription(`**HooterBot's ID:** \`\`${config.botId}\`\`
            \n\nBefore users start using HooterBot, ${config.botAuthor} needs to configure my settings and run some tests.`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logJoinGuild]})


        // CHECK HOOTERBOT'S GENERAL PERMISSIONS
        let generalPermsHave = [];

        // CHECKING GENERAL PERMS
        for (const permission of generalPermsArray) {
            if(guild.me.permissions.has(permission)) {
                generalPermsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
            }
            else {
                generalPermsHave.push(`${config.emjREDTICK} \`\`${permission}\`\``)
            }
        }


        // CHECK HOOTERBOT'S TEXT PERMISSIONS
        let textPermsHave = [];

        // CHECKING GENERAL PERMS
        for (const permission of textPermsArray) {
            if(guild.me.permissions.has(permission)) {
                textPermsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
            }
            else {
                textPermsHave.push(`${config.emjREDTICK} \`\`${permission}\`\``)
            }
        }
        

        // CHECK HOOTERBOT'S TEXT PERMISSIONS
        let voicePermsHave = [];

        // CHECKING GENERAL PERMS
        for (const permission of voicePermsArray) {
            if(guild.me.permissions.has(permission)) {
                voicePermsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
            }
            else {
                voicePermsHave.push(`${config.emjREDTICK} \`\`${permission}\`\``)
            }
        }


        // LOGGING BOT JOINING GUILD
        let logPermsIntentsJoinGuild = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`Here is a list of my enabled intents and permissions:`)
            .setDescription(`**PERMISSIONS**`)
            .addField(`General Permissions:`,`${generalPermsHave.join(`\n`)}`, true)
            .addField(`Text Permissions:`,`${textPermsHave.join(`\n`)}`, true)
            .addField(`Voice Permissions:`,`${voicePermsHave.join(`\n`)}`, true)
            .addField(`INTENTS:`, `${config.emjGREENTICK} GUILDS\n${config.emjGREENTICK} GUILD_MEMBERS\n${config.emjGREENTICK} GUILD_MESSAGES\n${config.emjGREENTICK} DIRECT_MESSAGES`, true)
            .addField(`PARTIALS:`, `${config.emjGREENTICK} CHANNEL\n${config.emjGREENTICK} MESSAGE`, true)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logPermsIntentsJoinGuild]})
	},
};