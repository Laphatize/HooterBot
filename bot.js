require('dotenv').config();
const discord = require('discord.js')
const { Collection, Intents } = require('discord.js');
const fs = require('fs');
const config = require ('./config.json')




// // VARIABLES FOR TEMPLE SERVER
// let logActionsChannelId = 829726733712359476;
// let TranscriptsId  = 834441201197252648;
// let modRoleId = 835182957160300604;
// let adminRoleId = 829416550867140608;

// // VARIABLES FOR MMM TEST SERVER - SET IN CONFIG FILE
// let logActionsChannelId = 857106515156140062;
// let TranscriptsId  = 857106503438041108;
// let modRoleId = 857105754280427521;
// let adminRoleId = 588107993153929248;



// INITIALIZATION - SETMAXLISTENERS NEEDED RIGHT NOW SINCE I MADE A MISTAKE IN THE COMMAND HANDLER :'( 
const client = new discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBER_ADD,
        Intents.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
    ]
}).setMaxListeners(0)



// EVENT HANDLER
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
    // FOR ONE-TIME EVENTS
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} 
    // FOR EVERY TIME EVENTS
    else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}



// BOT LOGGING IN
client.login(process.env.HB_BOT_TOKEN);



// UNKNOWN ERROR REPORTING
process.on('unhandledRejection', err =>{
    console.log(`******** UNKNOWN ERROR *********`);
    console.log(err);
    console.log(`********************************\n`);
})