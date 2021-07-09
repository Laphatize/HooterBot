const discord = require('discord.js')
const loadCommands = require('../../LoadCommands')
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
    guildUse: true,
    dmUse: true,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        let helptext = `Here is a list of my commands you can use:\n\n`;

        
        // CREATING EMBED FOR RESPONSE        
        let helpEmbed = new discord.MessageEmbed()
        .setColor(config.embedBlurple)
        .setTitle(`**Help:**`)
        .setDescription(`${helptext}`)
        .setFooter(`(Crown = Need administrator permissions.)`)
        
        // RESPONDING TO USER WITH COMMAND LIST
        message.channel.send({ embeds: [helpEmbed] })
    }
}