const discord = require('discord.js')
const config = require ('../../config.json')


module.exports = {
    name: 'partner_message',
    description: 'ADMIN | Generate embed in \#server-announcements to share messages from partner servers. [10s]',
    options: [
        {
            name: `partner_name`,
            description: `The name of the partner server`,
            type: `STRING`,
            required: true
        },{
            name: `message`,
            description: `The main body of the announcement message`,
            type: `STRING`,
            required: true
        },{
            name: `image_url`,
            description: `Image URL to be attached to message`,
            type: `STRING`,
            required: false
        }
    ],
    permissions: 'ADMINISTRATOR',
    dmUse: false,
    cooldown: 10,
    defaultPermission: false,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const partnerName = inputs[0];
        const partnerMsg = inputs[1];
        const imageUrl = inputs[2];


        // EMBED MESSAGE WITHOUT IMAGE URL
        if(!imageUrl) {

            let partnerEmbed = new discord.MessageEmbed()
                .setColor(config.embedDarkGrey)
                .setTitle(`**Announcement from our partnered server:\n${partnerName}**`)
                .setDescription(`${partnerMsg}`)
                .addField('\u200B', '\u200B') // BLANK FIELD FOR SEPARATION
                .addField(`Want to join this partnered server?`, `Head to <#832684556598640691> for the invite link!`)
                
            // POSTING EMBED MESSAGE AND BUTTON
            await interaction.guild.channels.cache.find(ch => ch.name === `server-announcements`).send({embeds: [partnerEmbed]})
                .catch(err => {
                    // LOGGING
                    console.log(err)

                    // INFORMING USER
                    let msgSendErrorEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjREDTICK} Error!`)
                        .setDescription(`Sorry, there was a problem sending your Partner Message. Please have <#${config.botAuthorId}> investigate.\nI have recovered your message components so you can try again:`)
                        .addField(`partnerName`, `\`\`${partnerName}\`\``)
                        .addField(`partnerMsg`, `\`\`${partnerMsg}\`\``)
                        .setTimestamp()
                    return interaction.user.send({embeds: [msgSendErrorEmbed]})
                })
            
            // REPLYING TO INTERACTION AS EPHEMERAL
            let msgSendSuccessEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} Success!`)
                .setDescription(`Your partner message has been successfully submitted.`)
                .setTimestamp()

            interaction.reply({embeds: [msgSendSuccessEmbed], ephemeral: true})
        }


        // EMBED MESSAGE WITH IMAGE URL
        if(imageUrl) {
            let partnerEmbedImage = new discord.MessageEmbed()
                .setColor(config.embedDarkGrey)
                .setTitle(`**Announcement from our partnered server:\n${partnerName}**`)
                .setDescription(`${partnerMsg}`)
                .addField('\u200B', '\u200B') // BLANK FIELD FOR SEPARATION
                .addField(`Want to join this partnered server?`, `Head to <#832684556598640691> for the invite link!`)
                .setImage(`${imageUrl}`)


            // POSTING EMBED MESSAGE AND BUTTON
            await interaction.guild.channels.cache.find(ch => ch.name === `server-announcements`).send({embeds: [partnerEmbedImage]})
                .catch(err => {
                    // LOGGING
                    console.log(err)

                    // INFORMING USER
                    let msgSendErrorEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjREDTICK} Error!`)
                        .setDescription(`Sorry, there was a problem sending your Partner Message. Please have <#${config.botAuthorId}> investigate.\nI have recovered your message components so you can try again:`)
                        .addField(`partnerName`, `\`\`${partnerName}\`\``)
                        .addField(`partnerMsg`, `\`\`${partnerMsg}\`\``)
                        .addField(`imageUrl`, `\`\`${imageUrl}\`\``)
                        .setTimestamp()
                    return interaction.user.send({embeds: [msgSendErrorEmbed]})
                })

            // CONFIRMING SUBMISSION IN CHANNEL
            let msgSendSuccessEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} Success!`)
                .setDescription(`Your partner message with an image has been successfully submitted.`)
                .setTimestamp()

            interaction.reply({embeds: [msgSendSuccessEmbed], ephemeral: true})
        }


        // LOGGING MESSAGE CREATION
        let logPartnerMsgEmbed = new discord.MessageEmbed()
        .setColor(config.embedDarkGrey)
        .setTitle(`New Partner Message Submitted`)
        .addField(`User:`, `${interaction.user}`)
        .addField(`Channel:`, `${interaction.guild.channels.cache.find(ch => ch.name === `server-announcements`)}`)
        .setTimestamp()

        // SENDING TO LOG CHANNEL
        interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logPartnerMsgEmbed] })
        return
    }
}