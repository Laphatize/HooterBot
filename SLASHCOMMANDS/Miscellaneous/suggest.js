const discord = require('discord.js')
const config = require ('../../config.json')
const suggestionSchema = require('../../Database/suggestionSchema');
const wait = require('util').promisify(setTimeout);


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
                .setDescription(`This command can only be run in <#${botSpamChannel.id}>. Head there and try again!`)

            // POST EMBED
            return interaction.reply({ embeds: [wrongChannel], ephemeral: true })
        }


        // INPUTS
        let userSuggestion = inputs[0]
        let suggestCh = interaction.guild.channels.cache.find(ch => ch.name === `suggestions`)


        let caseCounter = await suggestionSchema.countDocuments()


        let suggestionEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`Suggestion #${parseInt(caseCounter)+1}`)
            .setDescription(`${userSuggestion}\n\n*Suggested by: ${interaction.user.tag}*`)
            .setFooter(`[Waiting for community feedback...]`)

        suggestCh.send({ embeds: [suggestionEmbed] })
            .then(async suggestionMsg => {
                // LOG DATABASE INFORMATION
                await suggestionSchema.findOneAndUpdate({
                    GUILD_ID: interaction.guild.id,
                    CREATOR_ID: interaction.user.id,
                    SUGGESTION_MSG_ID: suggestionMsg.id
                },{
                    GUILD_ID: interaction.guild.id,
                    GUILD_NAME: interaction.guild.name,
                    CREATOR_ID: interaction.user.id,
                    CREATOR_TAG: interaction.user.tag,
                    SUGGESTION_MSG_ID: suggestionMsg.id,
                    SUGGESTION_NUM: (parseInt(caseCounter)+1),
                    SUGGESTION_TEXT: userSuggestion
                },{
                    upsert: true
                }).exec();

                try {
                    // ADDING REACTIONS
                    await suggestionMsg.react(`👍`)
                    await wait(1000)
                    await suggestionMsg.react(`👎`)
                } catch (error) {
                    let reactionError = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjREDTICK} Sorry!`)
                        .setDescription(`HooterBot ran into an error adding the voting reactions to your suggestion. Please create a <@${config.ModMailId}> ticket to let the admins know.`)
        
                    // POST EMBED
                    return interaction.reply({ embeds: [reactionError], ephemeral: true })
                }
            })



        let suggestionConfirmedEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjGREENTICK} Suggestion received!`)
            .setDescription(`View your suggestion in ${suggestCh}! If the suggestion reaches the community voting threshold, the admins will consider implementing your suggestion.`)

        interaction.reply({ embeds: [suggestionConfirmedEmbed], ephemeral: true })

        
        // DEFINING LOG EMBED
        let logSuggestionEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`New Suggestion`)
            .setDescription(`**User:** ${interaction.user}\n**ID:** ${interaction.user.id}\n**Suggestion Number:** ${parseInt(caseCounter)+1}\n**Suggestion:** ${userSuggestion}`)
            .setTimestamp()


        // LOG ENTRY
        return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logSuggestionEmbed] })
            .catch(err => console.log(err))

    }
}