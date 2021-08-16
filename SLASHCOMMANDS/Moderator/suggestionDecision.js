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
    


        // GRAB CHANNEL, SUGGESTION
        if (!interaction.guild.channels.cache.find(ch => ch.name === 'suggestions')) {
            let suggestionChDNEembed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`I couldn't find the suggestion channel. If this is an error, please let <@${config.botAuthorId}> know.`)

            // POST EMBED
            return interaction.reply({ embeds: [suggestionChDNEembed], ephemeral: true })
        }


        const suggestionCh = interaction.guild.channels.cache.find(ch => ch.name === 'suggestions')

        
        suggestionCh.messages.fetch(dbSuggestionData.SUGGESTION_MSG_ID, false, true)
            .catch(err => {
                let suggestionDNEembed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Sorry!`)
                    .setDescription(`I couldn't find Suggestion #${suggestionNum} in the channel. Please try a different suggestion number.`)

                // POST EMBED
                return interaction.reply({ embeds: [suggestionDNEembed], ephemeral: true })
            })

            .then(chMsgs => {

                let suggestionMsg = chMsgs.get(dbSuggestionData.SUGGESTION_MSG_ID)



                console.log(`\n\n suggestionMsg:`, suggestionMsg, `\n\n`)


            })


                // let fetchedMapMsg = msg.get([dbSuggestionData.SUGGESTION_MSG_ID].content)
                
                // console.log(`fetchedMapMsg\n`, fetchedMapMsg)




            //     // ACCEPTED
            //     if(decisionVerdict == 'accept') {

            //         let suggestionEditAcceptEmbed = new discord.MessageEmbed()
            //             .setColor(config.embedGreen)
            //             .setTitle(`${config.emjGREENTICK} Suggestion #${suggestionNum}: ACCEPTED`)
            //             .setAuthor(`${origSuggesterTag}`)
            //             .setDescription(`${origSuggestionText}\n\n**Reason from ${interaction.user.tag}:**\n${decisionMsg}`)

            //         fetchedMapMsg.edit({ embeds: [suggestionEditAcceptEmbed] })
            //             .catch(err => console.log(err))
            //     }
            // })

        
            



        // // REJECTED
        // if(decisionVerdict == 'deny') {

        //     let suggestionEditDenyEmbed = new discord.MessageEmbed()
        //         .setColor(config.embedRed)
        //         .setTitle(`${config.emjREDTICK} Suggestion #${suggestionNum}: DENIED`)
        //         .setAuthor(`${origSuggesterTag}`)
        //         .setDescription(`${origSuggestionText}\n\n**Reason from ${interaction.user.tag}:**\n${decisionMsg}`)

        //     suggestionCh.messages.fetch()
        //         .then( msg => {
        //             msg.edit({ embeds: [suggestionEditDenyEmbed] })
        //         }).catch(err => console.log(err))
        // }


        // // ON HOLD
        // if(decisionVerdict == 'onhold') {

        //     let suggestionHoldEmbed = new discord.MessageEmbed()
        //         .setColor(config.embedGrey)
        //         .setTitle(`${config.emjGREYTICK} Suggestion #${suggestionNum}: ON HOLD`)
        //         .setAuthor(`${origSuggesterTag}`)
        //         .setDescription(`${origSuggestionText}\n\n**Reason from ${interaction.user.tag}:**\n${decisionMsg}`)

        //     suggestionCh.messages.fetch()
        //         .then( msg => {
        //             msg.edit({ embeds: [suggestionHoldEmbed] })
        //         }).catch(err => console.log(err))
        // }


        // // UNDER CONSIDERATION
        // if(decisionVerdict == 'underconsideration') {
            
        //     let suggestionConsideringEmbed = new discord.MessageEmbed()
        //         .setColor(config.embedGrey)
        //         .setTitle(`${config.emjGREYTICK} Suggestion #${suggestionNum}: UNDER CONSIDERATION`)
        //         .setAuthor(`${origSuggesterTag}`)
        //         .setDescription(`${origSuggestionText}\n\n**Reason from ${interaction.user.tag}:**\n${decisionMsg}`)

        //     suggestionCh.messages.fetch()
        //         .then( msg => {
        //             msg.edit({ embeds: [suggestionConsideringEmbed] })
        //         }).catch(err => console.log(err))
        // }



        // // CONFIRMATION
        // let sugDecConfirmationEmbed = new discord.MessageEmbed()
        //     .setColor(config.embedGreen)
        //     .setTitle(`${config.emjGREENTICK} Decision submitted!`)
        //     .setDescription(`Your decision on **suggestion #${suggestionNum}** has been successfully submitted.`)

        // // POST EMBED
        // return interaction.reply({ embeds: [sugDecConfirmationEmbed], ephemeral: true })
    }
}