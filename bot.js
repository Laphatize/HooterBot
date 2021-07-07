require('dotenv').config();
const discord = require('discord.js')
const fs = require('fs');
const config = require ('./config.json')
const guildSchema = require('./Database/guildSchema')


// INITIALIZATION
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


// MAPS
client.configs = new Map();


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


(async() => {

    // BOT LOGGING IN
    client.login(process.env.HB_BOT_TOKEN);


    // PREP FOR PREFIX ASSIGNMENT AND CACHING
    const guilds = client.guilds.cache.array();

    // SETTING PREFIX VALUE FROM DATABASE OR DEFAULT FOR EACH GUILD
    for (const guild of guilds) {

        // DB CHECK
        const dbData = await guildSchema.findOne({
            GUILD_ID: message.guild.id
        });


        // SETTING PREFIX VALUE USING DATABASE OR DEFAULT
        if(dbData.PREFIX) {
            client.configs.set(message.guild.id, dbData) 

            console.log(`############# DATABASE ###############`);
            console.log(`Guild config map set.`);
            console.log(`######################################\n\n`);
        } else {
            console.log(`############# DATABASE ###############`);
            console.log(`ERROR: Guild config map not found.`);
            console.log(`######################################\n\n`);
        }
    }
})();


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