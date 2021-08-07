const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js')
const config = require ('../../config.json')
const guildSchema = require('../../Database/guildSchema');
const ticketBlacklistSchema = require('../../Database/ticketBlacklistSchema');


module.exports = {
    name: 'verification',
    description: `A collection of commands regarding verification.`,
    options: [
        {
        // VERIFICATION BLACKLIST
            name: "blacklist",
            description: "ADMIN | Blacklist a user from the verification system. [10s]",
            type: 'SUB_COMMAND',
            options: [
                {
                    name: "user",
                    description: "User to blacklist",
                    type: 'USER',
                    required: true,
                },{
                    name: "reason",
                    description: "Reason for blacklist.",
                    type: 'STRING',
                    required: true
                }
            ]
        },{
        // VERIFICATION CATEGORY
            name: "category",
            description: "ADMIN | Set ticket channel creation category. Cannot modify category once set. [10s]",
            type: 'SUB_COMMAND',
            options: [
                {
                    name: "category",
                    description: "The name of the category.",
                    type: 'CHANNEL',
                    required: true
                }
            ]
        },{
            name: "maintenance",
            description: "ADMIN | Toggle verification prompt to enter/exit maintenance mode. [10s]",
            type: 'SUB_COMMAND',
            options: [
                {
                    name: "status",
                    description: "ON / OFF",
                    type: 'STRING',
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
            name: "perksembed",
            description: "ADMIN | Generate/update the verification perks embed message. [60s]",
            type: 'SUB_COMMAND',
            options: []
        },{
            name: "promptembed",
            description: "ADMIN | Generate/update the verification prompt containing the buttons. [60s]",
            type: 'SUB_COMMAND',
            options: []
        }
    ],
    cooldown: 60,
    defaultPermission: false,
    run: async(client, interaction, inputs) => {

        subCmdName = interaction.options.getSubcommand()


        if(interaction.user.id == config.botAuthorId) {
            interaction.reply({ content: `**GuildApplicationCommandData**\n**Slash Command ID:** ${interaction.commandId}\n**SubCommand:** ${interaction.options.getSubcommand()}`})
        }



        // VERIFICATION BLACKLIST
        if(subCmdName == 'blacklist') {
            console.log(`Running the "verification blacklist" command`)
        }


        // VERIFICATION CATEGORY
        if(subCmdName == 'category') {
            console.log(`Running the "verification blacklist" command`)
        }

        // VERIFICATION MAINTENANCE
        if(subCmdName == 'maintenance') {
            console.log(`Running the "verification blacklist" command`)
        }

        // VERIFICATION CATEGORY
        if(subCmdName == 'perksembed') {
            console.log(`Running the "verification blacklist" command`)
        }

        // VERIFICATION CATEGORY
        if(subCmdName == 'promptembed') {
            console.log(`Running the "verification blacklist" command`)
        }
    }
}