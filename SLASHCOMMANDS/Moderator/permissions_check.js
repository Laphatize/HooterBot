const discord = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'permissions_check',
    description: `MODERATOR | Checks HooterBot's permissions OR the permissions of a specific role in a channel.`,
    options: [
        {
            name: `channel`,
            description: `Name of the channel to check HooterBot's permissions`,
            type: `CHANNEL`,
            required: false
        }, {
            name: `role_or_user`,
            description: `Specify the role or user to use for checking permissions. `,
            type: `MENTIONABLE`,
            required: false
        }
    ],
    permissions: 'MANAGE_MESSAGES', // MODERATOR
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

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

        const channel = inputs[0]
        const role = inputs[1]



        if(!channel && !role) {
            // CHECK HOOTERBOT'S GENERAL PERMISSIONS
            let generalPermsHave = [];

            // CHECKING GENERAL PERMS
            for (const permission of generalPermsArray) {
                if(interaction.guild.me.permissions.has(permission)) {
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
                if(interaction.guild.me.permissions.has(permission)) {
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
                if(interaction.guild.me.permissions.has(permission)) {
                    voicePermsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
                }
                else {
                    voicePermsHave.push(`${config.emjREDTICK} \`\`${permission}\`\``)
                }
            }


            // GENERATING EMBED TO NOTE THE PERMISSIONS
            let logPerms = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`${config.botName}'s Discord Permissions:`)
                .addField(`General Permissions:`,`${generalPermsHave.join(`\n`)}`, true)
                .addField(`Text Permissions:`,`${textPermsHave.join(`\n`)}`, true)
                .addField(`Voice Permissions:`,`${voicePermsHave.join(`\n`)}`, true)
                .setTimestamp()

            return interaction.reply({ embeds: [logPerms] })
        }


        // ROLE OR CHANNEL IS MISSING
        if((!channel && role) || (channel && !role)) {
           

            // GENERATING EMBED TO NOTE THE PERMISSIONS
            let missingFieldEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`If you are checking specific permissions, you need to specify **both a role and channel**.`)
                .setFooter(`If this is a bug, please let ${config.botAuthorUsername} know.`)

            // SENDING TO CHANNEL
            return interaction.reply({ embeds: [missingFieldEmbed], ephemeral: true })
        }


        // ROLE AND CHANNEL PROVIDED
        if(channel && role) {

            // FETCH CHANNEL AND ROLE
            const targetChannel = interaction.guild.channels.cache.find(ch => ch.id === channel)
            const targetRole = interaction.guild.roles.cache.find(r => r.id === role)



    
            // GENERATING EMBED TO NOTE THE PERMISSIONS
            let channelRolePermsEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`\`\`${targetRole.name}\`\` role permissions in \`\`#${targetChannel.name}\`\``)

            // SENDING TO CHANNEL
            return interaction.reply({ embeds: [channelRolePermsEmbed], ephemeral: true })
        }
    }
}