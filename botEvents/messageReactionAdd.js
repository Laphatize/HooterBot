const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'messageReactionAdd',
	async execute(messageReaction, user, client) {

        if(messageReaction.partial) {
            try {
                await messageReaction.fetch();
            } catch (error) {
                return console.log(error);
            }
        }


        
        // FOR THE MESSAGE AND TYPE OF REACTION
        let suggestionVoteMsgId = messageReaction.message.id



	},
};