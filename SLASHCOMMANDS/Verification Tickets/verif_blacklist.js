const discord = require('discord.js')
const config = require ('../../config.json')
const ticketBlacklistSchema = require('../../Database/ticketBlacklistSchema');

module.exports = {
    name: 'verif_blacklist',
    description: `(ADMIN) Blacklist a user from the verification system.`,
    options: [
        {
            name: `user`,
            description: `User to blacklist.`,
            type: `USER`,
            required: true
        },{
            name: `reason`,
            description: `Reason for blacklist.`,
            type: `STRING`,
            required: true
        },
    ],
    permissions: 'ADMINISTRATOR',
    cooldown: 15,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const userId = inputs[0];
        const blacklistReason = inputs[1];


        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await ticketBlacklistSchema.findOne({
            USER_ID: userId
        }).exec();


        // IF ENTRY ALREADY EXISTS
        if(dbData) {

            // DEFINING EMBED
            let alreadyBlacklistedEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Error!`)
                .setDescription(`<@${userId}> is already on the blacklist.`)
                .setTimestamp()
            
            // SENDING MESSAGE
            return interaction.reply({ embeds: [alreadyBlacklistedEmbed], ephemeral: true })
        }


        // STORING IN DATABASE THE USER ID
        await ticketBlacklistSchema.findOneAndUpdate({
            USER_ID: userId
        },{
            USER_ID: userId
        },{
            upsert: true
        }).exec();


        // CONFIRMATION EMBED
        let confirmationEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`User Successfully Blacklisted`)
            .setDescription(`<@${userId}> (ID: ${userId}) is now blacklisted from the verification system.\nIf this is not the user you intended, please inform <@${config.botAuthorId}> immediately.`)

        // SENDING CONFIRMATION
        interaction.reply({ embeds: [confirmationEmbed], ephemeral: true })


        // LOG EMBED
        let blacklistLogEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`User Blacklisted`)
            .setDescription(`This user is now prevented from opening or using the verification system:`)
            .addField(`User:`, `<@${userId}>`, true)
            .addField(`User ID:`, `${userId}`, true)
            .addField(`\u200b`, `\u200b`)
            .addField(`Mod/Admin Responsible:`, `${interaction.user}`, true)
            .addField(`Reason:`, `${blacklistReason}`, true)
            .setTimestamp()
    
        // LOG ENTRY
        interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [blacklistLogEmbed] })
    }
}