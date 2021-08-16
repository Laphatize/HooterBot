const discord = require('discord.js')
const config = require ('../../config.json')
const suggestionSchema = require('../../Database/suggestionSchema');


module.exports = {
    name: 'suggestion_decision',
    description: `MODERATOR | Provide a response to a suggestion.`,
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
            name: `message`,
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

        // GRABBING SLASH COMMAND INPUT VALUES
        const suggestionNum = inputs[0];
        const decisionVerdict = inputs[1];
        const decisionMsg = inputs[2];


        // SEARCHING DATABASE USING SUGGESTIONNUM TO GET SUGGESTION
        const dbSuggestionData = await suggestionSchema.find({
            SUGGESTION_NUM: suggestionNum
        }).exec();
        

        // IF NO SUGGESTION NUMBER ENTERED EXISTS
        if(dbSuggestionData == ''){
            let suggestionDNEembed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`I couldn't find Suggestion #${suggestionNum} in the database. Please try a different suggestion number.`)

            // POST EMBED
            return interaction.reply({ embeds: [suggestionDNEembed], ephemeral: true })
        }


        // GRAB SUGGESTION DATA
        let origSuggesterId = dbSuggestionData.CREATOR_ID;
        let origSuggesterTag = dbSuggestionData.CREATOR_TAG;
        let origSuggestionText = dbSuggestionData.SUGGESTION_TEXT;
        let suggestionChId = dbSuggestionData.SUGGESTION_CH_ID;
        let origSuggestionMsgId = dbSuggestionData.SUGGESTION_MSG_ID;


        // GRAB CHANNELS
        let suggestionCh = interaction.guild.channels.cache.find(ch => ch.name === 'suggestions')
        let suggestionDecisionsCh = interaction.guild.channels.cache.find(ch => ch.name == `suggestions-decisions`)

        let origSuggester = client.users.fetch(origSuggesterId)

        
        console.log(`suggestionCh          = ${suggestionCh}`)
        console.log(`suggestionDecisionsCh = ${suggestionDecisionsCh}`)


        // ACCEPTED
        if(decisionVerdict == 'accept') {
            suggestionCh.messages.fetch(origSuggestionMsgId)
                .then(msg => {

                    let suggestionEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`${config.emjGREENTICK} Suggestion #${suggestionNum}: ACCEPTED`)
                        .setAuthor(origSuggester.tag, origSuggester.displayAvatarURL({ dynamic:true }))
                        .setDescription(`${origSuggestionText}\n\n**Reason from ${interaction.user.tag}:**\n${decisionMsg}`)

                    msg.edit({ embeds: suggestionEmbed})
                })
            // SEND NOTICE TO SUGGESTION DECISIONS CHANNEL
            let suggestionEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} Suggestion #${suggestionNum}: ACCEPTED`)
                .setAuthor(origSuggester.tag, origSuggester.displayAvatarURL({ dynamic:true }))
                .setDescription(`${origSuggestionText}\n\n**Reason from ${interaction.user.tag}:**\n${decisionMsg}`)

            suggestionDecisionsCh.send({ embeds: suggestionEmbed})
        }

        // REJECTED
        if(decisionVerdict == 'deny') {
            suggestionCh.messages.fetch(origSuggestionMsgId)
                .then(msg => {

                    let suggestionEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjREDTICK} Suggestion #${suggestionNum}: DENIED`)
                        .setAuthor(origSuggester.tag, origSuggester.displayAvatarURL({ dynamic:true }))
                        .setDescription(`${origSuggestionText}\n\n**Reason from ${interaction.user.tag}:**\n${decisionMsg}`)

                    msg.edit({ embeds: suggestionEmbed})
                })
            // SEND NOTICE TO SUGGESTION DECISIONS CHANNEL
            let suggestionEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Suggestion #${suggestionNum}: DENIED`)
                .setAuthor(origSuggester.tag, origSuggester.displayAvatarURL({ dynamic:true }))
                .setDescription(`${origSuggestionText}\n\n**Reason from ${interaction.user.tag}:**\n${decisionMsg}`)

            suggestionDecisionsCh.send({ embeds: suggestionEmbed})
        }

        // ON HOLD
        if(decisionVerdict == 'onhold') {
            suggestionCh.messages.fetch(origSuggestionMsgId)
                .then(msg => {

                    let suggestionEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGrey)
                        .setTitle(`${config.emjGREYTICK} Suggestion #${suggestionNum}: ON HOLD`)
                        .setAuthor(origSuggester.tag, origSuggester.displayAvatarURL({ dynamic:true }))
                        .setDescription(`${origSuggestionText}\n\n**Reason from ${interaction.user.tag}:**\n${decisionMsg}`)

                    msg.edit({ embeds: suggestionEmbed})
                })
        }

        // UNDER CONSIDERATION
        if(decisionVerdict == 'underconsideration') {
            suggestionCh.messages.fetch(origSuggestionMsgId)
                .then(msg => {

                    let suggestionEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGrey)
                        .setTitle(`${config.emjGREYTICK} Suggestion #${suggestionNum}: UNDER CONSIDERATION`)
                        .setAuthor(origSuggester.tag, origSuggester.displayAvatarURL({ dynamic:true }))
                        .setDescription(`${origSuggestionText}\n\n**Reason from ${interaction.user.tag}:**\n${decisionMsg}`)

                    msg.edit({ embeds: suggestionEmbed})
                })
        }


        // CONFIRMATION
        let sugDecConfirmationEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjGREENTICK} Decision submitted!`)
            .setDescription(`Your decision on suggestion #${suggestionNum} has been successfully submitted.`)

        // POST EMBED
        return interaction.reply({ embeds: [sugDecConfirmationEmbed], ephemeral: true })
    }
}