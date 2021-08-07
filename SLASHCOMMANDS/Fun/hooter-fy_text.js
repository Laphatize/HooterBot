const discord = require('discord.js')
const fs = require('fs');
const config = require ('../../config.json')
const wait = require('util').promisify(setTimeout);

// COMMAND ID: 872905484468903956

module.exports = {
    name: 'hooter-fy_text',
    description: `Return provided message in an emojified way using Hooter and Temple emojis. (🤖｜bot-spam)`,
    permissions: '',
    cooldown: 60,
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
        let randomIndex = Math.floor(Math.random() * emojiArray.length);
        let messageArgs = []
        let emojifiedArgs =  []

        // SPLIT MESSAGE UP
        messageArgs = message.split(` `)
        
        interaction.reply({ content: `messageArgs = ${messageArgs}` })


        messageArgs.forEach( arg => {
            emojifiedArgs.push(`${arg}${emojiArray[randomIndex]}`)
        })

        console.log(`emojifiedArgs = ${emojifiedArgs}`)
        
        // // SENDING
        // await interaction.reply({ content: `Your emojified message will be here soon. MMM check the logs.` })
    }
}