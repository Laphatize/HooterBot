const discord = require('discord.js')
const fs = require('fs');
const config = require ('../../config.json')
const wait = require('util').promisify(setTimeout);


module.exports = {
    name: 'hooter-fy_text',
    description: `Return provided message in an emojified way using Hooter and Temple emojis. (🤖｜bot-spam) [30s]`,
    options: [
        {
            name: `message`,
            description: `The message to emojify.`,
            type: 'STRING',
            required: true,
        }
    ],
    permissions: '',
    dmUse: false,
    cooldown: 30,
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
                .setDescription(`This command can only be run in <#${botSpamChannel.id}>. Head there and try again!`)

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
                .setDescription(`We all love emojified messages, but that message is a bit *too* big. Shorten your message by ${charsOver} characters and I can send it successfully.\nHere's the message you submitted:\n\`\`\`${message}\`\`\``)

            // POST EMBED
            return interaction.reply({ embeds: [messageTooBig], ephemeral: true })
        }        

        // SENDING
        await interaction.reply({ content: `${emojifiedArgs.join(' ')}` })
    }
}