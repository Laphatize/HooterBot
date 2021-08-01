const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require ('../../config.json')
const guildSchema = require('../../Database/guildSchema');

module.exports = {
    name: 'verif_maintenance',
    description: `(ADMIN) Toggle verification prompt to enter/exit maintenance mode.`,
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
        },
    ],
    permissions: 'ADMINISTRATOR',
    cooldown: 15,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const status = inputs[0];


        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
            GUILD_ID: interaction.guild.id
        }).exec();


        // IF NO VERIFICATION PROMPT, SEND MESSAGE IN CHANNEL
        if(!dbData.VERIF_PROMPT_MSG_ID) {
            let noCatEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!** Missing Verification Prompt`)
                .setDescription(`You first need to create a verification prompt in the server using \`\`${config.prefix}verifEmbed\`\` in **#roles** before the verification prompt can be toggled in and out of maintenance mode.`)

            // SENDING TO CHANNEL
            return interaction.reply({ embeds: [noCatEmbed], ephemeral: true })
        }



        // MAINTENANCE MODE "ON"
        if(status == "ON") {

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
            await interaction.channel.messages.fetch(dbData.VERIF_PROMPT_MSG_ID)
                .then(msg => {
                    msg.edit({embeds: [ticketMaintenanceEmbed], components: [buttonRow]})
                })
                .catch(err => console.log(err))
            

            // DEFINING LOG EMBED
            let logTicketCatUpdateEmbed = new discord.MessageEmbed()
                .setColor(config.embedOrange)
                .setTitle(`Verification Embed Update`)
                .setDescription(`**Maintenance mode:** \`\` ON \`\`\n**Ticket status:** Tickets **cannot** be created until maintenance mode is turned off.\n**Changed by:** ${verifChanger}`)
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
        if(status == "OFF") {

            let ticketEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`**Get verified!**`)
                .setDescription(`A ticket will open in your DMs when youclick the button below to start the verification process. You'll need to allow DMs from members of the server to verify.`)
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
            await interaction.channel.messages.fetch(dbData.VERIF_PROMPT_MSG_ID)
                .then(msg => {
                    msg.edit({embeds: [ticketEmbed], components: [buttonRow]})
                })
                .catch(err => console.log(err))


            // DEFINING LOG EMBED
            let logMaintenanceEmbed = new discord.MessageEmbed()
                .setColor(config.embedOrange)
                .setTitle(`Verification Embed Update`)
                .setDescription(`**Maintenance mode:** \`\` OFF \`\`\n**Ticket status:** Tickets **can** be be created using the embed in <#${config.rolesChannelId}>.\n**Changed by:** ${verifChanger}`)
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
}