const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'rules',
    description: `(ADMIN) Generates/updates rules, server staff, andModMail ticket instruction embeds.`,
    run: async(client, interaction, args) => {


        interaction.reply({ content: 'This command will eventually allow you to post or update the rules embed. For now, this slash command is offline. Consider using the \`\`$rules\`\` command instead.', ephemeral: true })
    }
}