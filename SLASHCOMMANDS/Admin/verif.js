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
                },{
                    name: `ping`,
                    description: `Ping the admins and mods on this message?`,
                    type: `STRING`,
                    required: false,
                    choices: [
                        {
                            name: `ADMINS`,
                            value: `ADMINS`,
                        },{
                            name: `ADMINS & MODS`,
                            value: `ADMINS_MODS`,
                        }
                    ]
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
    defaultPermission: false,
    run: async(client, interaction, inputs) => {

        // console.log(`verif command ID: ${interaction.commandId}`)

        
        // GRAB SUBCOMMAND
        let subCmdName = interaction.options.getSubcommand()


        /*******************/
        /* BLACKLIST       */
        /*******************/
        if(subCmdName == 'blacklist') {

            // CHECKING IF USER IS AN ADMIN
            if(!interaction.member.permissions.has('ADMINISTRATOR')) {
                // DEFINING EMBED
                let notAdminEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error!`)
                    .setDescription(`Sorry, like the command description says, you must be an **Administrator** to blacklist a user.`)
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

            // CHECKING IF USER IS AN ADMIN
            if(!interaction.member.permissions.has('ADMINISTRATOR')) {
                // DEFINING EMBED
                let notAdminEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error!`)
                    .setDescription(`Sorry, like the command description says, you must be an **Administrator** to toggle maintenance mode.`)
                    .setTimestamp()
                
                // SENDING MESSAGE
                return interaction.reply({ embeds: [notAdminEmbed], ephemeral: true })
            }
            

            // GETTING OPTIONS VALUES
            let maintenanceSetting = interaction.options.getString('status');

                
            // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
            const dbGuildData = await guildSchema.findOne({
                GUILD_ID: interaction.guild.id
            }).exec();


            // IF NO VERIFICATION PROMPT, SEND MESSAGE IN CHANNEL
            if(!dbGuildData.VERIF_PROMPT_MSG_ID) {
                let noCatEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!** Missing Verification Prompt`)
                    .setDescription(`You first need to create a verification prompt in the server using \`\`/verif prompt\`\` in **#roles** before the verification prompt can be toggled in and out of maintenance mode.`)

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
                await interaction.guild.channels.cache.find(ch => ch.name === `roles`).messages.fetch(dbGuildData.VERIF_PROMPT_MSG_ID)
                    .then(msg => {
                        msg.edit({ embeds: [ticketMaintenanceEmbed], components: [buttonRow] })
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
                await interaction.guild.channels.cache.find(ch => ch.name === `roles`).messages.fetch(dbGuildData.VERIF_PROMPT_MSG_ID)
                    .then(msg => {
                        msg.edit({ embeds: [ticketEmbed], components: [buttonRow] })
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

            // CHECKING IF USER IS AN ADMIN
            if(!interaction.member.permissions.has('ADMINISTRATOR')) {
                // DEFINING EMBED
                let notAdminEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error!`)
                    .setDescription(`Sorry, like the command description says, you must be an **Administrator** to generate/update the perks embed.`)
                    .setTimestamp()
                
                // SENDING MESSAGE
                return interaction.reply({ embeds: [notAdminEmbed], ephemeral: true })
            }
            

            // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
            const dbGuildData = await guildSchema.findOne({
                GUILD_ID: interaction.guild.id
            }).exec();


            // EMBED MESSAGE
            let verifPerksEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`**Why Verify?**`)
                .setDescription(`Students, alumni, and employee of Temple University gain access to additional channels and permissions in the server:`)
                .addField(`Image posting and GIF embed:`, "*Server-wide* - non-verified users can only post/embed in:\n• <#829409161581821999>\n• <#831152843166580777>\n• <#832649518079672340>")
                .addField(`Channel access:`, `• <#829445602868854804> - find roommates for the upcoming term\n• <#831527136438255626> - connect with each other on social media\n• <#832976391985168445> - discuss scheduling and classes\n• <#829629393629872159> - talk about IRL events happening on/near campus`)
                .addField(`Posting abilities:`, `• <#829732282079903775>`)
                .addField(`Voice chat features:`, `• Screen sharing`)
            

            // MESSAGE ID DNE IN DATABASE, POST AND LOG MSG INFO IN DB
            if(!dbGuildData.VERIF_PERKS_MSG_ID) {

                // POSTING EMBED
                await interaction.channel.send({ embeds: [verifPerksEmbed] })
                    .catch(err => console.log(err))

                    // GETTING MESSAGE ID OF verifPerksEmbed
                    .then(sentEmbed => {
                        verifPerksEmbedMsgId = sentEmbed.id;
                    })


                // STORING IN DATABASE THE RULE EMBED'S MESSAGE ID AND CHANNEL ID
                await guildSchema.findOneAndUpdate({
                    // CONTENT USED TO FIND UNIQUE ENTRY
                    GUILD_NAME: interaction.guild.name,
                    GUILD_ID: interaction.guild.id
                },{
                    // CONTENT TO BE UPDATED
                    VERIF_PERKS_MSG_ID: verifPerksEmbedMsgId
                },{ 
                    upsert: true
                }).exec();


                // DEFINING UPDATE EMBED
                let verifPostingEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Verification perks embed successfully posted.`)


                // SENDING CONFIRMATION
                interaction.reply({ embeds: [verifPostingEmbed], ephemeral: true })


                // DEFINING LOG EMBED
                let logVerifPerksPromptEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} New verified perks embed posted.`)
                    .setDescription(`The message ID has been saved to the database.\n**User:** ${interaction.user}`)
                    .setTimestamp()


                // LOG ENTRY
                return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logVerifPerksPromptEmbed] })
            }


            // MESSAGE ID EXISTS IN DATABASE, EDIT EMBED WITHOUT TOUCHING MESSAGE ID
            if(dbGuildData.VERIF_PERKS_MSG_ID) {

                // GETTING THE VERIFICATION PERKS CHANNEL ID FROM DATABASE
                await interaction.guild.channels.cache.find(ch => ch.name === `roles`).messages.fetch(dbGuildData.VERIF_PERKS_MSG_ID)
                    .then(msg => {
                        msg.edit({ embeds: [verifPerksEmbed] })
                    })
                    .catch(err => console.log(err))


                // DEFINING UPDATE EMBED
                let verifPostingEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Verification perks embed successfully edited.`)


                // SENDING CONFIRMATION
                interaction.reply({ embeds: [verifPostingEmbed], ephemeral: true })



                // DEFINING LOG EMBED
                let logPerksEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Verified perks embed updated.`)
                    .setDescription(`\n**User:** ${interaction.user}`)
                    .setTimestamp()


                // LOG ENTRY
                return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logPerksEmbed] })
            }
        }


        /*******************/
        /*  PM MESSAGE     */
        /*******************/
        if(subCmdName == 'pm') {

            // GETTING OPTIONS VALUES
            let pmMessage = interaction.options.getString('message');
            let pmgPing = interaction.options.getString('ping');


            // IF THE VERIF CHANNEL IS CLOSED OR ARCHIVED
            if(interaction.channel.name.toLowerCase().startsWith(`closed-`) || interaction.channel.name.toLowerCase().startsWith(`archived-`)) {
                // DEFINING EMBED
                let normalMessages = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjORANGETICK} Command not needed!`)
                    .setDescription(`This ticket is complete - you can send messages in here normally.\n\nHere's the message you sent so you can copy/paste it in the chat:\n\`\`\`${pmMessage}\`\`\``)
                    .setTimestamp()
                
                // SENDING MESSAGE
                return interaction.reply({ embeds: [normalMessages], ephemeral: true })
            }


            // IF NOT USED IN VERIFICATION CHANNEL
            if(interaction.channel.name.toLowerCase().startsWith(`verify-`)) {

                // GRABBING MESSAGE CONTENT AND FORMATTING FOR EMBED
                let modAdminMsgEmbed = new discord.MessageEmbed()
                    .setColor(config.embedBlurple)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic:true }))
                    .setDescription(pmMessage)
                    .setTimestamp()
                    .setFooter(`This message can only be seen by mods/admins.`)


                // PING ADMINS ONLY
                if(pmgPing == 'ADMINS') {

                    // FETCH ADMIN ROLE
                    let adminRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() == 'admin');
                    
                    // SENDING MESSAGE
                    return interaction.reply({ embeds: [modAdminMsgEmbed], content: `${adminRole}s!` })
                }
                // PING ADMINS AND MODS
                if(pmgPing == 'ADMINS_MODS') {

                    // FETCH ADMIN & MOD ROLES
                    let modRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() == 'moderator');
                    let adminRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() == 'admin');
                    
                    // SENDING MESSAGE
                    return interaction.reply({ embeds: [modAdminMsgEmbed], content: `${adminRole}s & ${modRole}s!` })
                }
                else {
                    return interaction.reply({ embeds: [modAdminMsgEmbed] })
                }
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


        /*******************/
        /*  PROMPT EMBED   */
        /*******************/
        if(subCmdName == 'prompt') {

            // CHECKING IF USER IS AN ADMIN
            if(!interaction.member.permissions.has('ADMINISTRATOR')) {
                // DEFINING EMBED
                let notAdminEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error!`)
                    .setDescription(`Sorry, like the command description says, you must be an **Administrator** to generate/update the main embed.`)
                    .setTimestamp()
                
                // SENDING MESSAGE
                return interaction.reply({ embeds: [notAdminEmbed], ephemeral: true })
            }

            
            // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
            const dbGuildData = await guildSchema.findOne({
                GUILD_ID: interaction.guild.id
            }).exec();


            // IF NO TICKET CATEGORY, SEND MESSAGE IN CHANNEL
            if(!dbGuildData.TICKET_CAT_ID) {
                let noCatEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`You need to set the ticket category using \`\`/ticketcategory\`\` or \`\`/setcategory\`\` before the verification prompt can be posted.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [noCatEmbed], ephemeral: true })
            }

            // EMBED MESSAGE
            let verifEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`**Get verified!**`)
                .setDescription(`A ticket will open in your DMs when you click the button below to start the verification process. You'll need to allow DMs from members of the server to verify.`)
                .setFooter(`For information about what data the bot collects to function, please click the "Data & Privacy Info" button.`)


            // BUTTON ROW
            const buttonRow = new MessageActionRow()
                .addComponents(
                    // BEGIN BUTTON
                    new MessageButton()
                        .setLabel("Begin Verification")
                        .setStyle("SUCCESS")
                        .setCustomId("begin_verification_button"),
                    // DATA & PRIVACY BUTTON
                    new MessageButton()
                        .setLabel(`Data & Privacy Info`)
                        .setStyle("PRIMARY")
                        .setCustomId(`dataPrivacy_Roles`)
                );


            // MESSAGE ID DNE IN DATABASE, POST AND LOG MSG INFO IN DB
            if(!dbGuildData.VERIF_PROMPT_MSG_ID) {

                // POSTING EMBED
                await interaction.channel.send({ embeds: [verifEmbed], components: [buttonRow] })
                    .catch(err => console.log(err))

                    // GETTING MESSAGE ID OF verifEmbed
                    .then(sentEmbed => {
                        verifEmbedMsgId = sentEmbed.id;
                    })


                // STORING IN DATABASE THE VERIFICATION EMBED'S MESSAGE ID AND CHANNEL ID
                await guildSchema.findOneAndUpdate({
                    // CONTENT USED TO FIND UNIQUE ENTRY
                    GUILD_NAME: interaction.guild.name,
                    GUILD_ID: interaction.guild.id
                },{
                    // CONTENT TO BE UPDATED
                    VERIF_PROMPT_MSG_ID: verifEmbedMsgId
                },{ 
                    upsert: true
                }).exec();


                // DEFINING UPDATE EMBED
                let verifPostingEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Verification embed successfully posted.`)


                // SENDING CONFIRMATION
                interaction.reply({ embeds: [verifPostingEmbed], ephemeral: true })


                // DEFINING LOG EMBED
                let logVerifPromptEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} New verification prompt posted.`)
                    .setDescription(`The message ID has been saved to the database.\n**User:** ${interaction.user}`)
                    .setTimestamp()


                // LOG ENTRY
                return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logVerifPromptEmbed] })
            }

            // MESSAGE ID EXISTS IN DATABASE, EDIT EMBED WITHOUT TOUCHING MESSAGE ID
            if(dbGuildData.VERIF_PROMPT_MSG_ID) {

                // GETTING THE VERIFICATION PROMPT CHANNEL ID FROM DATABASE
                await interaction.channel.messages.fetch(dbGuildData.VERIF_PROMPT_MSG_ID)
                    .then(msg => {
                        msg.edit({ embeds: [verifEmbed], components: [buttonRow] })
                    })
                    .catch(err => console.log(err))


                // DEFINING UPDATE EMBED
                let verifPostingEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Verification embed successfully edited.`)


                // SENDING CONFIRMATION
                interaction.reply({ embeds: [verifPostingEmbed], ephemeral: true })


                // DEFINING LOG EMBED
                let logVerifPromptEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Verified prompt embed updated.`)
                    .setDescription(`**User:** ${interaction.user}`)
                    .setTimestamp()


                // LOG ENTRY
                return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logVerifPromptEmbed] })
            }
        }
    }
}