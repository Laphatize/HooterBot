const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js')
const config = require ('../../config.json')
const guildSchema = require('../../Database/guildSchema');

// COMMAND ID: 871502773286490198

module.exports = {
    name: 'verif_promptembed',
    description: `ADMIN | Generate/update the verification prompt containing the buttons. [60s]`,
    options: [],
    permissions: 'MANAGE_MESSAGES', //ADMINISTRATOR
    cooldown: 60,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        if(interaction.user.id == config.botAuthorId) {
            interaction.reply({ content: `**GuildApplicationCommandData**\n**Slash Command ID:** ${interaction.commandId}`})
        }

        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
            GUILD_ID: interaction.guild.id
        }).exec();


        // IF NO TICKET CATEGORY, SEND MESSAGE IN CHANNEL
        if(!dbData.TICKET_CAT_ID) {
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
        if(!dbData.VERIF_PROMPT_MSG_ID) {

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
                .setDescription(`The message ID has been saved to the database.`)
                .setTimestamp()


            // LOG ENTRY
            return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logVerifPromptEmbed] })
        }


        // MESSAGE ID EXISTS IN DATABASE, EDIT EMBED WITHOUT TOUCHING MESSAGE ID
        if(dbData.VERIF_PROMPT_MSG_ID) {

            // GETTING THE VERIFICATION PROMPT CHANNEL ID FROM DATABASE
            await interaction.channel.messages.fetch(dbData.VERIF_PROMPT_MSG_ID)
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
                .setTimestamp()


            // LOG ENTRY
            return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logVerifPromptEmbed] })
        }
    }
}