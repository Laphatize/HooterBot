require('dotenv').config();
const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const config = require ('./config.json')
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



/***********************************************************/
/*      EVENT HANDLER                                      */
/***********************************************************/
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



/***********************************************************/
/*      COMMAND HANDLER                                    */
/***********************************************************/
const cmdFolders = fs.readdirSync('./COMMANDS');

for (const folder of cmdFolders) {
    const cmdFiles = fs.readdirSync(`./COMMANDS/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of cmdFiles) {
		const command = require(`./COMMANDS/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}



/***********************************************************/
/*      UNKNOWN ERROR REPORTING                            */
/***********************************************************/
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
    client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({embeds: [logErrEmbed]})
})



/***********************************************************/
/*      CRON JOBS                                          */
/***********************************************************/
// SCHEDULER FORMAT: *(Second) *(Minute) *(Hour) *(Day of Month) *(Month) *(Day of Week)

// BIRTHDAY CHECKS
// EVERY DAY AT 8:00AM EST
cron.schedule('00 00 08 * * *', async () => {
    
    console.log('Checking for birthdays...');

    
    // TODAY'S DATE
    todayDay = moment(Date.now()).utcOffset(-4).format("DD")
    todayMonth = moment(Date.now()).utcOffset(-4).format("MM")


    // CHECK DATABASE FOR ENTRY
    const dbBirthdayData = await birthdaySchema.find({
        MONTH: todayMonth,
        DAY: todayDay
    }).exec();


    if(dbBirthdayData) {
        // DEFINING A NEW ARRAY TO STORE THE BIRTHDAYS FROM THE DATABASE
        var result = []


        // FOR LOOP TO GRAB ID'S OF TODAY'S BIRTHDAYS FROM DATABASE
        for(let i in dbBirthdayData) {
            result.push(dbBirthdayData[i].USER_ID)
        }


        // THE "result" ARRAY HAS ALL THE DAY'S BIRTHDAYS, LOOP
        result.forEach( id => {
            
            // CREATE RANDOM BIRTHDAY MESSAGE USING FUNCTION
            bdayMessage = createBdayMessage(id);

            // DEFINE GUILD BY NAME, FETCHING BDAY ROLE
            guild = client.guilds.cache.find(guild => guild.name === 'MMM789 Test Server')

            // FETCH BOT CHANNEL OF GUILD AND SEND MESSAGE
            guild.channels.cache.find(ch => ch.name === `🤖｜bot-spam`).send({ content: `${bdayMessage}` })
                .catch(err => console.log(err))
 

            // FETCH BIRTHDAY USER BY ID, GIVE ROLE
            bdayUser = guild.members.fetch(id)
                .then(user => {
                    bdayRole = guild.roles.cache.find(role => role.name.toLowerCase().startsWith('birthday'))
                
                    user.roles.add(bdayRole)
                })
        })
    }
}, {
    scheduled: true,
    timezone: "America/New_York"
});


// FUNCTION TO PICK RANDOM BDAY MESSAGE
function createBdayMessage(bdayUserId) {
    const bdayMessagePicker = [
        `🥳 **Happy birthday, <@${bdayUserId}>!** 🎂`,
        `🥳 **Please wish <@${bdayUserId}> a happy birthday!** 🎁`,
        `🥳 **It's <@${bdayUserId}>'s birthday today!** 🎉`,
        `🎂 **Happy birthday, <@${bdayUserId}>!** 🎉`,
        `🎉 **Please wish <@${bdayUserId}> a happy birthday!** 🎁`,
        `🎂 **It's <@${bdayUserId}>'s birthday today!** 🎉`,
        ];      
    return bdayMessagePicker[Math.floor(Math.random() * bdayMessagePicker.length)];
}


