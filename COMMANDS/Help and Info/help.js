const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require(`fs`)
const config = require ('../../config.json')

module.exports = {
    name: `help`,
    aliases: [`commands`],
    description: `Describes ${config.botName}'s commands. (🗺️📌 *You are here*)`,
    category: `Help and Info`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        let helpEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`**Help:**`)
            .setDescription(`Select a button below for information on commands in that category.`)

        let FunButton = new MessageButton()
            .setLabel("Fun")
            .setStyle(`SECONDARY`)
            .setCustomId("help_fun")
        let HelpInfoButton = new MessageButton()
            .setLabel("Help & Info")
            .setStyle(`SECONDARY`)
            .setCustomId("help_helpinfo")
        let MiscButton = new MessageButton()
            .setLabel("Miscellaneous")
            .setStyle(`SECONDARY`)
            .setCustomId("help_Misc")


        // BUTTON ROWS BASED ON ADMIN OR NOT
        
        let mainHelpRow = new MessageActionRow()
            .addComponents(
                FunButton,
                HelpInfoButton,
                MiscButton,
            );

        return message.reply({ embeds: [helpEmbed], components: [mainHelpRow] })
    }
}