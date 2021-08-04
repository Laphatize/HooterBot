const discord = require('discord.js')
const fs = require('fs');
const config = require ('../../config.json')
const wait = require('util').promisify(setTimeout);


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

        // GRAB INPUT MESSAGE
        let message = inputs[0]


        // ARRAY OF OUTCOMES AND FILENAMES
        const outcomesArray =  [
            [`ASK AGAIN LATER`, `https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Ask%20Again%20Later.png`],
            [`ASK AGAIN`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Ask%20Again.png`],
            [`CANNOT TELL`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Cannot%20Tell.png`],
            [`COUNT ON IT`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Count%20On%20It.png`],
            [`GO FOR IT`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Go%20For%20It.png`],
            [`MAYBE`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Maybe.png`],
            [`MY REPLY IS NO`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_My%20Reply%20Is%20No.png`],
            [`MY REPLY IS YES`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_My%20Reply%20Is%20Yes.png`],
            [`NO DOUBT`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_No%20Doubt.png`],
            [`NO`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_No.png`],
            [`NOT LIKELY`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Not%20Likely.png`],
            [`NOT LOOKING GOOD...`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Not%20Looking%20Good.png`],
            [`NOT NOW`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Not%20Now.png`],
            [`NOT TODAY`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Not%20Today.png`],
            [`TRY ASKING A DIFFERENT MAGIC 8 BALL`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Try%20Asking%20A%20Different%20Magic%208%20Ball.png`],
            [`VERY LIKELY`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Very%20Likely.png`],
            [`VERY MUCH DOUBT`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Very%20Much%20Doubt.png`],
            [`WAIT FOR IT`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Wait%20For%20It.png`],
            [`WHY ARE YOU ASKING ME???`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Why%20Are%20You%20Asking%20Me.png`],
            [`YES`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Yes.png`]
        ]


        // PICKING RANDOM FILE
       


        let randomIndex = Math.floor(Math.random() * outcomesArray.length);
        let textResponse = outcomesArray[randomIndex][0]
        let imageResponse = outcomesArray[randomIndex][1]


        console.log(`randomIndex = ${randomIndex}`)
        console.log(`textResponse = ${textResponse}`)
        console.log(`imageResponse = ${imageResponse}`)
    
        // GRABBING 8BALL TEXT FROM FILENAME TO DISPLAY


        let eightBallInitialEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .addField(`${interaction.user.username} asks:`, `*"${message}"*`)
            .setDescription(`\n${config.emjThinking} *The Magic 8 Ball is being shaken...*`)


        let eightBallFinalEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .addField(`${interaction.user.username} asks:`, `*"${message}"*`)
            .addField(`\nThe Magic 8 Ball says...`, `***${textResponse}***`)
            .setImage(imageResponse)


        // POSTING LINK USING VALUES FROM ABOVE
        interaction.reply({ embeds: [eightBallInitialEmbed] })
        
        await wait(Math.floor(Math.random() * 6));
        
        // POSTING LINK USING VALUES FROM ABOVE
        interaction.reply({ embeds: [eightBallInitialEmbed] })
    }
}