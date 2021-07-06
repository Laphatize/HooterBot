const config = require ('../config.json')
const db = require('../utils/mongo');
const updateCache = require('./updateCache');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

		// LOGGING IN
		console.log(`\n\n========= GOING ONLINE =========`);
		console.log(`${config.botName} has logged in successfully.`);
		console.log(`================================\n\n`);

	
		// SETTING ACTIVITY STATUS
		console.log(`======= ACTIVITY STATUS ========`);
		client.user.setActivity(`verification requests`, {type: "WATCHING"});
		console.log(`${config.botName}'s activity status is set.`)
		console.log(`================================\n\n`);


		// LOADING PREFIXES FROM DB
		console.log(`===== REGISTERING PREFIXES =====`);
		updateCache.loadPrefixes(client);
		console.log(`Prefixes registered.`);
		console.log(`================================\n\n`);


		// CONNECTING TO MONGO DATABASE
		await db()
		console.log(`##### DATABASE CONNECTION ######`);
		console.log(`Mongo DB connection made.`);
		console.log(`################################\n\n`);
	},
};