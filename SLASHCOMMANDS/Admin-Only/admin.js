const discord = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'admin',
    description: `A series of administrator commands.`,
    options: [],
    permissions: 'ADMINISTRATOR',
    cooldown: 10,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        let partnerEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`**Admin Commands:**`)
            .addField(`\`\`/partner_message\`\``, `Generate an embed in \#server-announcements to promote messages from partner servers.`)
            .addField(`\`\`/rules\`\``, `Generates/updates rules, server staff, andModMail ticket instruction embeds.`)
            .addField(`\`\`/user_birthday\`\``, `A command for admins to migrate MEE6's birthdays over to HooterBot.`)
            
        interaction.reply({embeds: [msgSendSuccessEmbed], ephemeral: true})
    }
}