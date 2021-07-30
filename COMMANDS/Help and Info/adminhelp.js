const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require(`fs`)
const config = require ('../../config.json')

module.exports = {
    name: `adminhelp`,
    aliases: [`admincommands`],
    description: `Describes ${config.botName}'s commands for administrators. (🗺️📌 *You are here*)`,
    category: `Help and Info`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        let helpEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`**Admin Help:**`)
            .setDescription(`Select a button below for information on commands in that category.`)
            .setFooter(`These buttons will not work right now.`)

        let AdminOnlyButton = new MessageButton()
            .setLabel("Admin")
            .setStyle(`SECONDARY`)
            .setCustomId("help_admin")
        let VerificationButton = new MessageButton()
            .setLabel("Verification")
            .setStyle(`SECONDARY`)
            .setCustomId("help_verification")
        

        // BUTTON ROWS BASED ON ADMIN OR NOT
        
        let mainHelpRow = new MessageActionRow()
            .addComponents(
                AdminOnlyButton,
                VerificationButton,
            );

        return message.reply({ embeds: [helpEmbed], components: [mainHelpRow] })
    }
}