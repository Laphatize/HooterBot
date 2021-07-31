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
            .setTitle(`Admin Commands:`)
            .setDescription(`These are the unique commands you can use as administrator:`)
            .addField(`addbirthday`, `*A command for admins to migrate MEE6's birthdays over to HooterBot.*\nUsage: \`\`<User_ID> ## / ##  [month / day]\`\`\nCooldown: 10s`, true)
            .addField(`partnermessage`, `*Generate an embed in \#server-announcements to promote messages from partner servers.*\nUsage: \`\`<partner name> | <message> | <(optional) direct image URL>\`\`\nCooldown: none`, true)
            .addField(`rules`, `*Generates/updates rules, server staff, andModMail ticket instruction embeds.*\nCooldown: 10s`, true)


            
        return message.reply({ embeds: [helpEmbed], ephemeral: true })


        
    }
}