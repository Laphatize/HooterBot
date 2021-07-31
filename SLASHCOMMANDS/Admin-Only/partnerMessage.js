const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'partnermessage',
    description: `(ADMIN) Generate an embed in \#server-announcements to promote messages from partner servers.`,
    run: async(client, interaction, args) => {

        args = [
            {
                name: `partner name`,
                description: `The name of the partner server`,
                type: `String`,
                required: true
            },{
                name: `message`,
                description: `The main body of the announcement message`,
                type: `String`,
                required: true
            },{
                name: `Partner Name`,
                description: `The name of the partner server`,
                type: `String`,
                required: false
            },
        ]

        interaction.reply({ content: 'This command will eventually allow you to post partner messages. For now, this slash command is offline. Consider using the \`\`$partnermessage\`\` command instead.', ephemeral: true })
    }
}