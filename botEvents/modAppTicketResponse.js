const discord = require('discord.js');
const config = require ('../config.json');


module.exports = {
    // FOLLOW-UP QUESTIONS
	name: 'messageCreate',
	async execute(message, client) {

        // MESSAGES IN THE USER'S MOD APP CHANNEL
        if(message.channel.name == `modApp-${message.author.username.toLowerCase()}-${message.author.id}`) {
            // IGNORE HOOTERBOT'S OWN MESSAGES
            if(message.author.bot)   return;

            message.channel.send({ content: `I see you've responded.` })
        }
    }
}