const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js')
const config = require('../../config.json')
const guildSchema = require('../../Database/guildSchema');


module.exports = {
    name: `verifEmbed`,
    aliases: [`generateVerificationPrompt`],
    description: `(${config.emjAdmin}) Generates the embed in the \#roles channel so users can begin the verification process.`,
    expectedArgs: '',
    cooldown: -1,
    minArgs: 0,
    maxArgs: 0,
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, text, client) => {

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );
        

        // IGNORING DM USE
        if(message.channel.type == "dm") {
            return;
        }

        
        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
            GUILD_ID: message.guild.id
        });


        // SETTING PREFIX VALUE USING DATABASE OR DEFAULT
        if(dbData.PREFIX) {
            serverPrefix = dbData.PREFIX;
        } else if(!dbData.PREFIX) {
            serverPrefix = config.prefix;
        }


        // IF NO TICKET CATEGORY, SEND MESSAGE IN CHANNEL
        if(!dbData.TICKET_CAT_ID) {
            let noCatEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`${config.emjREDTICK} **Error!**`)
            .setDescription(`You need to set the ticket category using \`\`${serverPrefix}ticketcategory\`\` or \`\`${serverPrefix}setcategory\`\` before the verification prompt can be posted.`)

            // SENDING TO CHANNEL
            message.channel.send({ embeds: [noCatEmbed] })
            // DELETE AFTER 10 SECONDS
            .then(msg => {client.setTimeout(() => msg.delete(), 10000 )})
            .catch(err => console.log(err))
            return
        }

        // AVOIDING DUPLICATE POSTS OF VERIFICATION EMBED
        if(dbData.VERIF_PROMPT_MSG_ID) {

            // GETTING THE VERIFICATION PROMPT CHANNEL ID FROM DATABASE
            verifPromptExistsChId = dbData.VERIF_PROMPT_CH_ID

            verifPromptChannel = client.channels.cache.get(verifPromptExistsChId)

            let verifExistsAlreadyEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`${config.emjREDTICK} **Error!**`)
            .setDescription(`A verification prompt already exists in ${verifPromptChannel}.`)

            // SENDING TO CHANNEL
            message.channel.send({ embeds: [verifExistsAlreadyEmbed] })
            // DELETE AFTER 10 SECONDS
            .then(msg => {client.setTimeout(() => msg.delete(), 10000 )})
            .catch(err => console.log(err))
            return
        }


        // EMBED MESSAGE
        let ticketEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`**Get verified!**`)
            .setDescription(`A ticket will open in your DMs when you click the button below to start the verification process. Make sure you allow DMs from members of the server.`)
            .setFooter(`Note: The contents of tickets are permanently deleted when tickets are closed. Please submit a ModMail ticket if you have any questions.`)


        // BUTTON ROW
        const buttonRow = new MessageActionRow()
            .addComponents(
                // BUTTON
                new MessageButton()
                    .setLabel("Begin Verification")
                    .setStyle("SUCCESS")
                    .setCustomId("begin_verification_button")
            );


        // POSTING EMBED MESSAGE AND BUTTON
        await message.channel.send({ embeds: [ticketEmbed], components: [buttonRow] })

        // GETTING MESSAGE ID OF ticketEmbed
        .then(sentEmbed => {
            ticketEmbedMsgId = sentEmbed.id;
        })

        // STORING IN DATABASE THE VERIFICATION PROMPT'S MESSAGE ID AND CHANNEL ID
        await guildSchema.findOneAndUpdate({
            // CONTENT USED TO FIND UNIQUE ENTRY
            GUILD_NAME: message.guild.name,
            GUILD_ID: message.guild.id
        },{
            // CONTENT TO BE UPDATED
            VERIF_PROMPT_CH_ID: message.channel.id,
            VERIF_PROMPT_MSG_ID: ticketEmbedMsgId
        },{ 
            upsert: true
        })
    }
}