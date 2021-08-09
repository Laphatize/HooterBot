module.exports = {
    name: 'verif',
    description: 'Commands regarding server verification',
    options: [
        {
            // USER BIRTHDAY
            name: `blacklist`,
            description: `ADMIN | Blacklist a user from the verification system.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `user`,
                    description: `User to blacklist.`,
                    type: `USER`,
                    required: true
                },{
                    name: `reason`,
                    description: `Reason for blacklist.`,
                    type: `STRING`,
                    required: true
                }
            ]    
        },{
            // MAINTENANCE
            name: `maintenance`,
            description: `ADMIN | Import MEE6 Leaderboard values for up to 10 users at a time.`,
            type: 'SUB_COMMAND',
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
                }
            ]
        },{
            // PERKS EMBED
            name: `perks`,
            description: `ADMIN | Generate/update the verification perks embed message.`,
            type: 'SUB_COMMAND',
            options: [],
        },{
            // PROMPT EMBED
            name: `prompt`,
            description: `ADMIN | Generate/update the verification prompt containing the buttons.`,
            type: 'SUB_COMMAND',
            options: [],
        },
    ],
    permissions: 'MANAGE_MESSAGES',
    dmUse: false,
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRAB SUBCOMMAND
        let subCmdName = interaction.options.getSubCommand()

        interaction.reply(`You chose the ${subCmdName} subcommand.`)
    }
}