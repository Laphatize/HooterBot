require('dotenv').config();
const discord = require('discord.js')
const fs = require('fs');
const config = require ('./config.json')
const guildSchema = require('./Database/guildSchema')
const birthdaySchema = require('./Database/birthdaySchema')
const ticketSchema = require('./Database/ticketSchema')
var cron = require('node-cron');
const moment = require('moment');


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
    ],
    partials: ['CHANNEL', 'MESSAGE']
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


// UNKNOWN ERROR REPORTING
process.on('unhandledRejection', err => {
    console.log(`******** UNKNOWN ERROR *********`);
    console.log(err);
    console.log(`********************************\n`);

    
    // DEFINING LOG EMBED
    let logErrEmbed = new discord.MessageEmbed()
        .setColor(config.embedDarkGrey)
        .setTitle(`${config.emjERROR} An Unknown Error Has Occurred`)
        .setDescription(`\`\`\`${err}\`\`\`\nPlease inform <@${config.botAuthorId}> of this error so he can investigate (if he does not already know about this).`)
        .setFooter('MMM, see the bot log for the full error stack.')
        .setTimestamp()
    

    // LOG ENTRY
    client.channels.cache.get(config.logActionsChannelId).send({embeds: [logErrEmbed]})
})



// CRON JOBS
// SCHEDULER FORMAT: (Second) (Minute) (Hour) (Day of Month) (Month) (Day of Week)
// BIRTHDAY CHECKS - EVERY DAY AT 8:00AM EST
cron.schedule('00 01 13 * * *', async () => {
    
    console.log('Checking for birthdays today.');

    
    // TODAY'S DATE
    todayDay = moment(Date.now()).utcOffset(-4).format("DD")
    todayMonth = moment(Date.now()).utcOffset(-4).format("MM")


    // CHECK DATABASE FOR ENTRY
    const dbBirthdayData = await birthdaySchema.find({
        MONTH: todayMonth,
        DAY: todayDay
    }).exec();


    // IF NO BIRTHDAYS, DO NOTHING
    if(!dbBirthdayData) {
        console.log(`No birthdays today.`)
    }


    // HANDLING BIRTHDAYS - THERE COULD BE MULTIPLE ON THE SAME DAY, SO FOREACH
    dbBirthdayData.forEach(dbBirthdayData => {
        
        // FETCH USER BY THEIR ID
        const bdayUser = await guild.members.fetch(dbBirthdayData.USER_ID)


        // FUNCTION THAT GENERATES THE RANDOM START OF THE WELCOME MESSAGE
        function bdayMessage(bdayUser) {
            const channelMsgStart = [
                `🥳 **Happy birthday, ${bdayUser}!** 🎂`,
                `🥳 **Please wish ${bdayUser} a happy birthday!** 🎁`,
                `🥳 **It's ${bdayUser}'s birthday today!** 🎉`,
                `🎂 **Happy birthday, ${bdayUser}!** 🎉`,
                `🎉 **Please wish ${bdayUser} a happy birthday!** 🎁`,
                `🎂 **It's ${bdayUser}'s birthday today!** 🎉`,
                ];      
            return channelMsgStart[Math.floor(Math.random() * channelMsgStart.length)];
        }
        
        // FETCH BOT CHANNEL
        client.channels.cache.find(ch => ch.name === `🤖｜bot-spam`).send({ content: bdayMessage(bdayUser) })
            .catch(err => console.log(err))
    })


    

    console.log(`\ndbBirthdayData = ${dbBirthdayData}\n`)

}, {
    scheduled: true,
    timezone: "America/New_York"
});

// BIRTHDAY ROLE REMOVAL - EVERY DAY AT 7:59AM EST
cron.schedule('00 59 07 * * *', async () => {
    console.log('Removing birthday roles.');
    
    // TODAY'S DATE
    todayDate = moment(Date.now()).utcOffset(-4).format("dddd, MMMM DD, YYYY")



}, {
    scheduled: true,
    timezone: "America/New_York"
});









// todayDate = moment(Date.now()).add(7, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")