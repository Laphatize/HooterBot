const discord = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'permissions_check',
    description: `ADMIN | Lists a user or role's current permissions in the server [60s]`,
    options: [
        {
            name: `user`,
            description: `The user being checked.`,
            type: `USER`,
            required: false
        },{
            name: `role`,
            description: `The role being checked.`,
            type: `ROLE`,
            required: false
        }

    ],
    permissions: 'MANAGE_MESSAGES', //ADMINISTRATOR
    cooldown: 60,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // HOOTERBOT PERMISSIONS LIST
        let permissionsArray = interaction.guild.me.permissions.toArray()
        let permsHave = [];

        for (const permission of permissionsArray) {
            permsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
        }


        let logPerms = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`${config.botName}'s permisisons:`)
            .addField(`PERMISSIONS`, `${permsHave.join(`\n`)}`, true)
            .addField(`INTENTS:`, `${config.emjGREENTICK} GUILDS\n${config.emjGREENTICK} GUILD_MEMBERS\n${config.emjGREENTICK} GUILD_MESSAGES\n${config.emjGREENTICK} DIRECT_MESSAGES`)
            .addField(`PARTIALS:\n${config.emjGREENTICK} CHANNEL\n${config.emjGREENTICK} MESSAGE`, true)
            .addField(`\u200b`, `${permsDoesNotHave.join(`\n`)}`, true)
            .setTimestamp()


        // LOG ENTRY
        return interaction.reply({ embeds: [logPerms] })
    }
}