const discord = require('discord.js')
const config = require('../../config.json')
const guildSchema = require('../../Database/guildSchema');

module.exports = {
    name: `verificationperks`,
    aliases: [`verifperks`],
    description: `(${config.emjAdmin}) Generate the embed in the \#roles channel so users can view the list of perks for verifying.`,
    category: `Verification`,
    expectedArgs: '',
    cooldown: 30,
    minArgs: 0,
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        // DELETING INVOCATION MESSAGE
        setTimeout(() => message.delete(), 0 );


        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
            GUILD_ID: message.guild.id
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



        // IF MESSAGE ID DNE IN DATABASE, POST THEN LOG MSG INFO IN DB
        if(!dbData.VERIF_PERKS_MSG_ID) {

            // POSTING EMBED
            await message.channel.send({ embeds: [verifPerksEmbed] })
                .catch(err => console.log(err))

                // GETTING MESSAGE ID OF verifPerksEmbed
                .then(sentEmbed => {
                    verifPerksEmbedMsgId = sentEmbed.id;
                })


            // STORING IN DATABASE THE RULE EMBED'S MESSAGE ID AND CHANNEL ID
            await guildSchema.findOneAndUpdate({
                // CONTENT USED TO FIND UNIQUE ENTRY
                GUILD_NAME: message.guild.name,
                GUILD_ID: message.guild.id
            },{
                // CONTENT TO BE UPDATED
                VERIF_PERKS_MSG_ID: verifPerksEmbedMsgId
            },{ 
                upsert: true
            }).exec();


            // DEFINING LOG EMBED
            let logVerifPerksPromptEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} New verified perks embed posted - details saved to database for updating.`)
                .setTimestamp()


            // LOG ENTRY
            message.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logVerifPerksPromptEmbed] })
                .catch(err => console.log(err))

            return;
        }


        
        // IF MESSAGE ID EXISTS IN DATABASE, EDIT THE EMBED WITHOUT TOUCHING MESSAGE ID IN DATABASE
        if(dbData.VERIF_PERKS_MSG_ID) {

            // GETTING THE VERIFICATION PROMPT CHANNEL ID FROM DATABASE
            await message.channel.messages.fetch(dbData.VERIF_PERKS_MSG_ID)
                .then(msg => {
                    msg.edit({ embeds: [verifPerksEmbed] })
                })
                .catch(err => console.log(err))


            // DEFINING LOG EMBED
            let logPerksEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} Verified perks embed updated.`)
                .setTimestamp()


            // LOG ENTRY
            message.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logPerksEmbed] })
                .catch(err => console.log(err))

            return;
        }
    }
}