const discord = require('discord.js')
const fs = require('fs');
const config = require ('../../config.json')
const wait = require('util').promisify(setTimeout);


module.exports = {
    name: '8ball',
    description: `Ask a question and get a response... (🤖｜bot-spam) [30s]`,
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

        if(interaction.user.id == config.botAuthorId) {
            interaction.reply({ content: `**GuildApplicationCommandData**\n**Slash Command ID:** ${interaction.id}`})
        }

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

        // INITIAL RESPONSE
        let eightBallInitialEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .addField(`${interaction.user.username} asks:`, `*"${message}"*
            \n${config.emjThinking} *The Magic 8 Ball is being shaken...*`)

        await interaction.reply({ embeds: [eightBallInitialEmbed] })


        // ARRAY OF OUTCOMES AND FILENAMES
        const outcomesArray =  [
            [`ASK AGAIN LATER`, `https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Ask%20Again%20Later.png`, config.embedBlurple],
            [`ASK AGAIN`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Ask%20Again.png`, config.embedBlurple],
            [`CANNOT TELL`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Cannot%20Tell.png`, config.embedBlurple],
            [`COUNT ON IT`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Count%20On%20It.png`, config.embedGreen],
            [`GO FOR IT`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Go%20For%20It.png`, config.embedGreen],
            [`MAYBE`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Maybe.png`, config.embedBlurple],
            [`MY REPLY IS NO`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_My%20Reply%20Is%20No.png`, config.embedRed],
            [`MY REPLY IS YES`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_My%20Reply%20Is%20Yes.png`, config.embedGreen],
            [`NO DOUBT`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_No%20Doubt.png`, config.embedGreen],
            [`NO`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_No.png`, config.embedRed],
            [`NOT LIKELY`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Not%20Likely.png`, config.embedRed],
            [`NOT LOOKING GOOD...`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Not%20Looking%20Good.png`, config.embedRed],
            [`NOT NOW`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Not%20Now.png`, config.embedBlurple],
            [`NOT TODAY`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Not%20Today.png`, config.embedBlurple],
            [`TRY ASKING A DIFFERENT MAGIC 8 BALL`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Try%20Asking%20A%20Different%20Magic%208%20Ball.png`, config.embedBlurple],
            [`VERY LIKELY`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Very%20Likely.png`, config.embedGreen],
            [`VERY MUCH DOUBT`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Very%20Much%20Doubt.png`, config.embedRed],
            [`WAIT FOR IT`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Wait%20For%20It.png`, config.embedBlurple],
            [`WHY ARE YOU ASKING ME???`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Why%20Are%20You%20Asking%20Me.png`, config.embedBlurple],
            [`YES`,`https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/SLASHCOMMANDS/Fun/8ball_Images/8ball_Yes.png`, config.embedGreen]
        ]

        // PICKING RANDOM RESPONSE VALUE AND GETTING TEXT + IMAGE
        let randomIndex = Math.floor(Math.random() * outcomesArray.length);
        let textResponse = outcomesArray[randomIndex][0]
        let imageResponse = outcomesArray[randomIndex][1]
        let embedColor = outcomesArray[randomIndex][2]


        let eightBallFinalEmbed = new discord.MessageEmbed()
            .setColor(embedColor)
            .addField(`${interaction.user.username} asks:`, `*"${message}"*`)
            .addField(`\nThe Magic 8 Ball says...`, `***${textResponse}***`)
            .setImage(imageResponse)


        // RANDOM WAIT TIME FOR A RESPONSE, BETWEEN 1s and 6s
        await wait(Math.floor(Math.random() * 5000) + 1000);
        
        // POSTING LINK USING VALUES FROM ABOVE
        await interaction.editReply({ embeds: [eightBallFinalEmbed] })
    }
}