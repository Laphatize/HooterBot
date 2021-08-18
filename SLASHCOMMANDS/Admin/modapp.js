const discord = require('discord.js')
const config = require ('../../config.json')
const guildSchema = require('../../Database/guildSchema');


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
                }
            ]
        }
    ],
    permissions: 'ADMINISTRATOR',
    dmUse: false,
    cooldown: 60,
    defaultPermission: false,
    run: async(client, interaction, inputs) => {


        // OPEN APPS
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
            await message.guild.channels.create(`mod-applications-info`, {
                type: 'GUILD_TEXT',
                parent: parentCategory.id,
                topic: `Interested in becoming a moderator? Apply here.`,
                permissionOverwrites: [
                    {
                        // EVERYONE ROLE
                        id: message.guild.roles.everyone.id,
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
                        .setTitle(`**Moderator Application Are Open**`)
                        .setDescription(`The admins are looking for more users to become moderators in the server. To be eligible to apply, you must:
                            \n${config.indent}**1.** be a membmer for at least **one month**.
                            \n${config.indent}**2.** be active member of the community (participating in channels).
                            \n${config.indent}**3.** ???
                            \n${config.indent}(Not required, but **past moderating experience on Discord** is a plus)
                            \n\nIf you want to apply, click the button below to open an application ticket in the server. HooterBot will ping you and begin the application.`)
                        .setFooter(`BUTTON NOT ENABLED`)


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




        // OPEN APPS
        if(inputs[0] == 'close') {

            let modAppNoticeChannel = interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'mod-applications-info' && ch.type === 'GUILD_TEXT')
                .catch( err => {
                    let chNotFoundEmbed = new discord.MessageEmbed()
                        .setColor(config.embedTempleRed)
                        .setTitle(`${config.emjREDTICK} **Error!**`)
                        .setDescription(`I couldn't find the \`\`#mod-applications-info\`\` channel in the server! Please run \`\`/modapp open \`\``)

                    // SENDING TO CHANNEL
                    return interaction.reply({ embeds: [chNotFoundEmbed], ephemeral: true })
                })


            // CREATE APPLICATION INFO EMBED WITH BUTTON
            let appNoticeEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`**Moderator Application**`)
                .setDescription(`The admins are looking for more users to become moderators in the server. To be eligible to apply, you must:
                    \n${config.indent}**1.** be a membmer for at least **one month**.
                    \n${config.indent}**2.** be active member of the community (participating in channels).
                    \n${config.indent}**3.** ???
                    \n${config.indent}(Not required, but **past moderating experience on Discord** is a plus)
                    \n\nIf you want to apply, click the button below to open an application ticket in the server. HooterBot will ping you and begin the application.`)
                .setFooter(`BUTTON NOT ENABLED`)


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
            let closeConfirmEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} Mod Application Close Notice Posted`)
                .setDescription(`Please visit ${modAppNoticeChannel} and delete the original opening embed.`)

            // SENDING TO CHANNEL
            return interaction.reply({ embeds: [closeConfirmEmbed], ephemeral: true })
        }                        
    }
}