const discord = require('discord.js')
const fs = require('fs');
const config = require ('../../config.json')
const test = require(`../Fun/8ball_Images`)

module.exports = {
    name: '8ball',
    description: `Ask a question and get a response... [30s]`,
    permissions: '',
    cooldown: 30,
    defaultPermission: true,
    options: [
        {
            name: `question`,
            description: `What is your question?`,
            type: 'STRING',
            required: true,
        }
    ],
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        let message = inputs[0]

        // GRAB RANDOM IMAGE AND USE FILENAME AS RESPONSE
        var images = fs.readdirSync(`../Fun/8ball_Images`).filter(file => file.endsWith('.png'));

        // PICKING RANDOM FILE
        let chosenOption = images[Math.floor(Math.random() * images.length)]
        console.log(`chosenOption = ${chosenOption}`)
    
        // GRABBING 8BALL TEXT FROM FILENAME TO DISPLAY


        let eightBallEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .addField(`${interaction.user.username} asked:`, `*"${message}"*`)
            .addField(`The Magic 8 Ball says...`, `responseMessage`)
            // .setImage(dmMsgAttachment)



        


        // POSTING LINK USING VALUES FROM ABOVE
        interaction.reply({ embeds: [eightBallEmbed] })
    }
}


// FUNCTION TO PICK RANDOM IMAGE