const discord = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'permissions_check',
    description: `ADMIN | Checks HooterBot's permissions OR the permissions of a specific role in a channel.`,
    options: [
        {
            name: `channel`,
            description: `Name of the channel to check HooterBot's permissions`,
            type: `CHANNEL`,
            required: false
        }, {
            name: `role`,
            description: `Specify the role to use for checking permissions. `,
            type: `ROLE`,
            required: false
        }
    ],
    permissions: 'MANAGE_MESSAGES', //ADMINISTRATOR
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        const generalPermsArray = [
            'ADMINISTRATOR',
            'MANAGE_CHANNELS',
            'MANAGE_ROLES',
            'MANAGE_EMOJIS',
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
                .addField(`General Permissions:`,`${generalPermsHave.join(`\n`)}`)
                .addField(`Text Permissions:`,`${textPermsHave.join(`\n`)}`)
                .addField(`Voice Permissions:`,`${voicePermsHave.join(`\n`)}`)
                .setTimestamp()

            return interaction.reply({ embeds: [logPerms] })
        }

        if(inputs[0]) {

            // FETCH CHANNEL
            targetChannel = interaction.guild.channels.cache.find(ch => ch.id === inputs[0])


            // HOOTERBOT'S PERMISSIONS IN THE SPECIFIED CHANNEL
            let permissionsArray = targetChannel.permissionsFor(interaction.guild.me).toArray()
            let chPermsHave = [];

            for (const permission of permissionsArray) {
                chPermsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
            }

            if (chPermsHave.length === 0 ) {
                chPermsHave.push(`${config.emjREDTICK} \`\`No Permissions Enabled\`\``)
            }


            let logPerms = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`${config.botName}'s Permisisons in #${targetChannel.name}:`)
                .setDescription(`**PERMISSIONS**\n${chPermsHave.join(`\n`)}`)
                .setTimestamp()

            return interaction.reply({ embeds: [logPerms] })
        }
    }
}