const discord = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'admin',
    description: `A series of administrator commands.`,
    options: [
        {
            name: `partner_message`,
            type: `SUB_COMMAND`,
            description: `(ADMIN) Generate an embed in \#server-announcements to promote messages from partner servers.`,
        },{
            name: `rules`,
            type: `SUB_COMMAND`,
            description: `(ADMIN) Generates/updates rules, server staff, andModMail ticket instruction embeds.`,
        },{
            name: `user_birthday`,
            type: `SUB_COMMAND`,
            description: `(ADMIN) A command for admins to migrate MEE6's birthdays over to HooterBot.`,
        },
    ],
    permissions: 'ADMINISTRATOR',
    cooldown: 10,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

    }
}