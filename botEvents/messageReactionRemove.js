const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'messageReactionRemove',
	async execute(messageReaction, user, client) {

        if(messageReaction.partial) {
            try {
                await messageReaction.fetch();
            } catch (error) {
                return console.log(error);
            }
        }

        messageReaction.channel.send(`A reaction was removed. Did it bring the suggestion to the vote threshold for consideration?`)
        
        // FOR THE MESSAGE AND TYPE OF REACTION
        let suggestionVoteMsgId = messageReaction.message.id



	},
};