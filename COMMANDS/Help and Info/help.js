const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
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
            .setDescription(`Instead of showing a list of available commands, ${config.botName}'s commands can all be found as slash commands! Type \`\`/\`\` in chat and Discord will generate the list of Slash Commands you can use for HooterBot!
            \nFor information on Slash Commands and what they are, check out [this Discord Blog post](https://blog.discord.com/slash-commands-are-here-8db0a385d9e6).`)

        return message.reply({ embeds: [helpEmbed], ephemeral: true })
    }
}