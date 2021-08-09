module.exports = {
    name: 'verif',
    description: 'Commands regarding server verification',
    options: [
        {
            // BLACKLIST
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
            // VERIFICATION CHANNEL PM
            name: `pm`,
            description: `MODERATOR | Send a message in a ticket channel without it being sent to the user.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `message`,
                    description: `Your message for the channel.`,
                    type: `STRING`,
                    required: true,
                },
            ],
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
        let subCmdName = interaction.options.getSubcommand()

        interaction.reply(`You chose the ${subCmdName} subcommand.`)


        // BLACKLIST
        if(subCmdName == 'blacklist') {
            // GETTING OPTIONS VALUES
            interaction.followUp(`interaction.options.getUser('user') = ${interaction.options.getUser('user')}\ninteraction.options.getString('reason') = ${interaction.options.getString('reason')}}`)
        }
    }
}