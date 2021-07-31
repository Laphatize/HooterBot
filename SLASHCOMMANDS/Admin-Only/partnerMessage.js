const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'partnermessage',
    description: `(ADMIN) Generate an embed in \#server-announcements to promote messages from partner servers.`,
    options: [
        {
            name: `partner name`,
            description: `The name of the partner server`,
            type: `STRING`,
            required: true
        },{
            name: `message`,
            description: `The main body of the announcement message`,
            type: `STRING`,
            required: true
        },{
            name: `image url`,
            description: `Optional URL to an image to be attached`,
            type: `STRING`,
            required: false
        },
    ],
    run: async(client, interaction, args) => {

        const partnerName = interaction.options.get('parner name');
        const partnerMsg = interaction.options.get('message');
        const imageUrl = interaction.options.get('image url');

        interaction.reply({ content: `This command will eventually allow you to post partner messages. For now, this slash command is offline. Consider using the \`\`$partnermessage\`\` command instead.\partnerName = ${partnerName}\npartnerMsg = ${partnerMsg}\nimageUrl = ${imageUrl}`, ephemeral: true })
    }
}