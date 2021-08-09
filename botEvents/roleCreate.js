const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'roleCreate',
	async execute(role, client) {

        // IGNORE BIRTHDAY ROLE CREATIONS
        if(role.name.startsWith(`birthday`))   return;


        // LOG CHANNEL
        const modLogChannel = role.guild.channels.cache.find(ch => ch.name === `mod-log`)

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
            'USE_PUBLIC_THREADS',
            'USE_PRIVATE_THREADS',
            'MANAGE_THREADS',
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

        let generalPermsHave = [];

            // HOOTERBOT'S GENERAL PERMISSIONS ARRAY
            for (const permission of generalPermsArray) {
                if(role.permissions.has(permission)) {
                    generalPermsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
                }
                else {
                    generalPermsHave.push(`${config.emjREDTICK} \`\`${permission}\`\``)
                }
            }


            // HOOTERBOT'S TEXT PERMISSIONS ARRAY
            let textPermsHave = [];

            // CHECKING GENERAL PERMS
            for (const permission of textPermsArray) {
                if(role.permissions.has(permission)) {
                    textPermsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
                }
                else {
                    textPermsHave.push(`${config.emjREDTICK} \`\`${permission}\`\``)
                }
            }
            

            // HOOTERBOT'S TEXT PERMISSIONS ARRAY
            let voicePermsHave = [];

            // CHECKING GENERAL PERMS
            for (const permission of voicePermsArray) {
                if(role.permissions.has(permission)) {
                    voicePermsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
                }
                else {
                    voicePermsHave.push(`${config.emjREDTICK} \`\`${permission}\`\``)
                }
            }


        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`Role Created`)
            .addField(`Role:`, `${role}`, true)
            .addField(`ID:`, `${role.id}`, true)
            .addField(`Color:`, `[${role.hexColor}](https://www.google.com/search?q=color+picker+%23${role.hexColor.split('#').pop()})`, true)
            .addField(`General Permissions:`,`${generalPermsHave.join(`\n`)}`, true)
            .addField(`Text Permissions:`,`${textPermsHave.join(`\n`)}`, true)
            .addField(`Voice Permissions:`,`${voicePermsHave.join(`\n`)}`, true)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};