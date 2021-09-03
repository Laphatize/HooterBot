const discord = require('discord.js')
const config = require ('../../config.json')


module.exports = {
    name: 'channel',
    description: 'Commands regarding channels',
    options: [
        {
            // LOCKDOWN
            name: `lockdown`,
            description: `MODERATOR | Lock a channel.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `status`,
                    description: `Turn the channel lockdown on or off.`,
                    type: `STRING`,
                    required: true,
                    choices: [
                        {
                            name: `LOCK`,
                            value: `lock`,
                        },{
                            name: `UNLOCK`,
                            value: `unlock`,
                        }
                    ]
                }
            ]
        },{
            // PURGE
            name: `purge`,
            description: `MODERATOR | Purge up to 99 messages from the channel from within the past 2 weeks.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `amount`,
                    description: `The number of messages to purge. (limit: 99)`,
                    type: `INTEGER`,
                    required: true,
                }
            ]
        },{
            // SLOWMODE
            name: `slowmode`,
            description: `MODERATOR | Toggle slowmode on a channel.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `value`,
                    description: `The amount of time for the slowmode.`,
                    type: `STRING`,
                    required: true,
                    choices: [
                        {
                            name: `OFF`,
                            value: `off`,
                        },{
                            name: `10s`,
                            value: `10s`,
                        },{
                            name: `30s`,
                            value: `30s`,
                        },{
                            name: `1min`,
                            value: `1min`,
                        }
                    ]
                }
            ]
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
        /* LOCKDOWN        */
        /*******************/
        if(subCmdName == 'lockdown') {

            // GETTING OPTIONS VALUES
            let lockdownStatus = interaction.options.getString('status');

            // EVERYONE ROLE
            const everyoneRole = interaction.guild.roles.everyone
            const everyonePerms = everyoneRole.permissions.toArray(); 

            
            // CHANNEL BLACKLISTING BECAUSE OF DEFAULT PERMISSIONS CHANGES
            if (interaction.channel.parentId === '829420812951748628'       // TEMPLE MOD CHANNELS
                || interaction.channel.parentId === '829409161581821993'    // TEMPLE INFORMATION CHANNELS
                || interaction.channel.parentId === '842456511183585395'    // TEMPLE SERVER-STUFF CHANNELS
                || interaction.channel.parentId === '843060523923013652'    // TEMPLE MODERATION CHANNELS
                || interaction.channel.parentId === '850085982371708988'    // TEMPLE ARCHIVED CHANNELS
                || interaction.channel.type == 'GUILD_NEWS'                 // ANY ANNOUNCEMENTS CHANNELS
            ) {
                let cannotLockEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Sorry!`)
                    .setDescription(`This channel cannot be locked/unlocked using this command because it risks breaking the default permissions of the channel.`)

                // POST EMBED
                return interaction.reply({ embeds: [cannotLockEmbed], ephemeral: true })
            }

            // TURNING ON LOCKDOWN
            if(lockdownStatus == 'lock') {

                // CHECK IF ALREADY IN LOCKDOWN BY PERMISSIONS FOR EVERYONE ROLE
                if(everyonePerms.filter((perm) => perm !== 'SEND_MESSAGES')) {
                    let alreadyLockedEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjREDTICK} Sorry!`)
                        .setDescription(`This channel appears to already be locked since users do not have the \`\`SEND_MESSAGES\`\` permission!`)

                    // POST EMBED
                    return interaction.reply({ embeds: [alreadyLockedEmbed], ephemeral: true })
                }


                // LOCKING SEND MESSAGE PERMISSION
                interaction.channels.permissionOverwrites.edit(everyoneRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                }).then(channel => {

                    // CONFIRMATION EMBED
                    let channelLockedConfirmEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`${config.emjGREENTICK} Channel Successfully Locked`)
                        .setDescription(`This channel is now locked. Users cannot send messages, create threads, and add new reaction emojis. Only users with the \`\`ADMINISTRATOR\`\` permission can speak in this channel right now.`)

                    // LOG ENTRY
                    interaction.reply({ embeds: [channelLockedConfirmEmbed], ephemeral: true })


                    // NOTICE EMBED
                    let channelLockedNoticeEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjLock} Channel Locked`)
                        .setDescription(`This channel has been locked by a moderator or administrator. Users cannot send messages, create threads, or add any new emojis to messages until a moderator or administrator lifts the lockdown.`)

                    // LOG ENTRY
                    channel.send({ embeds: [channelLockedNoticeEmbed], ephemeral: true })


                    // LOG EMBED
                    let channelLockedEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjLock} Channel Locked`)
                        .setDescription(`**Staff:** ${interaction.user}\n**Channel:** ${interaction.channel}`)

                    // LOG ENTRY
                    return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [channelLockedEmbed] })
                })
            }


            // TURNING OFF LOCKDOWN
            if(lockdownStatus == 'unlock') {

                // CHECK IF ALREADY IN LOCKDOWN BY PERMISSIONS FOR EVERYONE ROLE
                if(everyonePerms.filter((perm) => perm == 'SEND_MESSAGES')) {
                    let alreadyUnlockedEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjREDTICK} Sorry!`)
                        .setDescription(`This channel appears to already be unlocked since users have the \`\`SEND_MESSAGES\`\` permission!`)

                    // POST EMBED
                    return interaction.reply({ embeds: [alreadyUnlockedEmbed], ephemeral: true })
                }


                // LOCKING SEND MESSAGE PERMISSION
                interaction.channels.permissionOverwrites.edit(everyoneRole, {
                    SEND_MESSAGES: true,
                    ADD_REACTIONS: true,
                }).then(channel => {

                    // CONFIRMATION EMBED
                    let channelUnlockedConfirmEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`${config.emjGREENTICK} Channel Successfully Unlocked`)
                        .setDescription(`This channel is now unlocked. Users can send messages, create threads, and add new reaction emojis.`)

                    // LOG ENTRY
                    interaction.reply({ embeds: [channelUnlockedConfirmEmbed], ephemeral: true })


                    // NOTICE EMBED
                    let channelUnlockedNoticeEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGrey)
                        .setTitle(`${config.emjUnlock} Channel Unlocked`)

                    // LOG ENTRY
                    channel.send({ embeds: [channelUnlockedNoticeEmbed], ephemeral: true })
                    
                    
                    // LOG EMBED
                    let channelUnlockedEmbed = new discord.MessageEmbed()
                        .setColor(config.embedOrange)
                        .setTitle(`${config.emjUnlock} Channel Unlocked`)
                        .setDescription(`**Staff:** ${interaction.user}\n**Channel:** ${interaction.channel}`)

                    // LOG ENTRY
                    return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [channelUnlockedEmbed] })
                })
            }
        }


        /*******************/
        /*  PURGE          */
        /*******************/
        if(subCmdName == 'purge') {
            let purgeMsgCount = interaction.options.getInteger('amount');
           
            // PERMISSIONS VALIDATION
            if(!interaction.member.permissions.has('MANAGE_MESSAGES')) {
                let permErrorEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error!`)
                    .setDescription(`Sorry, I do not have permission to bulk-delete messages for some reason. Make sure I have the \`\`MANAGE_MESSAGES\`\` permission in the channel.`)
                
                return interaction.reply({ embeds: [permErrorEmbed], ephemeral: true })
            }


            // COUNT VALIDATION
            if(purgeMsgCount > 99) {
                let purgeCountErrorEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Sorry!`)
                    .setDescription(`You have specified too many messages. I can only purge up to 99 messages at a time.`)

                return interaction.reply({ embeds: [purgeCountErrorEmbed], ephemeral: true })
            }
            if(purgeMsgCount < 1) {
                let purgeCountErrorEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Sorry!`)
                    .setDescription(`You have specified too few messages. I need to be given a value between 1 and 99.`)

                return interaction.reply({ embeds: [purgeCountErrorEmbed], ephemeral: true })
            }


            // PERFORMING PURGE - filterOld SET TO TRUE FOR MSGS OVER 14 DAYS OLD
            interaction.channel.bulkDelete(purgeMsgCount, {filterOld: true})
                .then(msgs => {

                    // ALL MESSAGES DELETED
                    if(parseInt(msgs) === purgeMsgCount) {
                        let purgeConfirmEmbed = new discord.MessageEmbed()
                            .setColor(config.embedRed)
                            .setTitle(`${config.emjGREENTICK} ${msgs.size} Messages Purged!`)

                        interaction.reply({ embeds: [purgeConfirmEmbed], ephemeral: true })
                    }

                    // ALL MESSAGES DELETED
                    if(parseInt(msgs) !== purgeMsgCount) {
                        let purgeConfirmEmbed = new discord.MessageEmbed()
                            .setColor(config.embedRed)
                            .setTitle(`${config.emjREDTICK} ${msgs.size}/${purgeMsgCount} Messages Purged!`)
                            .setDescription(`I was unable to delete ${purgeMsgCount - msgs.size} of the messages you specified. These messages are likely more than 14 days old and will need to be manually deleted.`)

                        interaction.reply({ embeds: [purgeConfirmEmbed], ephemeral: true })
                    }

                    let purgeLogConfirm = new discord.MessageEmbed()
                        .setColor(config.embedOrange)
                        .setTitle(`${config.emjORANGETICK} ${msgs.size} Messages Purged!`)
                        .setDescription(`**Purged By:** ${interaction.user}\n**Channel:** ${interaction.channel}`)
                        .setTimestamp()

                    return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [purgeLogConfirm] })
                })
                .catch(err => console.log(err))
        }


        /*******************/
        /*  SLOWMODE       */
        /*******************/
        if(subCmdName == 'slowmode') {

            // GETTING OPTIONS VALUES
            let slowmodeValue = interaction.options.getString('value');

            // SLOWMODE OFF
            if(slowmodeValue == 'off') {

                interaction.channel.setRateLimitPerUser(0, `Turning off slowmode per ${interaction.user.username}'s request.`)

                // NOTICE FOR CHANNEL
                let channelSlowmodeEndEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Slowmode Removed`)

                // LOG ENTRY
                return interaction.reply({embeds: [channelSlowmodeEndEmbed] })
            }


            // SLOWMODE – 10s
            if(slowmodeValue == '10s') {

                interaction.channel.setRateLimitPerUser(10, `Setting slowmode to 10s per ${interaction.user.username}'s request.`)

                // NOTICE FOR CHANNEL
                let channelSlowmode10Embed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`Slowmode has been enabled`)
                    .setDescription(`A moderator/admin has set this channel so messages can be sent once every **10** seconds.`)

                // LOG ENTRY
                return interaction.reply({embeds: [channelSlowmode10Embed] })
            }


            // SLOWMODE – 30s
            if(slowmodeValue == '30s') {

                interaction.channel.setRateLimitPerUser(30, `Setting slowmode to 30s per ${interaction.user.username}'s request.`)

                // NOTICE FOR CHANNEL
                let channelSlowmode10Embed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`Slowmode has been enabled`)
                    .setDescription(`A moderator/admin has set this channel so messages can be sent once every **30** seconds.`)

                // LOG ENTRY
                return interaction.reply({embeds: [channelSlowmode10Embed] })
            }


            // SLOWMODE – 1min
            if(slowmodeValue == '1min') {

                interaction.channel.setRateLimitPerUser(60, `Setting slowmode to 60s per ${interaction.user.username}'s request.`)

                // NOTICE FOR CHANNEL
                let channelSlowmode10Embed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`Slowmode has been enabled`)
                    .setDescription(`A moderator/admin has set this channel so messages can be sent once every **60** seconds.`)

                // LOG ENTRY
                return interaction.reply({embeds: [channelSlowmode10Embed] })
            }            
        }
    }
}