// BIRTHDAY ROLE REMOVAL
// EVERY DAY AT 7:59AM EST
cron.schedule('00 59 07 * * *', async () => {
    console.log('Removing birthday roles.');

    // TODAY'S DATE
    yesterdayDay = moment(Date.now()).subtract(1, 'days').utcOffset(-4).format("DD")
    yesterdayMonth = moment(Date.now()).subtract(1, 'days').utcOffset(-4).format("MM")


    // CHECK DATABASE FOR ENTRY
    const dbBirthdayData = await birthdaySchema.find({
        MONTH: yesterdayMonth,
        DAY: yesterdayDay
    }).exec();


    if(dbBirthdayData) {

        // DEFINING A NEW ARRAY TO STORE THE BIRTHDAYS FROM THE DATABASE
        var result = []


        // FOR LOOP TO GRAB ID'S OF YESTERDAY'S BIRTHDAYS FROM DATABASE
        for(let i in dbBirthdayData) {
            result.push(dbBirthdayData[i].USER_ID)
        }


        // THE "result" ARRAY HAS ALL THE DAY'S BIRTHDAYS, LOOP
        result.forEach( id => {

            // DEFINE GUILD BY NAME, FETCHING BDAY ROLE
            guild = client.guilds.cache.find(guild => guild.name === 'MMM789 Test Server')
 

            // FETCH BIRTHDAY USER BY ID, GIVE ROLE
            bdayUser = guild.members.fetch(id)
                .then(user => {
                    bdayRole = guild.roles.cache.find(role => role.name.toLowerCase().startsWith('birthday'))
                
                    user.roles.remove(bdayRole)
                })
        })
    }
}, {
    scheduled: true,
    timezone: "America/New_York"
});


