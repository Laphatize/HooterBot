const discord = require('discord.js')
const config = require ('../../config.json')
const ticketBlacklistSchema = require('../../Database/ticketBlacklistSchema');


module.exports = {
    name: 'verif',
    description: 'Commands regarding server verification',
    options: [
        {
            // BLACKLIST
            name: `blacklist`,
            description: `ADMIN | Blacklist a user from the verification system.`,
            type: 'SUB_COMMAND',
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
                }
            ]    
        },{
            // MAINTENANCE
            name: `maintenance`,
            description: `ADMIN | Import MEE6 Leaderboard values for up to 10 users at a time.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `status`,
                    description: `ON / OFF`,
                    type: `STRING`,
                    required: true,
                    choices: [
                        {
                            name: `ON`,
                            value: `ON`,
                        },{
                            name: `OFF`,
                            value: `OFF`,
                        }
                    ]
                }
            ]
        },{
            // PERKS EMBED
            name: `perks`,
            description: `ADMIN | Generate/update the verification perks embed message.`,
            type: 'SUB_COMMAND',
            options: [],
        },{
            // VERIFICATION CHANNEL PM
            name: `pm`,
            description: `MODERATOR | Send a message in a ticket channel without it being sent to the user.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `message`,
                    description: `Your message for the channel.`,
                    type: `STRING`,
                    required: true,
                },
            ],
        },{
            // PROMPT EMBED
            name: `prompt`,
            description: `ADMIN | Generate/update the verification prompt containing the buttons.`,
            type: 'SUB_COMMAND',
            options: [],
        },
    ],
    permissions: 'MANAGE_MESSAGES',
    dmUse: false,
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRAB SUBCOMMAND
        let subCmdName = interaction.options.getSubcommand()

        interaction.reply(`You chose the ${subCmdName} subcommand.`)


        // BLACKLIST
        if(subCmdName == 'blacklist') {
            // GETTING OPTIONS VALUES
            let blacklistUser = interaction.options.getUser('user');
            let blacklistReason = interaction.options.getString('reason');

            // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
            const dbBlacklistData = await ticketBlacklistSchema.findOne({
                USER_ID: blacklistUser.id
            }).exec();

            // IF ENTRY ALREADY EXISTS
            if(dbBlacklistData) {

                // DEFINING EMBED
                let alreadyBlacklistedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error!`)
                    .setDescription(`${blacklistUser} is already on the blacklist.`)
                    .setTimestamp()
                
                // SENDING MESSAGE
                return interaction.reply({ embeds: [alreadyBlacklistedEmbed], ephemeral: true })
            }

            // STORING IN DATABASE THE USER ID
            await ticketBlacklistSchema.findOneAndUpdate({
                USER_ID: blacklistUser.id
            },{
                USER_ID: blacklistUser.id
            },{
                upsert: true
            }).exec();


            // CONFIRMATION EMBED
            let confirmationEmbed = new discord.MessageEmbed()
                .setColor(config.embedDarkGrey)
                .setTitle(`User Successfully Blacklisted`)
                .setDescription(`${blacklistUser} (ID: ${blacklistUser.id}) is now blacklisted from the verification system.\nIf this is not the user you intended, please inform <@${config.botAuthorId}> ***immediately*** and provide the user ID listed in this message.`)

            // SENDING CONFIRMATION
            interaction.reply({ embeds: [confirmationEmbed], ephemeral: true })


            // LOG EMBED
            let blacklistLogEmbed = new discord.MessageEmbed()
                .setColor(config.embedDarkGrey)
                .setTitle(`User Blacklisted`)
                .setDescription(`This user is now prevented from opening or using the verification system:`)
                .addField(`User:`, `${blacklistUser}`, true)
                .addField(`User ID:`, `${blacklistUser.id}`, true)
                .addField(`\u200b`, `\u200b`, true)
                .addField(`Mod/Admin Responsible:`, `${interaction.user}`, true)
                .addField(`Reason:`, `${blacklistReason}`, true)
                .setTimestamp()

            // LOG ENTRY
            interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [blacklistLogEmbed] })
        }


        // MAINTENANCE
        if(subCmdName == 'maintenance') {
            // GETTING OPTIONS VALUES
            let maintenanceSetting = interaction.options.getString('status');



        }


        // PERKS EMBED
        if(subCmdName == 'perks') {
            
            
        }


        // PROMPT EMBED
        if(subCmdName == 'pm') {
            // GETTING OPTIONS VALUES
            let pmMessage = interaction.options.getString('message');



        }


        // PROMPT EMBED
        if(subCmdName == 'prompt') {
            

        }

    }
}