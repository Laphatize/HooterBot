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
    permissions: 'ADMINISTRATOR',
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // APPEND XP VALUE FOR USERS
        // 1st USER
        levels.appendXp(inputs[0], interaction.guild.id, inputs[1]);

        if(user2) {
            levels.appendXp(inputs[2], interaction.guild.id, inputs[3]);
        } if(user3) {
            levels.appendXp(inputs[4], interaction.guild.id, inputs[5]);
        } if(user4) {
            levels.appendXp(inputs[6], interaction.guild.id, inputs[7]);
        } if(user5) {
            levels.appendXp(inputs[8], interaction.guild.id, inputs[9]);
        } if(user6) {
            levels.appendXp(inputs[10], interaction.guild.id, inputs[11]);
        } if(user7) {
            levels.appendXp(inputs[12], interaction.guild.id, inputs[13]);
        } if(user8) {
            levels.appendXp(inputs[14], interaction.guild.id, inputs[15]);
        } if(user9) {
            levels.appendXp(inputs[16], interaction.guild.id, inputs[17]);
        } if(user10) {
            levels.appendXp(inputs[18], interaction.guild.id, inputs[19]);
        }

        // CONFIRMATION
        interaction.reply({ content: 'The user(s) XP has been added to the database.', ephemeral: true })
    }
}