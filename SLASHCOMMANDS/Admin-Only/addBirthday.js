const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'addbirthday',
    description: `(Admin) A command for admins to migrate MEE6's birthdays over to HooterBot.`,
    run: async(client, interaction, args) => {



        interaction.reply({ content: 'This command will eventually allow you to add birthdays. For now, this slash command is offline. Consider using the \`\`$addbirthday\`\` command instead.', ephemeral: true })
    }
}