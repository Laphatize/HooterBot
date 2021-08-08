const discord = require('discord.js')
const config = require ('../../config.json')

// COMMAND ID: 872184009780781128

module.exports = {
    name: 'verif_pm',
    description: `MODERATOR | Send a message in a ticket channel without it being sent to the user.`,
    options: [
        {
            name: `message`,
            description: `Your message for the channel.`,
            type: `STRING`,
            required: true,
        },
    ],
    permissions: 'MANAGE_MESSAGES',
    dmUse: false,
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const message = inputs[0];
        
        // IF THE VERIF CHANNEL IS CLOSED OR ARCHIVED
        if(interaction.channel.name.toLowerCase().startsWith(`closed-`) || interaction.channel.name.toLowerCase().startsWith(`archived-`)) {
            // DEFINING EMBED
            let normalMessages = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Error!`)
                .setDescription(`This ticket is completed and you can send messages in here normally.\n\nHere's the message you sent so you can copy/paste it in the chat:\n\`\`\`${message}\`\`\``)
                .setTimestamp()
            
            // SENDING MESSAGE
            return interaction.reply({ embeds: [normalMessages], ephemeral: true })
        }


        // IF NOT USED IN VERIFICATION CHANNEL
        if(interaction.channel.name.toLowerCase().startsWith(`verify-`)) {

            await interaction.defer()

            // GRABBING MESSAGE CONTENT AND FORMATTING FOR EMBED
            let modAdminMsgEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic:true }))
                .setDescription(message)
                .setTimestamp()
                .setFooter(`This is a Mods/Admins message and is not sent to the user.`)

            await interaction.editReply({ embeds: [modAdminMsgEmbed] })
        }


        else {
            // DEFINING EMBED
            let wrongChannelEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Error!`)
                .setDescription(`This command can only be used in a verification ticket channel.`)
                .setTimestamp()
            
            // SENDING MESSAGE
            return interaction.reply({ embeds: [wrongChannelEmbed], ephemeral: true })
        }
    }
}