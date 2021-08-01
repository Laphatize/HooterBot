const discord = require('discord.js')
const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    type: 'SUB_COMMAND',
    name: 'user_birthday',
    description: `(ADMIN) A command for admins to migrate MEE6's birthdays over to HooterBot.`,
    options: [
        {
            name: `user_id`,
            description: `The user's ID`,
            type: `USER`,
            required: true
        },{
            name: `month`,
            description: `The two-digit month value.`,
            type: `INTEGER`,
            required: true
        },{
            name: `day`,
            description: `The two-digit day value.`,
            type: `INTEGER`,
            required: true
        },
    ],
    permissions: 'ADMINISTRATOR',
    cooldown: 10,
    defaultPermission: false,
    run: async(client, interaction, args) => {
        // GRABBING SLASH COMMAND INPUT VALUES
        const partnerName = inputs[0];
        const partnerMsg = inputs[1];
        const imageUrl = inputs[2];

        interaction.reply({ content: 'This command will eventually allow you to add birthdays. For now, this slash command is offline. Consider using the \`\`$addbirthday\`\` command instead.', ephemeral: true })
    }
}