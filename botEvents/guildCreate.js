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

        let notPermissionsArray = !guild.me.permissions.toArray()
        let permsDoesNotHave = [];


        for (const permission of permissionsArray) {
            permsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
        }

        for (const permission of notPermissionsArray) {
            permsDoesNotHave.push(`${config.emjREDTICK} \`\`${permission}\`\``)
        }



        // LOG ENTRY
        // ${perms.join(`\n`)}




        // LOGGING BOT JOINING GUILD
        let logPermissionsJoinGuild = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`${config.botName} has joined the server!`)
            .setDescription(`**HooterBot's ID:** \`\`${config.botId}\`\``)
            .addField(`PERMISSIONS`, `${permsHave.join(`\n`)}`, true)
            .addField(`\u200b`, `${permsDoesNotHave.join(`\n`)}`, true)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logPermissionsJoinGuild]})


        // LOGGING BOT JOINING GUILD
        let logIntentsJoinGuild = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setDescription(`**Here is the list of my enabled intents and permissions:**`)
            .addField(`INTENTS:`, `${config.emjGREENTICK} GUILDS\n${config.emjGREENTICK} GUILD_MEMBERS\n${config.emjREDTICK} GUILD_BANS\n${config.emjREDTICK} GUILD_EMOJIS\n${config.emjREDTICK} GUILD_INTEGRATIONS\n${config.emjREDTICK} GUILD_WEBHOOKS\n${config.emjREDTICK} GUILD_INVITES\n${config.emjREDTICK} GUILD_VOICE_STATES\n${config.emjREDTICK} GUILD_PRESENCES\n${config.emjGREENTICK} GUILD_MESSAGES\n${config.emjREDTICK} GUILD_MESSAGE_REACTIONS\n${config.emjREDTICK} GUILD_MESSAGE_TYPING\n${config.emjGREENTICK} DIRECT_MESSAGES\n${config.emjREDTICK} DIRECT_MESSAGE_REACTIONS\n${config.emjREDTICK} DIRECT_MESSAGE_TYPING`)
            .addField(`PARTIALS:\n${config.emjGREENTICK} CHANNEL\n${config.emjREDTICK} GUILD_MEMBER\n${config.emjGREENTICK} MESSAGE\n${config.emjREDTICK} REACTION\n${config.emjREDTICK} USER`, true)
            .setFooter(`(In the event this is needed for potential debugging)`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logIntentsJoinGuild]})
	},
};