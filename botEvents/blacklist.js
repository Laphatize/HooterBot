const discord = require('discord.js');
const { WebhookClient }  = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'messageCreate',
	async execute(message, client) {

		// STRIPPING MESSAGE OF SPACES
		let msg = message.content.split(' ').join('');
		console.log(`msg = ${msg}`)


		// TEST SERVER
		if(message.guild.id === '530503548937699340') {
			if(message.content.includes('blacklistthistermplease')) {

				// DELETE INITIAL MESSAGE
				setTimeout(() => message.delete(), 0 );

				// FETCH WEBHOOK AND EDIT
				client.fetchWebhook(process.env.testServerWebhookID, process.env.testServerWebhookToken)
				.then(webhook => {
					webhook.edit({
						name: message.author.username,
						avatar: message.author.displayAvatarURL(),
						channel: message.channel.id,
					})
					.then(userWebhook => {
						// REDACTING BLACKLISTED TERM(S)

						// coming soon :)

						// POSTING REDACTED MESSAGE VIA WEBHOOK
						userWebhook.send({ content: 'The original message with the redacted term would go here. :)' })
						.then(webhook => {
							webhook.edit({
								name: 'blacklist filter webhook',
								avatar: 'https://lh3.googleusercontent.com/-JwjA8wq5m292e4FcVyfTS8nvgkltfnAE6aMet54OHweH48gbKJhiZ0kUM8wHpDdiiZr=s85',
							})
						})
					})
				})
			}
		}
    }
}


// FILTERING FUNCTION