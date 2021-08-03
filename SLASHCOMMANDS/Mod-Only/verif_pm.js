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
    permissions: 'MANAGE_MESSAGES',
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        await interaction.defer()

        // IF NOT USED IN VERIFICATION CHANNEL
        if(!interaction.channel.name.startsWith(`verify-`)) {
            // DEFINING EMBED
            let wrongChannelEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Error!`)
                .setDescription(`This command can only be used in a verification ticket channel.`)
                .setTimestamp()
            
            // SENDING MESSAGE
            return interaction.reply({ embeds: [wrongChannelEmbed], ephemeral: true })
        }

        

        // GRABBING SLASH COMMAND INPUT VALUES
        const message = inputs[0];

        // GRABBING MESSAGE CONTENT AND FORMATTING FOR EMBED
        let modAdminMsgEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic:true }))
            .setDescription(message)
            .setTimestamp()
            .setFooter(`This is a Mods/Admins message and is not sent to the user.`)

        await interaction.editReply({ embeds: [modAdminMsgEmbed] })
    }
}