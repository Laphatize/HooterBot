const discord = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'permissions_check',
    description: `ADMIN | Checks HooterBot's general permissions or for a specified channel.`,
    options: [
        {
            name: `channel`,
            description: `Name of the channel to check HooterBot's permissions`,
            type: `CHANNEL`,
            required: false
        }
    ],
    permissions: 'MANAGE_MESSAGES', //ADMINISTRATOR
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        if(!inputs[0]) {
            // HOOTERBOT'S GENERAL PERMISSIONS
            let permissionsArray = interaction.guild.me.permissions.toArray()
            let permsHave = [];

            for (const permission of permissionsArray) {
                permsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
            }


            let logPerms = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`${config.botName}'s General Discord Permisisons:`)
                .setDescription(`**PERMISSIONS**\n${permsHave.join(`\n`)}`)
                .addField(`INTENTS:`, `${config.emjGREENTICK} \`\`GUILDS\`\`\n${config.emjGREENTICK} \`\`GUILD_MEMBERS\`\`\n${config.emjGREENTICK} \`\`GUILD_MESSAGES\`\`\n${config.emjGREENTICK} \`\`DIRECT_MESSAGES\`\``, true)
                .addField(`PARTIALS:`, `${config.emjGREENTICK} \`\`CHANNEL\`\`\n${config.emjGREENTICK} \`\`MESSAGE\`\``, true)
                .setTimestamp()

            return interaction.reply({ embeds: [logPerms] })
        }

        if(inputs[0]) {

            // // HOOTERBOT'S PERMISSIONS IN THE SPECIFIED CHANNEL
            // let permissionsArray = inputs[0].me.permissions.toArray()
            // let permsHave = [];

            // for (const permission of permissionsArray) {
            //     permsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
            // }


            let logPerms = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`${config.botName}'s Permisisons in #${inputs[0].name}:`)
                // .setDescription(`**PERMISSIONS**\n${permsHave.join(`\n`)}`)
                .setTimestamp()

            return interaction.reply({ embeds: [logPerms] })
        }
    }
}