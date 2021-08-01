const discord = require('discord.js')
const config = require ('../../config.json')
const ticketBlacklistSchema = require('../../Database/ticketBlacklistSchema');

module.exports = {
    name: 'verif_category',
    description: `(ADMIN) Set the category for ticket channels to be created. (Do not change once set!)`,
    options: [
        {
            name: `channel`,
            description: `The name of the category.`,
            type: `CHANNEL`,
            required: true,
        },
    ],
    permissions: 'ADMINISTRATOR',
    cooldown: 15,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const category = inputs[0];

    }
}