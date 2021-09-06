const discord = require('discord.js')
const config = require ('../../config.json')
const { MessageActionRow, MessageButton } = require('discord.js');
const moment = require('moment');


module.exports = {
    name: 'modapp',
    description: 'ADMIN | Open or close moderator applications.',
    options: [
        {
            name: `action`,
            description: `Select what you want to do with server mod applications.`,
            type: `STRING`,
            required: true,
            choices: [
                {
                    name: `open`,
                    value: `open`,
                },{
                    name: `close`,
                    value: `close`,
                },{
                    name: `appconfirm`,
                    value: `appconfirm`
                },{
                    name: `appdisq`,
                    value: `appdisq`
                }
            ]
        }
    ],
    permissions: 'ADMINISTRATOR',
    dmUse: false,
    cooldown: 0,
    defaultPermission: false,
    run: async(client, interaction, inputs) => {


        // OPEN APP PROMPT
        if(inputs[0] == 'open') {

            let adminRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() == 'admin');
            let botRole = interaction.guild.me.roles.cache.find((role) => role.name == 'HooterBot');
            let parentCategory = interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'server stuff' && ch.type === 'GUILD_CATEGORY')

            if(interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'mod-applications-info' && ch.type === 'GUILD_TEXT')) {
                let modAppsCh = interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'mod-applications-info' && ch.type === 'GUILD_TEXT')

                let appsOpenEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`It appears moderator applications are already open! See ${modAppsCh}.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [appsOpenEmbed], ephemeral: true })
            }

            // CREATE MOD APPLICATION CHANNEL
            await interaction.guild.channels.create(`mod-applications-info`, {
                type: 'GUILD_TEXT',
                parent: parentCategory.id,
                topic: `Interested in becoming a moderator? Apply here.`,
                permissionOverwrites: [
                    {
                        // EVERYONE ROLE
                        id: interaction.guild.roles.everyone.id,
                        deny: [`SEND_MESSAGES`, `USE_PUBLIC_THREADS`, `USE_PRIVATE_THREADS`]
                    },{
                        // ADMINS
                        id: adminRole.id,
                        allow: [`SEND_MESSAGES`]
                    },{
                        // HOOTERBOT ROLE
                        id: botRole.id,
                        allow: [`SEND_MESSAGES`]
                    }
                ],
                reason: `Opening moderator applications.`
            })
                .then(async modAppNoticeChannel => {

                    // CREATE APPLICATION INFO EMBED WITH BUTTON
                    let appNoticeEmbed = new discord.MessageEmbed()
                        .setColor(config.embedBlurple)
                        .setTitle(`**Moderator Applications Are Open**`)
                        .setDescription(`The admins are looking for eager users interested in becoming moderators in the server!
                        \n\nEligiblity:
                            \n${config.indent}**1.** Be a member for at least **one month**.
                            \n${config.indent}**2.** Be an active member of the community (participating in channels).
                            \n${config.indent}**3.** Help enforce the server's rules, taking appropriate actions when necessary, and logging these actions.
                            \n${config.indent}(Not required, but **past moderating experience on Discord** is a plus)
                            \n\nIf you want to apply, click the button below to open an application ticket in the server. HooterBot will ping you in the channel to complete your application.
                            \n*Be sure to answer all questions by the deadline as incomplete applications will not be considered!*
                        \n\n**APPLICATION DEADLINE: <t:${moment().startOf('day').add(7, 'days').subtract(1, 'minutes').utcOffset(-4).unix()}:R> **`)


                    let ApplyButton = new MessageButton()
                        .setLabel("Apply")
                        .setStyle("SUCCESS")
                        .setCustomId("modAppApply")
    
                    // BUTTON ROW
                    let ButtonRow = new MessageActionRow()
                        .addComponents(
                            ApplyButton
                        );

                    await modAppNoticeChannel.send({ embeds: [appNoticeEmbed], components: [ButtonRow] })

                    
                    // CONFIRMATION
                    let openConfirmEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`${config.emjGREENTICK} Mod App Open Successfully`)
                        .setDescription(`See ${modAppNoticeChannel}.`)

                    // SENDING TO CHANNEL
                    return interaction.reply({ embeds: [openConfirmEmbed], ephemeral: true })
                })
            }




        // CLOSE APP PROMPT
        if(inputs[0] == 'close') {

            let modAppNoticeChannel
            
            try {
                modAppNoticeChannel = interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'mod-applications-info' && ch.type === 'GUILD_TEXT')
            } catch (err) {
                    let chNotFoundEmbed = new discord.MessageEmbed()
                        .setColor(config.embedTempleRed)
                        .setTitle(`${config.emjREDTICK} **Error!**`)
                        .setDescription(`I couldn't find the \`\`#mod-applications-info\`\` channel in the server! Please run \`\`/modapp open \`\``)

                    // SENDING TO CHANNEL
                    return interaction.reply({ embeds: [chNotFoundEmbed], ephemeral: true })
            }


            // CREATE APPLICATION INFO EMBED WITH BUTTON
            let appNoticeEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`**Moderator Applications Are Now Closed**`)
                .setDescription(`Thank you to all who applied. We will begin reviewing your applications and will announce the new moderators soon.`)

            await modAppNoticeChannel.send({ embeds: [appNoticeEmbed] })


            // CONFIRMATION
            let closeConfirmEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} Mod Application Close Notice Posted`)
                .setDescription(`Please visit ${modAppNoticeChannel} and delete the original opening embed.`)

            // SENDING TO CHANNEL
            return interaction.reply({ embeds: [closeConfirmEmbed], ephemeral: true })
        }
        



        // APP SUBMITTED SUCCESSFULLY AND IN FULL - FREEZE CURRENT APPLICATION CHANNEL
        if(inputs[0] == 'appconfirm') {

            if(!interaction.channel.name.startsWith(`modapp-`) && !interaction.channel.name.includes(`completed`) ) {
                let notAppChEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`This command can only be ran in completed moderator application channels. **This application is not complete!**`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notAppChEmbed], ephemeral: true })
            }

            let chNameSplit = interaction.channel.name.split(`-`)
            let applicantUserId = chNameSplit[1]
                
            // UPDATE DATABASE
            await modAppTicketSchema.findOneAndDelete({
                USER_ID: applicantUserId
            }).exec();
            

            // LOCKING SEND MESSAGE PERMISSION
            interaction.channel.permissionOverwrites.edit(applicantUserId, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
            }).then(channel => {

                // CONFIRMATION EMBED
                let appLocked = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Application Successfully Submitted`)
                    .setDescription(`This is confirmation that your application has been submitted successfully!\n\nThank you for taking the time to complete this application and for volunteering to help the Temple University server.\n\nThe admins will begin reviewing applications shortly and will announce the new moderator(s) in <#829414138794213397> once a decision has been made.`)

                // LOG ENTRY
                channel.send({ embeds: [appLocked] })
            })

            interaction.reply({ content: `App confirmation added`, ephemeral: true })
        }




        // APP NOT COMPLETED IN FULL - FREEZE CURRENT APPLICATION CHANNEL
        if(inputs[0] == 'appdisq') {

            if(!interaction.channel.name.startsWith(`modapp-`)) {
                let notAppChEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`This command can only be ran in **moderator application channels**.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notAppChEmbed], ephemeral: true })
            }

            let chNameSplit = interaction.channel.name.split(`-`)
            let applicantUserId = chNameSplit[1]
                
            // UPDATE DATABASE
            await modAppTicketSchema.findOneAndDelete({
                USER_ID: applicantUserId[1]
            }).exec();
            

            // LOCKING SEND MESSAGE PERMISSION
            interaction.channel.permissionOverwrites.edit(applicantUserId, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
            }).then(channel => {

                // CONFIRMATION EMBED
                let appLocked = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Application Not Submitted`)
                    .setDescription(`Unfortunately, your application has not been completed by the application deadline and as such, we are unable to consider this application.`)

                // LOG ENTRY
                channel.send({ embeds: [appLocked] })
            })

            interaction.reply({ content: `App confirmation added`, ephemeral: true })
        }
    }
}