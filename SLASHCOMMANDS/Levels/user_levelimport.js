const discord = require('discord.js')
const config = require ('../../config.json')
const levels = require('discord-xp');

module.exports = {
    name: 'user_levelimport',
    description: `(ADMIN) Import MEE6 Leaderboard values for up to 5 users at a time.`,
    options: [
        {
            name: `user1`,
            description: `The user who's XP is being imported.`,
            type: `USER`,
            required: true
        },{
            name: `xp_value1`,
            description: `The XP value the user currently has.`,
            type: `INTEGER`,
            required: true
        },{
            name: `user2`,
            description: `The user who's XP is being imported.`,
            type: `USER`,
            required: false
        },{
            name: `xp_value2`,
            description: `The XP value the user currently has.`,
            type: `INTEGER`,
            required: false
        },{
            name: `user3`,
            description: `The user who's XP is being imported.`,
            type: `USER`,
            required: false
        },{
            name: `xp_value3`,
            description: `The XP value the user currently has.`,
            type: `INTEGER`,
            required: false
        },{
            name: `user4`,
            description: `The user who's XP is being imported.`,
            type: `USER`,
            required: false
        },{
            name: `xp_value4`,
            description: `The XP value the user currently has.`,
            type: `INTEGER`,
            required: false
        },{
            name: `user5`,
            description: `The user who's XP is being imported.`,
            type: `USER`,
            required: false
        },{
            name: `xp_value5`,
            description: `The XP value the user currently has.`,
            type: `INTEGER`,
            required: false
        }
    ],
    permissions: 'ADMINISTRATOR',
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const user1 = inputs[0];
        const xpValue1 = inputs[1];
        const user2 = inputs[2];
        const xpValue2 = inputs[3];
        const user3 = inputs[4];
        const xpValue3 = inputs[5];
        const user4 = inputs[6];
        const xpValue4 = inputs[7];
        const user5 = inputs[8];
        const xpValue5 = inputs[9];


        // APPEND XP VALUE FOR USER
        levels.appendXp(user.id, interaction.guild.id, xpValue);





    }
}