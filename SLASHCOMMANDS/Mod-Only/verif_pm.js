const discord = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: 'verif_pm',
    description: `(MODERATOR) Send a message in a ticket channel without it being sent to the user.`,
    options: [
        {
            name: `message`,
            description: `Your message for the channel.`,
            type: `STRING`,
            required: true,
        },
    ],
    permissions: 'MANAGE_MESSAGES', //ADMINISTRATOR
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const message = inputs[0];

        // GRABBING MESSAGE CONTENT AND FORMATTING FOR EMBED
        let modAdminMsgEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic:true }))
            .setTitle(`For Mods/Admins only:`)
            .setDescription(message)
            .setTimestamp()


        interaction.return({ embeds: [modAdminMsgEmbed] })
    }
}