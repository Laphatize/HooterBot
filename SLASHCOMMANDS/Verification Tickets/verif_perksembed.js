const discord = require('discord.js')
const config = require ('../../config.json')
const guildSchema = require('../../Database/guildSchema');

module.exports = {
    name: 'verif_perksembed',
    description: `(ADMIN) Generate/update the verification perks embed message. [CD: 60s]`,
    options: [],
    permissions: 'MANAGE_MESSAGES', //ADMINISTRATOR
    cooldown: 60,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
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
        if(!dbData.VERIF_PERKS_MSG_ID) {

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
                .setDescription(`The message ID has been saved to the database.`)
                .setTimestamp()


            // LOG ENTRY
            return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logVerifPerksPromptEmbed] })
        }


        // MESSAGE ID EXISTS IN DATABASE, EDIT EMBED WITHOUT TOUCHING MESSAGE ID
        if(dbData.VERIF_PERKS_MSG_ID) {

            // GETTING THE VERIFICATION PERKS CHANNEL ID FROM DATABASE
            await interaction.channel.messages.fetch(dbData.VERIF_PERKS_MSG_ID)
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
                .setTimestamp()


            // LOG ENTRY
            return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logPerksEmbed] })
        }
    }
}