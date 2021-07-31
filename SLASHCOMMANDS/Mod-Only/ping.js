const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'ping',
    description: `${config.botName}'s first slash command.`,
    options: [],
    defaultPermission: false,
    run: async(client, interaction, args) => {
        interaction.reply({ content: 'Hello World! This is my first (legit) slash command!', ephemeral: true })
    }
}