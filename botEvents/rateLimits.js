const config = require ('../config.json');


module.exports = {
	name: 'rateLimit',
	once: true,
	async execute(rateLimitData, client) {

		// LOGGING IN
		console.log(`\n\n!!!!!!!!!!!! RATE LIMITED !!!!!!!!!!!!`);
		console.log(`${config.botName} HAS BEEN RATELIMITED.`);
        console.log(`TIMEOUT: ${rateLimitData.timeout} (ms)`);
        console.log(`LIMIT: ${rateLimitData.limit} requests at this endpoint`);
        console.log(`METHOD: ${rateLimitData.method}`);
        console.log(`PATH: ${rateLimitData.path}`);
        console.log(`ROUTE: ${rateLimitData.route}`);
        console.log(`GLOBAL: ${rateLimitData.global}`);
		console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n`);


        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedGrey)
            .setTitle(`API RATELIMIT ON HOOTERBOT`)
            .setDescription(`**TIMEOUT:** ${rateLimitData.timeout} (ms)\n**LIMIT:** ${rateLimitData.limit} requests at this endpoint\n**METHOD:** ${rateLimitData.method}\n**PATH:** ${rateLimitData.path}\n**ROUTE:** ${rateLimitData.route}\n**GLOBAL?** ${rateLimitData.global}`)
            .setTimestamp()

        // LOG ENTRY
        client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logEmbed], content: `<@${config.botAuthorId}>` })
	},
};