require('dotenv').config();
const discord = require('discord.js')
const { Collection } = require('discord.js');
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
        'GUILDS',
        'GUILD_MEMBERS',
        // 'GUILD_BANS ',
        // 'GUILD_EMOJIS',
        // 'GUILD_INTEGRATIONS',
        // 'GUILD_WEBHOOKS',
        // 'GUILD_INVITES',
        // 'GUILD_VOICE_STATES',
        // 'GUILD_PRESENCES',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        // 'GUILD_MESSAGE_TYPING',
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
        // 'DIRECT_MESSAGE_TYPING',
    ]
})



// COLLECTIONS
client.commands = new discord.Collection();
client.cooldowns = new discord.Collection();



// EVENT HANDLER
const eventFiles = fs.readdirSync('./botEvents').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./botEvents/${file}`);
    // FOR ONE-TIME EVENTS
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} 
    // FOR EVERY TIME EVENTS
    else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}


// COMMAND HANDLER
const cmdFolders = fs.readdirSync('./COMMANDS');

for (const folder of cmdFolders) {
    const cmdFiles = fs.readdirSync(`./COMMANDS/${folder}`).filter(file => file.endsWith('.js'));
	
    for (const file of cmdFiles) {
		const command = require(`./COMMANDS/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}



// BOT LOGGING IN
client.login(process.env.HB_BOT_TOKEN);



// UNKNOWN ERROR REPORTING
process.on('unhandledRejection', err =>{
    console.log(`******** UNKNOWN ERROR *********`);
    console.log(err);
    console.log(`********************************\n`);

    
    // DEFINING LOG EMBED
    let logErrEmbed = new discord.MessageEmbed()
    .setColor(config.embedDarkGrey)
    .setTitle(`An Unknown Error Has Occurred`)
    .setDescription(`\`\`\`${err}\`\`\`\nPlease inform <@${config.botAuthorId}> of this error so he can investigate (if he does not already know about this).`)
    .setTimestamp()
    

    // LOG ENTRY
    client.channels.cache.get(config.logActionsChannelId).send({embeds: [logErrEmbed]})
})