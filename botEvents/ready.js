const config = require ('../config.json');
const db = require('../Utilities/mongo');
import { arrayOfSlashCmds } from './bot.js'


module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

		// LOGGING IN
		console.log(`\n\n============ GOING ONLINE ============`);
		console.log(`${config.botName} has logged in successfully.`);
		console.log(`======================================\n\n`);


		// READY
		console.log(`======================================`);
		console.log(`===== REGISTERING SLASH COMMANDS =====`);

		// GUILD SLASH COMMANDS - MMM789 TEST SERVER ID = 530503548937699340
		await client.guilds.cache.get('530503548937699340').commands.set(arrayOfSlashCmds)

		console.log(`======================================\n\n`);


		// SETTING ACTIVITY STATUS
		console.log(`========== ACTIVITY STATUS ===========`);
		client.user.setActivity(`verification requests | $help`, {type: "WATCHING"});
		console.log(`${config.botName}'s activity status is set.`)
		console.log(`======================================\n\n`);


		// CONNECTING TO MONGO DATABASE
		await db()
		console.log(`######## DATABASE CONNECTION #########`);
		console.log(`Mongo DB connection made.`);
		console.log(`######################################\n\n`);


		// READY
		console.log(`======================================`);
		console.log(`======== HOOTERBOT IS ONLINE =========`);
		console.log(`======================================\n\n`);

	},
};