const discord = require('discord.js');
const { WebhookClient }  = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'messageCreate',
	async execute(message, client) {

		// TEST SERVER
		if(message.guild.id === '530503548937699340') {
			if(message.content.includes('blacklistthistermplease')) {
				setTimeout(() => message.delete(), 0 );


				const webhookClient = client.fetchWebhook(process.env.testServerWebhookID, process.env.testServerWebhookToken)
					.then(webhook => message.channel.send(`Obtained the following webhook:\nName: ${webhook.name}\nGuild: ${webhook.sourceGuild.name}`))


				// channel.createWebhook(message.author.username, {
				// 	avatar: message.author.displayAvatarURL({ dynamic:true }),
				// })
				// 	.then(webhook => console.log(`Created webhook ${webhook}`))
				// 	.catch(console.error);
			}
		}


		// TEMPLE SERVER

    }
}