const discord = require('discord.js')
const config = require ('../../config.json')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('verif')
        .setDescription('Commands regarding server verification.')
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName('blacklist')
        //         .setDescription('ADMIN | Blacklist a user from the verification system.')
        //         .addUserOption(option => 
        //             option.setName('user')
        //                 .setDescription('The user to blacklist.')
        //                 .setRequired(true))
        //         .addStringOption(option =>
        //             option.setName('reason')
        //                 .setDescription('The reason for blacklisting the user.')
        //                 .setRequired(true))
        // ),
    ,async execute(client, interaction) {
        await interaction.reply({ content: `Testing????`})
    },
}