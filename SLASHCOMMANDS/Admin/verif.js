const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require ('../../config.json')
const ticketBlacklistSchema = require('../../Database/ticketBlacklistSchema');
const guildSchema = require('../../Database/guildSchema');


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

        console.log(`verif command ID: ${interaction.commandId}`)

        // GRAB SUBCOMMAND
        let subCmdName = interaction.options.getSubcommand()

        /*******************/
        /* BLACKLIST       */
        /*******************/
        if(subCmdName == 'blacklist') {

            console.log(`verif blacklist command ID: ${interaction.commandId}`)

            // CHECKING IF USER IS AN ADMIN
            if(!interaction.user.permissions.has('ADMINISTRATOR')) {
                // DEFINING EMBED
                let notAdminEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error!`)
                    .setDescription(`Sorry, you must be an Administrator to blacklist a user.`)
                    .setTimestamp()
                
                // SENDING MESSAGE
                return interaction.reply({ embeds: [notAdminEmbed], ephemeral: true })
            }


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
                .setTitle(`User Successfully Blacklisted From Verification System`)
                .setDescription(`${blacklistUser} (ID: ${blacklistUser.id}) is now blacklisted.\n\nIf this is not the user you intended, please inform <@${config.botAuthorId}> ***immediately*** and provide the user ID listed in this message.`)

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
                .addField(`Admin Responsible:`, `${interaction.user}`, true)
                .addField(`Reason:`, `${blacklistReason}`, true)
                .setTimestamp()

            // LOG ENTRY
            interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [blacklistLogEmbed] })
        }


        /*******************/
        /*  MAINTENANCE    */
        /*******************/
        if(subCmdName == 'maintenance') {

            console.log(`verif maintenance command ID: ${interaction.commandId}`)

            // GETTING OPTIONS VALUES
            let maintenanceSetting = interaction.options.getString('status');3

                
            // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
            const dbGuildData = await guildSchema.findOne({
                GUILD_ID: interaction.guild.id
            }).exec();


            // IF NO VERIFICATION PROMPT, SEND MESSAGE IN CHANNEL
            if(!dbGuildData.VERIF_PROMPT_MSG_ID) {
                let noCatEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!** Missing Verification Prompt`)
                    .setDescription(`You first need to create a verification prompt in the server using \`\`/verif_promptembed\`\` in **#roles** before the verification prompt can be toggled in and out of maintenance mode.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [noCatEmbed], ephemeral: true })
            }

                // MAINTENANCE MODE "ON"
            if(maintenanceSetting == "ON") {

                // MAINTENANCE EMBED MESSAGE
                let ticketMaintenanceEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`**Get verified!**`)
                    .setDescription(`A ticket will open in your DMs when you click the button below to start the verification process. You'll need to allow DMs from members of the server to verify.
                    \n\n**Verification is currently OFFLINE for maintenance. Please check back again soon to open a verification ticket.**`)


                // INITIALIZING MAINTENANCE BUTTON - DISABLED AND COLOR CHANGE
                let VerifButtonMaintenance = new MessageButton()
                    .setLabel(`Begin Verification`)
                    .setStyle(`SECONDARY`)
                    .setCustomId(`begin_verification_button_disabld`)
                    .setDisabled(true)
                let DataPrivacyButton = new MessageButton()
                    .setLabel(`Data & Privacy Info`)
                    .setStyle("PRIMARY")
                    .setCustomId(`dataPrivacy_Roles`)
                    .setDisabled(false)


                // BUTTON ROW
                let buttonRow = new MessageActionRow()
                    .addComponents(
                        VerifButtonMaintenance,
                        DataPrivacyButton
                    );


                // POSTING MAINTENANCE EMBED MESSAGE AND BUTTON
                await interaction.channel.messages.fetch(dbGuildData.VERIF_PROMPT_MSG_ID)
                    .then(msg => {
                        msg.edit({embeds: [ticketMaintenanceEmbed], components: [buttonRow]})
                    })
                    .catch(err => console.log(err))
                

                // DEFINING LOG EMBED
                let logTicketCatUpdateEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`Verification Embed Update`)
                    .setDescription(`**Maintenance mode:** \`\` ON \`\`\n**Ticket status:** Tickets **cannot** be created until maintenance mode is turned off.\n**Changed by:** ${interaction.user}`)
                    .setTimestamp()
                    
                // LOG ENTRY
                interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logTicketCatUpdateEmbed]})
                    .catch(err => console.log(err))


                // DEFINING UPDATE EMBED
                let maintenanceUpdateEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Maintenance mode = \`\` ON \`\`.`)

                // SENDING CONFIRMATION
                interaction.reply({ embeds: [maintenanceUpdateEmbed], ephemeral: true })   
            }


            // MAINTENANCE MODE "OFF"
            if(maintenanceSetting == "OFF") {

                let ticketEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`**Get verified!**`)
                    .setDescription(`A ticket will open in your DMs when you click the button below to start the verification process. You'll need to allow DMs from members of the server to verify.`)
                    .setFooter(`For information about what data the bot collects to function, please click the "Data & Privacy Info" button.`)


                // INITIALIZING MAINTENANCE BUTTON - ENABLED
                let VerifButton = new MessageButton()
                    .setLabel(`Begin Verification`)
                    .setStyle(`SUCCESS`)
                    .setCustomId(`begin_verification_button`)
                let DataPrivacyButton = new MessageButton()
                    .setLabel(`Data & Privacy Info`)
                    .setStyle("PRIMARY")
                    .setCustomId(`dataPrivacy_Roles`)


                // BUTTON ROW
                let buttonRow = new MessageActionRow()
                    .addComponents(
                        VerifButton,
                        DataPrivacyButton
                    );


                // POSTING MAINTENANCE EMBED MESSAGE AND BUTTON
                await interaction.channel.messages.fetch(dbGuildData.VERIF_PROMPT_MSG_ID)
                    .then(msg => {
                        msg.edit({embeds: [ticketEmbed], components: [buttonRow]})
                    })
                    .catch(err => console.log(err))


                // DEFINING LOG EMBED
                let logMaintenanceEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`Verification Embed Update`)
                    .setDescription(`**Maintenance mode:** \`\` OFF \`\`\n**Ticket status:** Tickets **can** be be created using the embed in **#roles**.\n**Changed by:** ${interaction.user}`)
                    .setTimestamp()
                
                // LOG ENTRY
                interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logMaintenanceEmbed] })


                // DEFINING UPDATE EMBED
                let maintenanceUpdateEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Maintenance mode = \`\` OFF \`\`.`)

                // SENDING CONFIRMATION
                interaction.reply({ embeds: [maintenanceUpdateEmbed], ephemeral: true })   
            }
        }


        /*******************/
        /*  PERKS EMBED    */
        /*******************/
        if(subCmdName == 'perks') {

            console.log(`verif perks ID: ${interaction.commandId}`)
            
            
        }


        /*******************/
        /*  PM MESSAGE     */
        /*******************/
        if(subCmdName == 'pm') {

            console.log(`verif pm ID: ${interaction.commandId}`)

            // GETTING OPTIONS VALUES
            let pmMessage = interaction.options.getString('message');



        }


        /*******************/
        /*  PROMPT EMBED   */
        /*******************/
        if(subCmdName == 'prompt') {

            console.log(`verif pm ID: ${interaction.commandId}`)
            

        }

    }
}