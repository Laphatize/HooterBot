const discord = require('discord.js')
const config = require ('../../config.json')
const levels = require('discord-xp');

// COMMAND ID: 871663009343369236

module.exports = {
    name: 'leaderboard',
    description: `List the top 10 XP/level users in the server. (🤖｜bot-spam) [60s]`,
    options: [],
    permissions: '',
    dmUse: false,
    cooldown: 60,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

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

        // CREATING ARRAY FOR PLACEMENT EMOJIS
        const leaderboardEmojiArray = [ `filler`, `${config.emjFirstPlace} **1ˢᵗ** `, `${config.emjSecondPlace} **2ⁿᵈ** `, `${config.emjThirdPlace} **3ʳᵈ** `, `${config.indent} **4ᵗʰ** `, `${config.indent} **5ᵗʰ** `, `${config.indent} **6** `, `${config.indent} **7ᵗʰ** `, `${config.indent} **8ᵗʰ** `, `${config.indent} **9ᵗʰ** `, `${config.indent} **10ᵗʰ** `]

        // MAPPING VALUES OF LEADERBOARD
        let lb = leaderboard.map(e => `${leaderboardEmojiArray[e.position]} **${e.username}\#${e.discriminator}**\n ${config.indent} ${config.indent} Level: ${e.level}${config.indent}XP: ${e.xp.toLocaleString()}`)
        
        let leaderboardEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`HooterBot Leaderboard`)
            .setDescription(`${lb.join(`\n`)}`)

        return interaction.reply({ embeds: [leaderboardEmbed] })
            .catch(err => console.log(err))
    }
}