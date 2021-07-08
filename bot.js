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


// BOT LOGGING IN
client.login(process.env.HB_BOT_TOKEN);


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


client.configs = new Map();

(async () => {
    // GRABBING THE GUILDS THE BOT IS IN
    const guilds = client.guilds.cache.array();
    for (const guild of guilds) {
        const guildId = guild.id;
        const guildConfig = await guildSchema.findOne({ guildId });

        console.log(`guildConfig = ${guildConfig}`)

        if(guildConfig) {
            client.configs.set(guildId, guildConfig);
            console.log(`Guild config set for ${guild.name}.`)
        } else {
            console.log(`No guild config found for ${guild.name}.\nSetting ${config.defaultPrefix} as prefix.`)
            client.configs.set(guildId, {
                guildId,
                prefix: config.defaultPrefix,
            });
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
    .setFooter('MMM, see the bot log for the full error stack.')
    .setTimestamp()
    

    // LOG ENTRY
    client.channels.cache.get(config.logActionsChannelId).send({embeds: [logErrEmbed]})
})