const discord = require('discord.js')
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
            .setTitle(`Admin Commands:`)
            .setDescription(`These are the unique commands you can use as administrator:`)
            .addField(`addbirthday`, `*A command for admins to migrate MEE6's birthdays over to HooterBot.*\n${config.indent}Usage: \`\`<User_ID> ## / ##  [month / day]\`\`\n${config.indent}Cooldown: \`\`10s\`\``)
            .addField(`partnermessage`, `*Generate an embed in \#server-announcements to promote messages from partner servers.*\n${config.indent}Usage: \`\`<partner name> | <message> | <(optional) direct image URL>\`\`\n${config.indent}Cooldown: \`\`none\`\``)
            .addField(`rules`, `*Generates/updates rules, server staff, and ModMail ticket instruction embeds.*\n${config.indent}Cooldown: \`\`10s\`\``)
            
        return message.reply({ embeds: [helpEmbed] })        
    }
}