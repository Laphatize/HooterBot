const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'rules',
    description: `(Admin) Generates the current list of rules, server staff, and instructions on submitting ModMail tickets.`,
    run: async(client, interaction, args) => {



        interaction.editReply({ content: 'This command will eventually allow you to post or update the rules embed. For now, this slash command is offline. Consider using the \`\`$rules\`\` command instead.', ephemeral: true})
    }
}