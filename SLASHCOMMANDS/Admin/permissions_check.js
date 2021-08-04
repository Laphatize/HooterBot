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

        console.log(`interaction.guild.me.permissions = ${interaction.guild.me.permissions}`)

        // LOG ENTRY
        return interaction.reply({ content: `Please check the log, MMM`, ephemeral: true })
    }
}