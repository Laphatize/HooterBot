const discord = require('discord.js')
const fs = require('fs');
const config = require ('../../config.json')
const wait = require('util').promisify(setTimeout);

// COMMAND ID: 872905484468903956

module.exports = {
    name: 'hooter-fy_text',
    description: `Return provided message in an emojified way using Hooter and Temple emojis. (🤖｜bot-spam)`,
    permissions: '',
    cooldown: 30,
    defaultPermission: true,
    options: [
        {
            name: `message`,
            description: `The message to emojify.`,
            type: 'STRING',
            required: true,
        }
    ],
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRAB INPUT MESSAGE
        let message = inputs[0]


        // BOT-SPAM CHANNEL ONLY
        if(interaction.channel.name !== '🤖｜bot-spam') {

            let botSpamChannel = interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === '🤖｜bot-spam')

            let wrongChannel = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`You'll have to run this command in <#${botSpamChannel.id}>. Head there and try again!`)

            // POST EMBED
            return interaction.reply({ embeds: [wrongChannel], ephemeral: true })
        }


        // ARRAY OF EMOJIS
        const emojiArray =  [
            [config.emjTempleT],
            [config.emjTempleTWhite],
            [config.emjOwl],
            [config.emjHooter1],
            [config.emjHooter2],
            [config.emjHooterFloss],
            [config.emjHooterEyeRoll]
        ]


        // PICKING RANDOM EMOJIS
        let messageArgs = []
        let emojifiedArgs =  []

        // SPLIT MESSAGE UP
        messageArgs = message.split(` `)

        // INSERT RANDOMIZED EMOJIS INTO MESSAGE
        let i = 0
        do {
            emojifiedArgs.push(`${messageArgs[i]} ${emojiArray[Math.floor(Math.random() * emojiArray.length)]}`)
            i++
        } while (i < messageArgs.length)

        if(emojifiedArgs.join(' ').length >= 2048) {

            let totalChars = emojifiedArgs.join(' ').length

            let charsOver = totalChars - 2048;

            let messageTooBig = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`Discord puts limits on how big my messages can be. Your message is ${charsOver} characters over this limit.\nHere's the message you submitted:\n\`\`\`${message}\`\`\``)

            // POST EMBED
            return interaction.reply({ embeds: [messageTooBig], ephemeral: true })
            .catch(err => {
                let messageReallyBig = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Sorry!`)
                    .setDescription(`Discord puts limits on how big my messages can be. Your message is ${charsOver} characters over this limit. It's so big, I can't even copy/paste your message back to you so you can shorten it. Sorry!`)
                return interaction.reply({ embeds: [messageReallyBig], ephemeral: true })
            })
        }        

        // SENDING
        await interaction.reply({ content: `${emojifiedArgs.join(' ')}` })
    }
}