// VERIFICATION TICKETS - FIRST REMINDER (2 DAYS AFTER STARTING)
// EVERY DAY AT 10:00:00AM EST
cron.schedule('00 * * * * *', async () => {
    console.log('Finding verification tickets that are 2 days old to send first reminder.');

    // GETTING TICKETS WHO CLOSE IN 5 DAYS (2 DAYS OLD NOW)
    fiveDaysLeft = moment(Date.now()).add(5, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")


    // CHECK DATABASE FOR ENTRY
    const dbTicketData = await ticketSchema.find({
        TICKET_CLOSE: fiveDaysLeft
    }).exec();


    if(dbTicketData) {

        // DEFINING A NEW ARRAY TO STORE THE BIRTHDAYS FROM THE DATABASE
        var result = []


        // FOR LOOP TO GRAB ID'S OF THE USERS WHO ARE GETTING DAY 2 REMINDERS
        for(let i in dbTicketData) {
            result.push(dbTicketData[i].CREATOR_ID)
        }


        // THE "result" ARRAY HAS ALL THE IDs FOR USERS RECEIVING DAY 2 REMINDER
        result.forEach( id => {

            // DEFINE GUILD BY NAME, FETCHING BDAY ROLE
            guild = client.guilds.cache.find(guild => guild.name === 'MMM789 Test Server')


            // FETCH USER BY ID
            client.users.fetch(id)
                .then(user => {

                    // GENERATE AND SEND REMINDER EMBED
                    let reminderEmbed = new discord.MessageEmbed()
                        .setColor(config.embedBlurple)
                        .setTitle(`Ticket Closes in 5 Days`)
                        .setDescription(`Hi **${user.username}**, if you have already submitted your verification proof and are awaiting a response, please disregard this message.
                            \nYou are receiving this reminder because your ticket will close automatically on **${twoDaysOld}**.
                            \nPlease let us know if you have any questions about verifying by sending a message here in DMs to the bot. If you are no longer interested in the verified role, please click the red **"Quit Verification"** button and confirm you want to close the ticket
                            \nThank you!`)
                        .setTimestamp()
                        .setFooter(`This is an automated reminder message.`)

                    let QuitButton = new MessageButton()
                        .setLabel("Quit Verification")
                        .setStyle("DANGER")
                        .setCustomId("quit_DM")
                        .setDisabled(false)

                    // BUTTON ROWS
                    let quitButtonRow = new MessageActionRow()
                    .addComponents(
                        QuitButton
                    );

                    user.send({embeds: [reminderEmbed], components: [quitButtonRow] })


                    client.users.fetch( user.id )
                        .then(user => {
                            // FETCHING USER'S TICKET CHANNEL IN GUILD
                            let ticketChannel = client.channels.cache.find(ch => ch.name === `verify-${user.username.toLowerCase()}`);


                            // GENERATE NOTICE EMBED
                            let firstReminderTicketChEmbed = new discord.MessageEmbed()
                                .setColor(config.embedGrey)
                                .setDescription(`${config.botName} has automatically sent **${user.username}** the initial reminder message in their DMs because this ticket closes in 5 days.`)


                            // SEND MESSAGE IN TICKET CHANNEL INFORMING THAT THE USER HAS SELECTED THE PHYSICAL TUID CARD OPTION
                            ticketChannel.send({embeds: [firstReminderTicketChEmbed]})
                                .catch(err => console.log(err))
                        })
                })
        })
    }
}, {
    scheduled: true,
    timezone: "America/New_York"
});


// VERIFICATION TICKETS - CLOSE NOTICE TICKET 
// EVERY DAY AT 10:00:30AM EST
cron.schedule('30 * * * * *', async () => {
    console.log('Finding verification tickets that are 6 days old to send close notice.');

    // GETTING TICKETS WHO CLOSE IN 1 DAYS (6 DAYS OLD NOW)
    oneDayLeft = moment(Date.now()).add(1, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")


    // CHECK DATABASE FOR ENTRY
    const dbTicketData = await ticketSchema.find({
        TICKET_CLOSE: oneDayLeft
    }).exec();


    if(dbTicketData) {

        // DEFINING A NEW ARRAY TO STORE THE BIRTHDAYS FROM THE DATABASE
        var result = []


        // FOR LOOP TO GRAB ID'S OF THE USERS WHO ARE GETTING DAY 2 REMINDERS
        for(let i in dbTicketData) {
            result.push(dbTicketData[i].CREATOR_ID)
        }


        // THE "result" ARRAY HAS ALL THE IDs FOR USERS RECEIVING DAY 2 REMINDER
        result.forEach( id => {

            // DEFINE GUILD BY NAME, FETCHING BDAY ROLE
            guild = client.guilds.cache.find(guild => guild.name === 'MMM789 Test Server')


            // FETCH USER BY ID
            client.users.fetch(id)
                .then(user => {

                    // GENERATE AND SEND REMINDER EMBED
                    let reminderEmbed = new discord.MessageEmbed()
                        .setColor(config.embedBlurple)
                        .setTitle(`Ticket Closes Tomorrow`)
                        .setDescription(`Hi **${user.username}**, if you have already submitted your verification proof and are awaiting a response, please disregard this message.
                            \nYour verification ticket has been open for 6 days and **will be closed automatically *tomorrow***.
                            \nPlease let us know if you have any questions about verifying by sending a message here in DMs to the bot. If you are no longer interested in the verified role, please click the red **"Quit Verification"** button and confirm you want to close the ticket.
                            \nThank you!`)
                        .setTimestamp()
                        .setFooter(`This is an automated reminder message.`)

                    let QuitButton = new MessageButton()
                        .setLabel("Quit Verification")
                        .setStyle("DANGER")
                        .setCustomId("quit_DM")
                        .setDisabled(false)

                    // BUTTON ROWS
                    let quitButtonRow = new MessageActionRow()
                    .addComponents(
                        QuitButton
                    );

                    user.send({embeds: [reminderEmbed], components: [quitButtonRow] })


                    client.users.fetch( user.id )
                        .then(user => {
                            // FETCHING USER'S TICKET CHANNEL IN GUILD
                            let ticketChannel = client.channels.cache.find(ch => ch.name === `verify-${user.username.toLowerCase()}`);


                            // GENERATE NOTICE EMBED
                            let firstReminderTicketChEmbed = new discord.MessageEmbed()
                                .setColor(config.embedGrey)
                                .setDescription(`${config.botName} has automatically sent **${user.username}** the pending close notice in their DMs because this ticket closes **tomorrow**.`)


                            // SEND MESSAGE IN TICKET CHANNEL INFORMING THAT THE USER HAS SELECTED THE PHYSICAL TUID CARD OPTION
                            ticketChannel.send({embeds: [firstReminderTicketChEmbed]})
                                .catch(err => console.log(err))
                        })
                })
        })
    }
}, {
    scheduled: true,
    timezone: "America/New_York"
});
