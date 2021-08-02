const discord = require('discord.js')
const config = require ('../../config.json')
const levels = require('discord-xp');

module.exports = {
    name: 'leaderboard',
    description: `List the top XP users in the server. Only valid in "🤖｜bot-spam" channel. [CD: 60s]`,
    options: [],
    permissions: '',
    cooldown: 60,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {
        
        
        // BOT-SPAM CHANNEL ONLY
        if(interaction.channel.name !== '🤖｜bot-spam') {

            let botSpamChannel = interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === '🤖｜bot-spam')

            let wrongChannel = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`I can only post this embed in <#${botSpamChannel.id}>. Head there and try again!`)

            // POST EMBED
            return interaction.reply({ embeds: [wrongChannel], ephemeral: true })
        }


        const rawLeaderboard = await levels.fetchLeaderboard(interaction.guild.id, 10);

        // IF NO USERS IN LEADERBOARD
        if (rawLeaderboard.length < 1) {
            // CREATING EMBED FOR RESPONSE        
            let emptyLeaderboardEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`There are no users in the leaderboard. Has anyone sent a message yet?`)
                .setFooter(`If this is a bug, please submit a ModMail ticket to inform ${config.botAuthorUsername}.`)

            // POST EMBED
            return interaction.reply({ embeds: [emptyLeaderboardEmbed], ephemeral: true })
            .catch(err => console.log(err))
        }


        // PROCESS LEADERBOARD
        const leaderboard = await levels.computeLeaderboard(client, rawLeaderboard, true)


        // MAPPING VALUES OF LEADERBOARD
        let lb = leaderboard.map(e => `**${placementEmojiPicker[e]}${e.position}${config.indent}${e.username}\#${e.discriminator}**\n${config.indent}Level: ${e.level}${config.indent}XP: ${e.xp.toLocaleString()}`)

        let leaderboardEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`HooterBot Leaderboard`)
            .setDescription(`${lb.join(`\n`)}`)

        return interaction.reply({ embeds: [leaderboardEmbed] })
            .catch(err => console.log(err))
    }
}




function placementEmojiPicker(e) {
    switch(e){
        case 0:
            config.emjFirstPlace
            break;
        case 1:
            config.emjSecondPlace
            break;
        case 2:
            config.emjThirdPlace
            break;
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            config.indent
            break;
    }
}