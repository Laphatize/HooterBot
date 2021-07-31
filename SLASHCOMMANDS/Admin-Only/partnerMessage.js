const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'partnermessage',
    description: `(Admin) Generate an embed in \#server-announcements to promote messages from partner servers.`,
    run: async(client, interaction, args) => {



        interaction.editReply({ content: 'This command will eventually allow you to post partner messages. For now, this slash command is offline. Consider using the \`\`$partnermessage\`\` command instead.', ephemeral: true})
    }
}