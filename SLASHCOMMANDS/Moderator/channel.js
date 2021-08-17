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
            description: `MODERATOR | Purge up to 100 messages.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `amount`,
                    description: `The number of messages to purge. (limit: 100)`,
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
                    required: false,
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
                        },{
                            name: `2min`,
                            value: `2min`,
                        },{
                            name: `5min`,
                            value: `5min`,
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
           
        }


        /*******************/
        /*  SLOWMODE       */
        /*******************/
        if(subCmdName == 'slowmode') {

            // GETTING OPTIONS VALUES
            let slowmodeValue = interaction.options.getString('value');
            
        }
    }
}