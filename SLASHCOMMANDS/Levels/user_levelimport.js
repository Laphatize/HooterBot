const discord = require('discord.js')
const config = require ('../../config.json')
const levels = require('discord-xp');

module.exports = {
    name: 'user_levelimport',
    description: `(ADMIN) Import MEE6 Leaderboard values.`,
    options: [
        {
            name: `user`,
            description: `The user who's XP is being imported.`,
            type: `USER`,
            required: true
        },{
            name: `xp_value`,
            description: `The XP value the user currently has.`,
            type: `INTEGER`,
            required: true
        }
    ],
    permissions: 'ADMINISTRATOR',
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const user = inputs[0];
        const xpValue = inputs[1];



    }
}