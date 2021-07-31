const discord = require('discord.js')
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
            .setTitle(`Moderator Commands:`)
            .setDescription(`These are the unique commands you can use as moderator:`)
            .addField(`ping`, `*A command to test if ${config.botName} is responding or suffering from latency issues.*\n${config.indent}Cooldown: \`\`10s\`\``)
            
        return message.reply({ embeds: [helpEmbed] })        
    }
}