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

        let permissionsArray = interaction.guild.me.permissions.toArray()
        let perms = [];


        for (const permission of permissionsArray) {
            perms.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
        }



        // LOG ENTRY
        return interaction.reply({ content: `HooterBot's permissions:\n${perms.join(`\n`)}` })
    }
}