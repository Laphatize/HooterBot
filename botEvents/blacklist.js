const discord = require('discord.js');
const { WebhookClient }  = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'messageCreate',
	async execute(message, client) {

		// TEST SERVER
		if(message.guild.id === '530503548937699340') {
			if(message.content.includes('blacklistthistermplease')) {

				// DELETE INITIAL MESSAGE
				setTimeout(() => message.delete(), 0 );

				// FETCH WEBHOOK AND EDIT
				client.fetchWebhook(process.env.testServerWebhookID, process.env.testServerWebhookToken)
				.then(webhook => {
					console.log(`webhook fetched`)
					webhook.edit({
						name: message.author.username,
						avatar: message.author.displayAvatarURL(),
						channel: message.channel.id,
					})
					.then(userWebhook => {
						console.log(`webhook edited, posting`)
						// REDACTING BLACKLISTED TERM(S)

						// coming soon :)

						// POSTING REDACTED MESSAGE VIA WEBHOOK
						userWebhook.send({ content: 'The original message with the redacted term would go here. :)' })
					})
				})
			}
		}


		// TEMPLE SERVER

    }
}