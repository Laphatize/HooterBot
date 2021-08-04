const discord = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'permissions_check',
    description: `ADMIN | Lists bot's current permissions in the server [60s]`,
    options: [],
    permissions: 'MANAGE_MESSAGES', //ADMINISTRATOR
    cooldown: 60,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // HOOTERBOT PERMISSIONS LIST
        let permissionsArray = interaction.guild.me.permissions.toArray()
        let permsHave = [];

        let notPermissionsArray = !interaction.guild.me.permissions.toArray()
        let permsDoesNotHave = [];


        for (const permission of permissionsArray) {
            permsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
        }

        for (const permission of notPermissionsArray) {
            permsDoesNotHave.push(`${config.emjREDTICK} \`\`${permission}\`\``)
        }


        let logPerms = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`${config.botName} has joined the server!`)
            .setDescription(`**HooterBot's ID:** \`\`${config.botId}\`\``)
            .addField(`PERMISSIONS`, `${permsHave.join(`\n`)}`, true)
            .addField(`\u200b`, `${permsDoesNotHave.join(`\n`)}`, true)
            .setTimestamp()


        // LOG ENTRY
        return interaction.reply({ embeds: [logPerms] })
    }
}