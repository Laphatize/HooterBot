const discord = require('discord.js')
const config = require ('../../config.json')
const ticketBlacklistSchema = require('../../Database/ticketBlacklistSchema');

module.exports = {
    name: 'verif_maintenance',
    description: `(ADMIN) Toggle verification prompt to enter/exit maintenance mode.`,
    options: [
        {
            name: `status`,
            description: `ON / OFF`,
            type: `STRING`,
            required: true,
            choices: [
                {
                    name: `ON`,
                    value: `ON`,
                },{
                    name: `OFF`,
                    value: `OFF`,
                }
            ]
        },
    ],
    permissions: 'ADMINISTRATOR',
    cooldown: 15,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const status = inputs[0];

    }
}