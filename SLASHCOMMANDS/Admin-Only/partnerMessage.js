const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'partnermessage',
    description: `(ADMIN) Generate an embed in \#server-announcements to promote messages from partner servers.`,
    options: [
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
            name: `image url`,
            description: `Optional URL to an image to be attached`,
            type: `String`,
            required: false
        },
    ],
    run: async(client, interaction, args) => {

        const { value: PartnerName } = interaction.options.get('parner name');
        const { value: MessageValue } = interaction.options.get('message');
        const { value: imageUrl } = interaction.options.get('image url');

        interaction.reply({ content: `This command will eventually allow you to post partner messages. For now, this slash command is offline. Consider using the \`\`$partnermessage\`\` command instead.\nPartnerName = ${PartnerName}\nMessageValue = ${MessageValue}\nimageUrl = ${imageUrl}`, ephemeral: true })
    }
}