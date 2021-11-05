const discord = require('discord.js');
const { WebhookClient }  = require('discord.js');
const config = require('../config.json');


module.exports = {
	name: 'messageCreate',
	async execute(message, client) {

		// DELETE INITIAL MESSAGE
		setTimeout(() => message.delete(), 0 );


		// TEST SERVER
		if(message.guild.id === '530503548937699340') {
			if(message.content.includes('blacklistthistermplease')) {

				// FETCH WEBHOOK
				client.fetchWebhook(process.env.testServerWebhookID, process.env.testServerWebhookToken)
					.then(webhook => {

						// EDIT WEBHOOK DISPLAY TO APPEAR AS USER
						webhook.edit({
							name: message.author.username,
							avatar: message.author.displayAvatarURL(),
							channel: webhook.channelId,
						})
						.then(userWebhook => {
							// REDACTING BLACKLISTED TERM(S)

							// coming soon :)

							// POSTING REDACTED MESSAGE VIA WEBHOOK
							message.channel.send({ content: 'The original message with the redacted term would go here. :)' })
						})
					})
			}
		}


		// TEMPLE SERVER

    }
}