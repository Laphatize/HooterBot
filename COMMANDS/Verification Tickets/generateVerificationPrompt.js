const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js')
const config = require('../../config.json')
const guildSchema = require('../../Database/guildSchema');


module.exports = {
    name: `verifembed`,
    aliases: [`generateverificationprompt`, `verificationprompt`, `verifprompt`],
    description: `(${config.emjAdmin}) Generates the embed in the \#roles channel so users can begin the verification process.`,
    category: `Verification`,
    expectedArgs: '',
    cooldown: -1,
    minArgs: 0,
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );

        
        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
            GUILD_ID: message.guild.id
        }).exec();


        // IF NO TICKET CATEGORY, SEND MESSAGE IN CHANNEL
        if(!dbData.TICKET_CAT_ID) {
            let noCatEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`You need to set the ticket category using \`\`${config.prefix}ticketcategory\`\` or \`\`${config.prefix}setcategory\`\` before the verification prompt can be posted.`)

            // SENDING TO CHANNEL
            message.channel.send({ embeds: [noCatEmbed] })
                // DELETE AFTER 10 SECONDS
                .then(msg => {client.setTimeout(() => msg.delete(), 10000 )})
                .catch(err => console.log(err))
            return
        }

        
        // EMBED MESSAGE
        let verifEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`**Get verified!**`)
            .setDescription(`A ticket will open in your DMs when you click the button below to start the verification process. Make sure you allow DMs from members of the server.`)
            .setFooter(`Note: The contents of tickets are permanently deleted when tickets are closed. Please submit a ModMail ticket if you have any questions.`)


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
                    .setLabel(`Data & Privacy`)
                    .setStyle("PRIMARY")
                    .setCustomId(`dataPrivacy_Roles`)
            );



        // IF MESSAGE ID DNE IN DATABASE, POST THEN LOG MSG INFO IN DB
        if(!dbData.VERIF_PROMPT_MSG_ID) {

            // POSTING EMBED AND BUTTON ROW
            await message.channel.send({ embeds: [verifEmbed], components: [buttonRow] })
                .catch(err => console.log(err))

                // GETTING MESSAGE ID OF verifEmbed
                .then(sentEmbed => {
                    verifEmbedMsgId = sentEmbed.id;
                })


            // STORING IN DATABASE THE RULE EMBED'S MESSAGE ID AND CHANNEL ID
            await guildSchema.findOneAndUpdate({
                // CONTENT USED TO FIND UNIQUE ENTRY
                GUILD_NAME: message.guild.name,
                GUILD_ID: message.guild.id
            },{
                // CONTENT TO BE UPDATED
                VERIF_PROMPT_MSG_ID: verifEmbedMsgId
            },{ 
                upsert: true
            }).exec();


            // DEFINING LOG EMBED
            let logVerifPromptEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} New verification prompt posted - details saved to database for updating.`)
                .setTimestamp()


            // LOG ENTRY
            client.channels.cache.get(config.logActionsChannelId).send({ embeds: [logVerifPromptEmbed] })
                .catch(err => console.log(err))

            return;
        }



        // IF MESSAGE ID EXISTS IN DATABASE, EDIT THE EMBED WITHOUT TOUCHING MESSAGE ID IN DATABASE
        if(dbData.VERIF_PROMPT_MSG_ID) {

            // GETTING THE VERIFICATION PROMPT CHANNEL ID FROM DATABASE
            await message.channel.messages.fetch(dbData.VERIF_PROMPT_MSG_ID)
                .then(msg => {
                    msg.edit({ embeds: [verifEmbed], components: [buttonRow] })
                })
                .catch(err => console.log(err))


            // DEFINING LOG EMBED
            let logVerifPromptEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} Verified Perks embed updated.`)
                .setTimestamp()


            // LOG ENTRY
            client.channels.cache.get(config.logActionsChannelId).send({ embeds: [logVerifPromptEmbed] })
                .catch(err => console.log(err))

            return;
        }
    }
}