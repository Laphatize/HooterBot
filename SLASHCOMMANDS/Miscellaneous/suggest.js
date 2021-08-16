const discord = require('discord.js')
const config = require ('../../config.json')
const suggestionSchema = require('../../Database/suggestionSchema');


module.exports = {
    name: 'suggest',
    description: 'Generates a suggestion that server members will vote on to accept or reject. (🤖｜bot-spam) [60s]',
    options: [
        {
            name: `your_suggestion`,
            description: `The idea you want to suggest.`,
            type: `STRING`,
            required: true,
        },
    ],
    permissions: '',
    dmUse: false,
    cooldown: 60,
    defaultPermission: false,
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


        // INPUTS
        let userSuggestion = inputs[0]
        let suggestCh = interaction.guild.channels.cache.find(ch => ch.name === `suggestions`)


        let caseCounter = await infractionsSchema.countDocuments()


        let suggestionEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`Suggestion #${parseInt(caseCounter)+1}`)
            .setDescription(`${userSuggestion}`)

        let suggestionMsg = suggestCh.send({ embeds: [suggestionEmbed] })


        // LOG DATABASE INFORMATION
        await birthdaySchema.findOneAndUpdate({
            GUILD_ID: interaction.guild.id,
            CREATOR_ID: interaction.user.id,
            SUGGESTION_MSG_ID: suggestionMsg.id
        },{
            GUILD_ID: interaction.guild.id,
            GUILD_NAME: interaction.guild.name,
            CREATOR_ID: interaction.user.id,
            CREATOR_NAME: interaction.user.username,
            SUGGESTION_CH_ID: suggestionMsg.channel.id,
            SUGGESTION_MSG_ID: suggestionMsg.id
        },{
            upsert: true
        }).exec();


        let suggestionConfirmedEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjGREENTICK} Suggestion received!`)
            .setDescription(`View your suggestion in ${suggestCh}!`)

        interaction.reply({ embeds: [suggestionConfirmedEmbed], ephemeral: true })
    }
}