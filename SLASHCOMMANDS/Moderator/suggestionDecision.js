const discord = require('discord.js')
const config = require ('../../config.json')
const suggestionSchema = require('../../Database/suggestionSchema');
const moment = require('moment');


module.exports = {
    name: 'suggestion_decision',
    description: `MODERATOR | Provide a response to a suggestion. (#suggestions)`,
    options: [
        {
            name: `number`,
            description: `The suggestion number being decided.`,
            type: `INTEGER`,
            required: true,
        },{
            name: `decision`,
            description: `The decision being given to the suggestion.`,
            type: `STRING`,
            required: true,
            choices: [
                {
                    name: `accept`,
                    value: `accept`,
                },{
                    name: `deny`,
                    value: `deny`,
                },{
                    name: `on-hold`,
                    value: `onhold`,
                },{
                    name: `under-consideration`,
                    value: `underconsideration`,
                }
            ]
        }, {
            name: `response`,
            description: `Feedback or a response to the suggestion and why this decision is being made.`,
            type: `STRING`,
            required: true
        }
    ],
    permissions: 'MANAGE_MESSAGES', // MODERATOR
    dmUse: false,
    cooldown: 0,
    defaultPermission: false,
    run: async(client, interaction, inputs) => {

        // BOT-SPAM CHANNEL ONLY
        if(interaction.channel.name !== 'suggestions') {

            let suggestionsCh = interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'suggestions')

            let wrongChannel = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`This command can only be run in ${suggestionsCh}. Head there and try again!`)

            // POST EMBED
            return interaction.reply({ embeds: [wrongChannel], ephemeral: true })
        }

        var suggestionsChannel = interaction.guild.channels.cache.find(ch => ch.name === `suggestions`)


        // GRABBING SLASH COMMAND INPUT VALUES
        const suggestionNum = inputs[0];
        const decisionVerdict = inputs[1];
        const decisionMsg = inputs[2];


        // SEARCHING DATABASE USING SUGGESTIONNUM TO GET SUGGESTION
        const dbSuggestionData = await suggestionSchema.findOne({
            SUGGESTION_NUM: suggestionNum,
            GUILD_ID: interaction.guild.id
        }).exec();
        

        // IF NO SUGGESTION NUMBER ENTERED EXISTS
        if(!dbSuggestionData){
            let suggestionDNEembed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`I couldn't find **Suggestion #${suggestionNum}** in the database. Please try a different suggestion number.`)

            // POST EMBED
            return interaction.reply({ embeds: [suggestionDNEembed], ephemeral: true })
        }

        
        // A YES/NO DECISION ALREADY MADE ON THIS SUGGESTION
        if(dbSuggestionData.DECISION == 'ACCEPTED' || dbSuggestionData.DECISION == 'DENIED') {
            let decisionAlreadyMadeEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`**Suggestion #${suggestionNum}** has already been given feedback.`)

            // POST EMBED
            return interaction.reply({ embeds: [decisionAlreadyMadeEmbed], ephemeral: true }) 
        }


        // NO FINAL SUGGESTION MADE
        if(!dbSuggestionData.DECISION || dbSuggestionData.DECISION == 'HOLD' || dbSuggestionData.DECISION == 'CONSIDERING') {
            // GRAB SUGGESTION DATA
            let origSuggesterTag = dbSuggestionData.CREATOR_TAG;
            let origSuggestionText = dbSuggestionData.SUGGESTION_TEXT;
        
            // UPDATED EMBED
            let suggestionUpdatedEmbed
            

            // ACCEPTED
            if(decisionVerdict == 'accept') {

                suggestionUpdatedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Suggestion #${suggestionNum}: ACCEPTED`)
                    .setAuthor(`${origSuggesterTag}`)
                    .setDescription(`${origSuggestionText}\n\n**Staff response from ${interaction.user.tag}:**\n${decisionMsg}\n**On:** <t:${moment().unix()}:R>`)

                // STORING IN DATABASE THE SUGGESTION DECISION
                await suggestionSchema.findOneAndUpdate({
                    // CONTENT USED TO FIND UNIQUE ENTRY
                    SUGGESTION_NUM: suggestionNum,
                    GUILD_ID: interaction.guild.id
                },{
                    // CONTENT TO BE UPDATED
                    DECISION: `ACCEPTED`
                },{ 
                    upsert: true
                }).exec();
            }

            // REJECTED
            if(decisionVerdict == 'deny') {

                suggestionUpdatedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Suggestion #${suggestionNum}: DENIED`)
                    .setAuthor(`${origSuggesterTag}`)
                    .setDescription(`${origSuggestionText}\n\n**Staff response from ${interaction.user.tag}:**\n${decisionMsg}\n**On:** <t:${moment().unix()}:R>`)

                // STORING IN DATABASE THE SUGGESTION DECISION
                await suggestionSchema.findOneAndUpdate({
                    // CONTENT USED TO FIND UNIQUE ENTRY
                    SUGGESTION_NUM: suggestionNum,
                    GUILD_ID: interaction.guild.id
                },{
                    // CONTENT TO BE UPDATED
                    DECISION: `DENIED`
                },{ 
                    upsert: true
                }).exec();
            }

            // ON HOLD
            if(decisionVerdict == 'onhold') {

                suggestionUpdatedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`${config.emjGREYTICK} Suggestion #${suggestionNum}: ON HOLD`)
                    .setAuthor(`${origSuggesterTag}`)
                    .setDescription(`${origSuggestionText}\n\n**Staff response from ${interaction.user.tag}:**\n${decisionMsg}\n**On:** <t:${moment().unix()}:R>`)

                // STORING IN DATABASE THE SUGGESTION DECISION
                await suggestionSchema.findOneAndUpdate({
                    // CONTENT USED TO FIND UNIQUE ENTRY
                    SUGGESTION_NUM: suggestionNum,
                    GUILD_ID: interaction.guild.id
                },{
                    // CONTENT TO BE UPDATED
                    DECISION: `HOLD`
                },{ 
                    upsert: true
                }).exec();
            }

            // UNDER CONSIDERATION
            if(decisionVerdict == 'underconsideration') {
                
                suggestionUpdatedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`${config.emjGREYTICK} Suggestion #${suggestionNum}: UNDER CONSIDERATION`)
                    .setAuthor(`${origSuggesterTag}`)
                    .setDescription(`${origSuggestionText}\n\n**Staff response from ${interaction.user.tag}:**\n${decisionMsg}\n**On:** <t:${moment().unix()}:R>`)

                // STORING IN DATABASE THE SUGGESTION DECISION
                await suggestionSchema.findOneAndUpdate({
                    // CONTENT USED TO FIND UNIQUE ENTRY
                    SUGGESTION_NUM: suggestionNum,
                    GUILD_ID: interaction.guild.id
                },{
                    // CONTENT TO BE UPDATED
                    DECISION: `CONSIDERING`
                },{ 
                    upsert: true
                }).exec();
            }



            // GETTING THE VERIFICATION PROMPT CHANNEL ID FROM DATABASE
            await suggestionsChannel.messages.fetch(dbSuggestionData.SUGGESTION_MSG_ID)
                .then(msg => {
                    msg.edit({ embeds: [suggestionUpdatedEmbed] })
                })
                .catch(err => console.log(err))

            
            // CONFIRMATION MESSAGE ON EDIT
            let sugDecConfirmationEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} Decision submitted!`)
                .setDescription(`Your decision on **suggestion #${suggestionNum}** has been successfully submitted.`)

            // POST EMBED
            interaction.reply({ embeds: [sugDecConfirmationEmbed], ephemeral: true })
                .catch(err => {
                    let suggestionDNEembed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjREDTICK} Sorry!`)
                        .setDescription(`I couldn't find **Suggestion #${suggestionNum}** in the channel. Please try a different suggestion number.`)

                    // POST EMBED
                    return interaction.reply({ embeds: [suggestionDNEembed], ephemeral: true })
                })
        }
    }
}