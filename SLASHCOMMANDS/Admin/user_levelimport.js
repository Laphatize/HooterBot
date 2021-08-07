const discord = require('discord.js')
const config = require ('../../config.json')
const levels = require('discord-xp');

// COMMAND ID: 871663009343369237

module.exports = {
    name: 'user_levelimport',
    description: `ADMIN | Import MEE6 Leaderboard values for up to 10 users at a time.`,
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
            required: false
        },{
            name: `xp_value6`,
            description: `The XP value the user currently has.`,
            type: `INTEGER`,
            required: false
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
    permissions: 'MANAGE_MESSAGES', //ADMINISTRATOR
    cooldown: 0,
    defaultPermission: false,
    run: async(client, interaction, inputs) => {

        // APPEND XP VALUE FOR USERS
        // 1st USER
        levels.appendXp(inputs[0], interaction.guild.id, inputs[1]);

        if(inputs[2]) {
            levels.appendXp(inputs[2], interaction.guild.id, inputs[3]);
        } if(inputs[4]) {
            levels.appendXp(inputs[4], interaction.guild.id, inputs[5]);
        } if(inputs[6]) {
            levels.appendXp(inputs[6], interaction.guild.id, inputs[7]);
        } if(inputs[8]) {
            levels.appendXp(inputs[8], interaction.guild.id, inputs[9]);
        } if(inputs[10]) {
            levels.appendXp(inputs[10], interaction.guild.id, inputs[11]);
        } if(inputs[12]) {
            levels.appendXp(inputs[12], interaction.guild.id, inputs[13]);
        } if(inputs[14]) {
            levels.appendXp(inputs[14], interaction.guild.id, inputs[15]);
        } if(inputs[16]) {
            levels.appendXp(inputs[16], interaction.guild.id, inputs[17]);
        } if(inputs[18]) {
            levels.appendXp(inputs[18], interaction.guild.id, inputs[19]);
        }

        // CONFIRMATION
        interaction.reply({ content: 'The user(s) XP has been added to the database.', ephemeral: true })
    }
}