const discord = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'permissions_check',
    description: `ADMIN | Checks HooterBot's general permissions or for a specified channel. [60s]`,
    options: [
        {
            name: `channel`,
            description: `Name of the channel to check HooterBot's permissions`,
            type: `CHANNEL`,
            required: false
        }
    ],
    permissions: 'MANAGE_MESSAGES', //ADMINISTRATOR
    cooldown: 60,
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
                .setTitle(`${config.botName}'s general permisisons:`)
                .setDescription(`**PERMISSIONS**\n${permsHave.join(`\n`)}`)
                .addField(`INTENTS:`, `${config.emjGREENTICK} \`\`GUILDS\`\`\n${config.emjGREENTICK} \`\`GUILD_MEMBERS\`\`\n${config.emjGREENTICK} \`\`GUILD_MESSAGES\`\`\n${config.emjGREENTICK} \`\`DIRECT_MESSAGES\`\``, true)
                .addField(`PARTIALS:`, `${config.emjGREENTICK} \`\`CHANNEL\`\`\n${config.emjGREENTICK} \`\`MESSAGE\`\``, true)
                .setTimestamp()

            return interaction.reply({ embeds: [logPerms] })
        }

        if(inputs[0]) {

            console.log(`inputs[0] = ${inputs[0]}`)

            // HOOTERBOT'S GENERAL PERMISSIONS
            // let permissionsArray = interaction.guild.me.permissions.toArray()
            // let permsHave = [];

            // for (const permission of permissionsArray) {
            //     permsHave.push(`${config.emjGREENTICK} \`\`${permission}\`\``)
            // }


            let logPerms = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`${config.botName}'s permisisons in ${inputs[0]}:`)
                .setDescription(`**PERMISSIONS**`)
                .setTimestamp()

            return interaction.reply({ embeds: [logPerms] })
        }
    }
}