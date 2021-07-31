const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

// GRABBING MOD AND ADMIN ROLES
let modRoleId = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() == 'moderator').id;
let adminRoleId = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() == 'admin').id;

module.exports = {
    name: 'addbirthday',
    description: `(ADMIN) A command for admins to migrate MEE6's birthdays over to HooterBot.`,
    options: [
        {
            name: `partner_name`,
            description: `The name of the partner server`,
            type: `STRING`,
            required: true
        },{
            name: `message`,
            description: `The main body of the announcement message`,
            type: `STRING`,
            required: true
        },{
            name: `image_url`,
            description: `Image URL to be attached to message`,
            type: `STRING`,
            required: false
        },
    ],
    permissions: [{
        id: adminRoleId,
        type: "ROLE",
        permission: true,
    }],
    run: async(client, interaction, args) => {
        // GRABBING SLASH COMMAND INPUT VALUES
        const partnerName = inputs[0];
        const partnerMsg = inputs[1];
        const imageUrl = inputs[2];

        interaction.reply({ content: 'This command will eventually allow you to add birthdays. For now, this slash command is offline. Consider using the \`\`$addbirthday\`\` command instead.', ephemeral: true })
    }
}