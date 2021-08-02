const discord = require('discord.js')
const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'ping',
    description: `${config.botName}'s first slash command. [CD: 60s]`,
    options: [],
    permissions: '',
    cooldown: 60,
    defaultPermission: true,
    run: async(client, interaction, args) => {
        interaction.reply({ content: 'Hello World! This is my first (legit) slash command!', ephemeral: true })
    }
}