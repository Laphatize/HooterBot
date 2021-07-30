const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require(`fs`)
const config = require ('../../config.json')

module.exports = {
    name: `modhelp`,
    aliases: [`modcommands`],
    description: `Describes ${config.botName}'s commands for moderators. (🗺️📌 *You are here*)`,
    category: `Help and Info`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    permissions: 'MANAGE_CHANNELS',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        let helpEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`**Moderator Help:**`)
            .setDescription(`Select a button below for information on commands in that category.`)
            .setFooter(`These buttons will not work right now.`)

        let ModOnlyButton = new MessageButton()
            .setLabel("Moderator")
            .setStyle(`SECONDARY`)
            .setCustomId("help_admin")
        

        // BUTTON ROWS BASED ON ADMIN OR NOT
        
        let mainHelpRow = new MessageActionRow()
            .addComponents(
                ModOnlyButton,
            );

        return message.reply({ embeds: [helpEmbed], components: [mainHelpRow] })
    }
}