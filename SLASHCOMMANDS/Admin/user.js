module.exports = {
    name: 'user',
    description: 'Commands regarding server members',
    options: [
        {
            // USER BIRTHDAY
            name: `birthday`,
            description: `ADMIN | A command for admins to migrate MEE6's birthdays over to HooterBot. [10s]`,
            type: 'SUB_COMMAND',
            options: [{
                    name: `user`,
                    description: `The user who's birthday you're migrating.`,
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
                }]
        },{
            // LEVEL IMPORT
            name: `levelimport`,
            description: `ADMIN | Import MEE6 Leaderboard values for up to 10 users at a time.`,
            type: 'SUB_COMMAND',
            options: [{
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
                },{
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
                }],
        },{
            // LEVEL IMPORT
            name: `info`,
            description: `MODERATOR | A command for generating information about a specific user in the server.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `user`,
                    description: `The user to generate information about.`,
                    type: `USER`,
                    required: true
                },
            ],
        },
    ],
    permissions: 'MANAGE_MESSAGES',
    dmUse: false,
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRAB SUBCOMMAND
        let subCmdName = interaction.options.getSubCommand()

        interaction.reply(`You chose the ${subCmdname} subcommand.`)
    }
}