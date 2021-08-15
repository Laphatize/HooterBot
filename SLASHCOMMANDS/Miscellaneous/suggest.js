const discord = require('discord.js')
const config = require ('../../config.json')
const suggestionSchema = require('../../Database/suggestionSchema');


module.exports = {
    name: 'suggest',
    description: 'Generates a suggestion that server members will vote on to accept or reject.',
    options: [
        {
            name: `your_suggestion`,
            description: `The idea you want to suggest.`,
            type: `INTEGER`,
            required: true,
        },
    ],
    permissions: '',
    dmUse: false,
    cooldown: 0,
    defaultPermission: false,
    run: async(client, interaction, inputs) => {

        let userSuggestion = inputs[0]
        let suggestCh = interaction.guild.channels.cache.find(ch => ch.name === `suggestions`)

        


        let suggestionMsg = suggestCh.send({ content: [] })


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




    }
}