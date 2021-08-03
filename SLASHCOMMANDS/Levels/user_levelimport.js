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
        },        {
            name: `user6`,
            description: `The user who's XP is being imported.`,
            type: `USER`,
            required: true
        },{
            name: `xp_value6`,
            description: `The XP value the user currently has.`,
            type: `INTEGER`,
            required: true
        },{
            name: `user7`,
            description: `The user who's XP is being imported.`,
            type: `USER`,
            required: false
        },{
            name: `xp_value7`,
            description: `The XP value the user currently has.`,
            type: `INTEGER`,
            required: false
        },{
            name: `user8`,
            description: `The user who's XP is being imported.`,
            type: `USER`,
            required: false
        },{
            name: `xp_value8`,
            description: `The XP value the user currently has.`,
            type: `INTEGER`,
            required: false
        },{
            name: `user9`,
            description: `The user who's XP is being imported.`,
            type: `USER`,
            required: false
        },{
            name: `xp_value9`,
            description: `The XP value the user currently has.`,
            type: `INTEGER`,
            required: false
        },{
            name: `user10`,
            description: `The user who's XP is being imported.`,
            type: `USER`,
            required: false
        },{
            name: `xp_value10`,
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
        const user6 = inputs[10];
        const xpValue6 = inputs[11];
        const user7 = inputs[12];
        const xpValue7 = inputs[13];
        const user8 = inputs[14];
        const xpValue8 = inputs[15];
        const user9 = inputs[16];
        const xpValue9 = inputs[17];
        const user10 = inputs[18];
        const xpValue10 = inputs[19];


        // APPEND XP VALUE FOR USER
        levels.appendXp(user.id, interaction.guild.id, xpValue);

        console.log(`xpValue1 = ${xpValue1}`)

        if(user2) {
            console.log(`xpValue2 = ${xpValue2}`)
        } if(user3) {
            console.log(`xpValue3 = ${xpValue3}`)
        } if(user4) {
            console.log(`xpValue4 = ${xpValue4}`)
        } if(user5) {
            console.log(`xpValue5 = ${xpValue5}`)
        } if(user6) {
            console.log(`xpValue6 = ${xpValue6}`)
        } if(user7) {
            console.log(`xpValue7 = ${xpValue7}`)
        } if(user8) {
            console.log(`xpValue8 = ${xpValue8}`)
        } if(user9) {
            console.log(`xpValue9 = ${xpValue9}`)
        } if(user10) {
            console.log(`xpValue10 = ${xpValue10}`)
        }


    }
}