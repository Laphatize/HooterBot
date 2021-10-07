require('dotenv').config();
const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const config = require ('./config.json');
const birthdaySchema = require('./Database/birthdaySchema');
const guildSchema = require('./Database/guildSchema');
const ticketSchema = require('./Database/ticketSchema');
const cron = require('node-cron');
const moment = require('moment');
const levels = require('discord-xp');
const wait = require('util').promisify(setTimeout);
const axios = require('axios');


// INITIALIZATION
const client = new discord.Client({
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_BANS',
        'GUILD_EMOJIS_AND_STICKERS',
        // 'GUILD_INTEGRATIONS',
        // 'GUILD_WEBHOOKS',
        'GUILD_INVITES',
        'GUILD_VOICE_STATES',
        'GUILD_PRESENCES',
        'GUILD_MESSAGES',
        // 'GUILD_MESSAGE_REACTIONS',
        // 'GUILD_MESSAGE_TYPING',
        'DIRECT_MESSAGES',
        // 'DIRECT_MESSAGE_REACTIONS',
        // 'DIRECT_MESSAGE_TYPING'
    ],
    partials: ['CHANNEL', 'MESSAGE', 'USER']
})



// BOT LOGGING IN
client.login(process.env.HB_BOT_TOKEN);



// COLLECTIONS
client.commands = new discord.Collection();
client.slashCommands = new discord.Collection();
client.buttons = new discord.Collection();
client.cooldowns = new discord.Collection();
client.blacklist = new discord.Collection();


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
        .setDescription(`\`\`\`${err}\`\`\``)
        .setTimestamp()
    
    // LOG ENTRY
    client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logErrEmbed], content: `<@${config.botAuthorId}>` })
})




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
/*      SLASH COMMAND HANDLER                              */
/***********************************************************/
const slashCommands = fs.readdirSync('./SLASHCOMMANDS');
const arrayOfSlashCmds = [];

for (const folder of slashCommands) {
    const slashFiles = fs.readdirSync(`./SLASHCOMMANDS/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of slashFiles) {
		const slashCmd = require(`./SLASHCOMMANDS/${folder}/${file}`);
		client.slashCommands.set(slashCmd.name, slashCmd);
        arrayOfSlashCmds.push(slashCmd)
	}
}

// REGISTERING SLASH COMMANDS
client.on('ready', async () => {
    // SLASH COMMANDS
    console.log(`======================================`);
    console.log(`===== REGISTERING SLASH COMMANDS =====`);
    console.log(`======================================\n`);

    // GLOBAL SLASH COMMANDS - MMM789 TEST
    await client.application?.commands.set(arrayOfSlashCmds)        //  .commands.set([]) to empty


    // FETCHING COMMANDS BY NAME FOR PERMISSIONS
    const cmds = await client.application?.commands.fetch()
    let verifSC = cmds.find(c => c.name === `verif`)
    let userSC = cmds.find(c => c.name === `user`)
    let rulesSC = cmds.find(c => c.name === `rules_embed`)
    let permsSC = cmds.find(c => c.name === `permissions`)
    let partnerMsgSC = cmds.find(c => c.name === `partner_message`)
    let suggestDecisionSC = cmds.find(c => c.name === `suggestion_decision`)
    let channelSC = cmds.find(c => c.name === `channel`)
    let modappSC = cmds.find(c => c.name === `modapp`) 
    let weatherReportSC = cmds.find(c => c.name === `dailyweatherreport`) 
    let blacklistSC = cmds.find(c => c.name === `blacklist`)


    // SETTING PERMISSIONS
    const serverVerifPerms = [
        {
            id: verifSC.id,    // COMMAND: /verif
            permissions: [{
                id: '863650974513758259',   // TEST SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '863645415458865163',   // TEST SERVER - MOD ROLE
                type: 'USER',
                permission: true,
            },{
                id: '829416550867140608',   // TEMPLE SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '835182957160300604',   // TEMPLE SERVER - MOD ROLE
                type: 'USER',
                permission: true,
            }]
        },{
            id: userSC.id,    // COMMAND: /user
            permissions: [{
                id: '863650974513758259',   // TEST SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '863645415458865163',   // TEST SERVER - MOD ROLE
                type: 'USER',
                permission: true,
            },{
                id: '829416550867140608',   // TEMPLE SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '835182957160300604',   // TEMPLE SERVER - MOD ROLE
                type: 'USER',
                permission: true,
            }]
        },{
            id: rulesSC.id,    // COMMAND: /rules
            permissions: [{
                id: '863650974513758259',   // TEST SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '829416550867140608',   // TEMPLE SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            }]
        },{
            id: permsSC.id,    // COMMAND: /permissions
            permissions: [{
                id: '863650974513758259',   // TEST SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '863645415458865163',   // TEST SERVER - MOD ROLE
                type: 'USER',
                permission: true,
            },{
                id: '829416550867140608',   // TEMPLE SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '835182957160300604',   // TEMPLE SERVER - MOD ROLE
                type: 'USER',
                permission: true,
            }]
        },{
            id: partnerMsgSC.id,    // COMMAND: /partner_message
            permissions: [{
                id: '863650974513758259',   // TEST SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '829416550867140608',   // TEMPLE SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            }]
        },{
            id: suggestDecisionSC.id,    // COMMAND: /suggestion_decision
            permissions: [{
                id: '863650974513758259',   // TEST SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '863645415458865163',   // TEST SERVER - MOD ROLE
                type: 'USER',
                permission: true,
            },{
                id: '829416550867140608',   // TEMPLE SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '835182957160300604',   // TEMPLE SERVER - MOD ROLE
                type: 'USER',
                permission: true,
            }]
        },{
            id: channelSC.id,    // COMMAND: /channel
            permissions: [{
                id: '863650974513758259',   // TEST SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '863645415458865163',   // TEST SERVER - MOD ROLE
                type: 'USER',
                permission: true,
            },{
                id: '829416550867140608',   // TEMPLE SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '835182957160300604',   // TEMPLE SERVER - MOD ROLE
                type: 'USER',
                permission: true,
            }]
        },{
            id: modappSC.id,     // COMMAND: /modapp
            permissions: [{
                id: '863650974513758259',   // TEST SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '829416550867140608',   // TEMPLE SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            }]
        },{
            id: weatherReportSC.id,     // COMMAND: /weatherreport
            permissions: [{
                id: '863650974513758259',   // TEST SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
                id: '472185023622152203',   // ME
                type: 'USER',
                permission: true,
            }]
        },{
            id: blacklistSC.id,     // COMMAND: /blacklist
            permissions: [{
                id: '829416550867140608',   // TEMPLE SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            }]
        },{
            id: blacklistSC.id,     // COMMAND: /blacklist
            permissions: [{
                id: '829416550867140608',   // TEMPLE SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            }]
        }
    ];
    

    // TEST SERVER
    client.guilds.cache.get('530503548937699340')?.commands.permissions.set({ fullPermissions: serverVerifPerms })

    // TEMPLE SERVER
    client.guilds.cache.get('829409161581821992')?.commands.permissions.set({ fullPermissions: serverVerifPerms })
})



/***********************************************************/
/*      CRON JOBS                                          */
/***********************************************************/
// SCHEDULER FORMAT: *(Second) *(Minute) *(Hour) *(Day of Month) *(Month) *(Day of Week)

// // TICKET CATEGORY COUNTER
// // EVERY 10 MINUTES
// cron.schedule('00 05,15,25,35,45,55 * * * *', async () => {

//     // VERIFICATION CATEGORIES
//     const dbGuildTestServerData = await guildSchema.findOne({
//         GUILD_ID: `530503548937699340`
//     }).exec();

//     const dbGuildTempleServerData = await guildSchema.findOne({
//         GUILD_ID: `829409161581821992`
//     }).exec();


//     // FETCHING THE GUILD FROM DATABASE
//     let testServer = client.guilds.cache.get(dbGuildTestServerData.GUILD_ID)
//     let templeServer = client.guilds.cache.get(dbGuildTempleServerData.GUILD_ID)


//     // GRAB TICKET CATEGORY USING ID
//     let testServerTicketCategory = testServer.channels.cache.find(cat => cat.name.startsWith(`VERIFICATION (OPEN:`))
//     let templeServerTicketCategory = templeServer.channels.cache.find(cat => cat.name.startsWith(`VERIFICATION (OPEN:`))


//     // SETTING COUNT VALUES
//     // TEST SERVER
//     let ticketCountTestServer = testServer.channels.cache.filter(ch => ch.type === `GUILD_TEXT` && ch.name.startsWith(`verify-`) && ch.parent.name.startsWith(`VERIFICATION`)).size;
//     let catChCountTestServer = testServer.channels.cache.filter(ch => ch.type === `GUILD_TEXT` && ch.parent.name.startsWith(`VERIFICATION`)).size;
    
//     testServerTicketCategory.setName(`VERIFICATION (OPEN: ${ticketCountTestServer}) [${catChCountTestServer}/50]`)
    
//     // TEMPLE SERVER
//     let ticketCountTempleServer = templeServer.channels.cache.filter(ch => ch.type === `GUILD_TEXT` && ch.name.startsWith(`verify-`) && ch.parent.name.startsWith(`VERIFICATION`)).size;
//     let catChCountTempleServer = templeServer.channels.cache.filter(ch => ch.type === `GUILD_TEXT` && ch.parent.name.startsWith(`VERIFICATION`)).size;
    
//     console.log(`ticketCountTempleServer = ${ticketCountTempleServer}`)
//     console.log(`catChCountTempleServer = ${catChCountTempleServer}`)

//     templeServerTicketCategory.setName(`VERIFICATION (OPEN: ${ticketCountTempleServer}) [${catChCountTempleServer}/50]`)
// })


// MEMBER COUNTER
// EVERY 10 MINUTES
//cron.schedule('00 06,12,18,24,30,36,42,48,54 * * * *', async () => {
cron.schedule('00 02,12,22,32,42,52 * * * *', async () => {

    // FETCHING THE GUILD FROM DATABASE
    let testServer = client.guilds.cache.get(`530503548937699340`)
    let templeServer = client.guilds.cache.get(`829409161581821992`)

    // MEMBER LIST VC'S
    const totalTestMembersCount = testServer.memberCount
    const totalTempleMembersCount = templeServer.memberCount
    let memTestCount;
    let memTempleCount;


    if(totalTestMembersCount > 1000) {
        memTestCount = `${(totalTestMembersCount/1000).toFixed(1)}K`
    } else {
        memTestCount = `${totalTestMembersCount}`
    }
    if(totalTempleMembersCount > 1000) {
        memTempleCount = `${(totalTempleMembersCount/1000).toFixed(1)}K`
    } else {
        memTempleCount = `${totalTempleMembersCount}`
    }

    
    let owlCounterTestServerCh = testServer.channels.cache.find(ch => ch.type === `GUILD_VOICE` && ch.name.startsWith(`Owls: `))
    owlCounterTestServerCh.setName(`Owls: ${memTestCount}`)


    let owlCounterTempleServer = templeServer.channels.cache.find(ch => ch.type === `GUILD_VOICE` && ch.name.startsWith(`Owls: `))
    owlCounterTempleServer.setName(`Owls: ${memTempleCount}`)
})


// BIRTHDAY CHECKS
// EVERY DAY AT 8:00AM EST
// cron.schedule('00 */2 * * * *', async () => {  // FOR TESTING
cron.schedule('00 00 08 * * *', async () => {
    
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
        let result = []


        // FOR LOOP TO GRAB ID'S OF TODAY'S BIRTHDAYS FROM DATABASE
        for(let i in dbBirthdayData) {
            result.push(dbBirthdayData[i].USER_ID)
        }


        // THE "result" ARRAY HAS ALL THE DAY'S BIRTHDAYS, LOOP
        result.forEach( id => {
 
            // CREATE RANDOM BIRTHDAY MESSAGE USING FUNCTION
            bdayMessage = createBdayMessage(id);

            // DEFINE GUILD BY NAME, FETCHING BDAY ROLE
            let guild = client.guilds.cache.find(guild => guild.name === 'Temple University')

            // FETCH BOT CHANNEL OF GUILD AND SEND MESSAGE
            guild.channels.cache.find(ch => ch.name === `☕｜off-topic`).send({ content: `${bdayMessage}` })
                .catch(err => console.log(err))

            // FETCH BIRTHDAY USER BY ID, GIVE ROLE
            guild.members.fetch(id)
                .then(user => {
                    bdayRole = guild.roles.cache.find(role => role.name === 'Birthday! 👑🥳')
                
                    user.roles.add(bdayRole)
                })

            // WAIT 1 SECOND BETWEEN USERS
            wait(1000)
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
// cron.schedule('30 */2 * * * *', async () => {  // FOR TESTING 
cron.schedule('00 59 07 * * *', async () => {

    // DEFINE GUILD BY NAME, FETCHING BDAY ROLE
    let guild = client.guilds.cache.find(guild => guild.name === 'Temple University')


    // GET POSITION OF CURERNT BIRTHDAY ROLE
    let bdayRolePosition = guild.roles.cache.find(role => role.name === 'Birthday! 👑🥳').position
    let bdayRoleHexColor = guild.roles.cache.find(role => role.name === 'Birthday! 👑🥳').hexColor
    let bdayRoleHoist = guild.roles.cache.find(role => role.name === 'Birthday! 👑🥳').hoist
    let bdayRoleMentionable = guild.roles.cache.find(role => role.name === 'Birthday! 👑🥳').mentionable


    // DELETE THE CURRENT BIRTHDAY ROLE
    guild.roles.cache.find(role => role.name === 'Birthday! 👑🥳').delete()


    // CREATE THE NEW ROLE
    guild.roles.create({
        name: 'Birthday! 👑🥳',
        color: `${bdayRoleHexColor}`,
        position: bdayRolePosition,
        hoist: bdayRoleHoist,
        mentionable: bdayRoleMentionable,
    })

    console.log(`New birthday role created.`)
}, {
    scheduled: true,
    timezone: "America/New_York"
});


// VERIFICATION TICKETS - FIRST REMINDER (2 DAYS AFTER STARTING)
// EVERY DAY AT 10:30:00AM EST
cron.schedule('00 30 10 * * *', async () => {
    console.log('Finding verification tickets that are 2 days old to send first reminder.')

    // GETTING TICKETS WHO CLOSE IN 5 DAYS (2 DAYS OLD NOW)
    let fiveDaysLeft = moment(Date.now()).add(5, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")

    // CHECK DATABASE FOR ENTRY
    const dbTicketData = await ticketSchema.find({
        TICKET_CLOSE: fiveDaysLeft
    }).exec();


    if(dbTicketData) {

        // DEFINING A NEW ARRAY TO STORE THE IDs FROM THE DATABASE
        let result = []


        // FOR LOOP TO GRAB ID'S OF THE USERS WHO ARE GETTING DAY 2 REMINDERS
        for(let i in dbTicketData) {
            result.push(dbTicketData[i].CREATOR_ID)
        }

        console.log(`2 day old tickets: ${result.length}`)


        // THE "result" ARRAY HAS ALL THE IDs FOR USERS RECEIVING DAY 2 REMINDER
        result.forEach( id => {

            // DEFINE GUILD BY NAME, FETCHING BDAY ROLE
            let guild = client.guilds.cache.find(guild => guild.name === 'Temple University')

            // WAIT 1 SECOND BETWEEN REMINDERS
            wait(1000)

            // FETCH USER BY ID
            guild.members.fetch(id)
                .then(user => {

                    // GENERATE AND SEND REMINDER EMBED
                    let reminderEmbed = new discord.MessageEmbed()
                        .setColor(config.embedBlurple)
                        .setTitle(`Ticket Closes in 5 Days`)
                        .setDescription(`Hi **${user.username}**, if you have already submitted your verification proof and are awaiting a response, please disregard this message.
                            \nYou are receiving this reminder because your ticket will close automatically on **${fiveDaysLeft}**.
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


                    client.users.fetch(user.id)
                        .then(user => {
                            // FETCHING USER'S TICKET CHANNEL IN GUILD
                            let ticketChannel = client.channels.cache.find(ch => ch.name === `verify-${user.id}`);

                            // GENERATE NOTICE EMBED
                            let firstReminderTicketChEmbed = new discord.MessageEmbed()
                                .setColor(config.embedGrey)
                                .setDescription(`${config.botName} has automatically sent **${user.username}** the initial reminder message in their DMs because this ticket closes in 5 days.`)


                            // SEND MESSAGE IN TICKET CHANNEL
                            ticketChannel.send({embeds: [firstReminderTicketChEmbed]})
                                .catch(err => console.log(`Unable to send initial ticket reminder to ${user.username.toLowerCase()} (ID: ${user.id})`))
                                .then(msg => {
                                    // LOG MESSAGE ID IN DATABASE FOR USER
                                    ticketSchema.findOneAndUpdate({
                                        CREATOR_ID: user.id
                                    },{
                                        REMINDER1_MSG_ID: msg.id,
                                    },{
                                        upsert: true
                                    }).exec();
                                })
                        })
                })
        })
    }
}, {
    scheduled: true,
    timezone: "America/New_York"
});


// VERIFICATION TICKETS - CLOSE NOTICE TICKET 
// EVERY DAY AT 10:31:00AM EST
cron.schedule('00 31 10 * * *', async () => {
    console.log('Finding verification tickets that are 6 days old to send close notice.')

    // GETTING TICKETS WHO CLOSE IN 1 DAYS (6 DAYS OLD NOW)
    let oneDayLeft = moment(Date.now()).add(1, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")

    // CHECK DATABASE FOR ENTRY
    const dbTicketData = await ticketSchema.find({
        TICKET_CLOSE: oneDayLeft
    }).exec();


    if(dbTicketData) {
        // DEFINING A NEW ARRAY TO STORE THE IDs FROM THE DATABASE
        let result = []

        // FOR LOOP TO GRAB ID'S OF THE USERS WHO ARE GETTING CLOSE NOTICES
        for(let i in dbTicketData) {
            result.push(dbTicketData[i].CREATOR_ID)
        }

        console.log(`6 day old tickets: ${result.length}`)


        // THE "result" ARRAY HAS ALL THE IDs FOR USERS RECEIVING CLOSE NOTICES
        result.forEach( id => {

            // DEFINE GUILD BY NAME, FETCHING BDAY ROLE
            let guild = client.guilds.cache.find(guild => guild.name === 'Temple University')

            // WAIT 1 SECOND BETWEEN REMINDERS
            wait(1000)

            // FETCH USER BY ID
            guild.members.fetch(id)
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


                    client.users.fetch(user.id)
                        .then(user => {
                            // FETCHING USER'S TICKET CHANNEL IN GUILD
                            let ticketChannel = client.channels.cache.find(ch => ch.name === `verify-${user.id}`);

                            // GENERATE NOTICE EMBED
                            let firstReminderTicketChEmbed = new discord.MessageEmbed()
                                .setColor(config.embedGrey)
                                .setDescription(`${config.botName} has automatically sent **${user.username}** the pending close notice in their DMs because this ticket closes **tomorrow**.`)


                            // SEND MESSAGE IN TICKET CHANNEL
                            ticketChannel.send({embeds: [firstReminderTicketChEmbed]})
                                .catch(err => console.log(err))
                                .then(msg => {
                                    
                                    // LOG MESSAGE ID IN DATABASE FOR USER
                                    ticketSchema.findOneAndUpdate({
                                        CREATOR_ID: user.id
                                    },{
                                        REMINDER2_MSG_ID: msg.id,
                                    },{
                                        upsert: true
                                    }).exec();
                                })
                        })
                })
        })
    }
}, {
    scheduled: true,
    timezone: "America/New_York"
});


// VERIFICATION TICKETS - AUTOMATIC CLOSING OF TICKET
// EVERY DAY AT 10:32:00AM EST
cron.schedule('00 32 10 * * *', async () => {
    console.log('Finding verification tickets that are 7 days old to close.')

    // GETTING TICKETS WHO'S CLOSING DAY MATCHES TODAY
    let closingDay = moment(Date.now()).utcOffset(-4).format("dddd, MMMM DD, YYYY")

    // CHECK DATABASE FOR ENTRY
    const dbTicketData = await ticketSchema.find({
        TICKET_CLOSE: closingDay
    }).exec();



    if(dbTicketData) {
        // FOR LOOP TO GRAB ID'S OF THE USERS WHO'S TICKETS ARE CLOSING
        for(let i in dbTicketData) {
            
            // DEFINE GUILD BY NAME, FETCHING BDAY ROLE
            let guild = client.guilds.cache.find(guild => guild.name === 'Temple University')

            // WAIT 1 SECOND BETWEEN REMINDERS
            wait(1000)

            guild.members.fetch(dbTicketData[i].CREATOR_ID)
                .then(dmUser => {

                    // EDITING THE INITIAL DM MESSAGE TO DISABLE THE BUTTONS
                    dmUser.createDM()
                        .then(ch => {
                            ch.messages.fetch(dbTicketData[i].DM_INITIALMSG_ID)
                                .then(msg => {
                                    
                                    // COPY OF THE INITIAL EMBED MESSAGE SO BUTTONS CAN BE DISABLED
                                    let ticketOpenEmbed = new discord.MessageEmbed()
                                        .setColor(config.embedTempleRed)
                                        .setTitle(`**Verification - Ticket Opened**`)
                                        .setDescription(`Thanks for wanting to verify in the <:TempleT:857293539779018773> **Temple University server**.
                                            \nThere are three ways you can verify you are a student or employee:
                                            \n${config.indent}**1.** Use a physical TUid card
                                            \n${config.indent}**2.** Use a virtual TUid card
                                            \n${config.indent}**3.** Using TUportal
                                            \n\nThis ticket has been **closed**. If you have not completed verification, you may open a new verification ticket in <#829417860820238356>.`)


                                    // INITIALIZING BUTTONS - ALL DISABLED
                                    let TUidCardButtonDisabled = new MessageButton()
                                        .setLabel("Physical TUid Card")
                                        .setStyle("SECONDARY")
                                        .setCustomId("physical_TUid_Card")
                                        .setDisabled(true)
                                    let VirtualTUidCardButtonDisabled = new MessageButton()
                                        .setLabel("Virtual TUid Card")
                                        .setStyle("SECONDARY")
                                        .setCustomId("virtual_TUid_Card")
                                        .setDisabled(true)
                                    let TuPortalButtonDisabled = new MessageButton()
                                        .setLabel("TUportal")
                                        .setStyle("SECONDARY")
                                        .setCustomId("TU_portal")
                                        .setDisabled(true)
                                    let InfoButtonDisabled = new MessageButton()
                                        .setLabel("Data & Privacy Info")
                                        .setStyle("PRIMARY")
                                        .setCustomId("Data_Privacy")
                                        .setDisabled(true)
                                    let QuitButtonDisabled = new MessageButton()
                                        .setLabel("Quit Verification")
                                        .setStyle("DANGER")
                                        .setCustomId("quit")
                                        .setDisabled(true)

                                    // DISABLED BUTTON ROWS
                                    let initialButtonRowDisabled = new MessageActionRow()
                                        .addComponents(
                                            TUidCardButtonDisabled,
                                            VirtualTUidCardButtonDisabled,
                                            TuPortalButtonDisabled
                                        );

                                    let secondButtonRowDisabled = new MessageActionRow()
                                        .addComponents(
                                            InfoButtonDisabled,
                                            QuitButtonDisabled
                                        );


                                    // EDITING THE INITIAL DM PROMPT TO DISABLE BUTTONS
                                    msg.edit({embeds: [ticketOpenEmbed], components: [initialButtonRowDisabled, secondButtonRowDisabled] })
                                        .catch(err => console.log(err))      
                                })

                            // DELETE THE 2ND PROMPT MESSAGE IF IT EXISTS - NOT WORTH DISABLING ANY BUTTONS ON IT
                            if(dbTicketData[i].DM_2NDMSG_ID) {
                                                            
                                // FETCH MESSAGE BY ID
                                ch.messages.fetch(dbTicketData[i].DM_2NDMSG_ID)
                                    .then(msg => {
                                        setTimeout(() => msg.delete(), 0 );
                                    })
                            }


                            // DELETE 1ST REMINDER IF EXISTS
                            if(dbTicketData[i].REMINDER1_MSG_ID) {
                                                            
                                // FETCH MESSAGE BY ID
                                ch.messages.fetch(dbTicketData[i].REMINDER1_MSG_ID)
                                    .then(msg => {
                                        setTimeout(() => msg.delete(), 0 );
                                    })
                                    .catch(err => console.log(err))
                            }


                            // DELETE 2ND REMINDER IF EXISTS
                            if(dbTicketData[i].REMINDER2_MSG_ID) {
                                                            
                                // FETCH MESSAGE BY ID
                                ch.messages.fetch(dbTicketData[i].REMINDER2_MSG_ID)
                                    .then(msg => {
                                        setTimeout(() => msg.delete(), 0 );
                                    })
                                    .catch(err => console.log(err))
                            }
                        })

                    // DELETING DATABASE ENTRY
                    ticketSchema.deleteOne({
                        CREATOR_ID: dmUser.id
                    }).exec();



                    // GENERATING QUIT CONFIRMATION EMBED FOR DM
                    let ticketClosedConfirmEmbed = new discord.MessageEmbed()
                        .setColor(config.embedOrange)
                        .setTitle(`**${config.emjORANGETICK} Ticket Closed.**`)
                        .setDescription(`${config.botName} has automatically closed this verification ticket since this ticket has been open for one full week.
                        \nAll the information for this ticket has been purged.
                        \nIf you wish to verify at a later time, please open a new ticket using the prompt in <#829417860820238356>.`)
                        .setTimestamp()
                        .setFooter(`This is an automated message.`)


                    // DMING USER THE TICKET CLOSE CONFIRMATION             
                    dmUser.send({embeds: [ticketClosedConfirmEmbed]})
                        .catch(err => console.log(err))


                    // LOGGING TICKET CLOSURE
                    let logCloseTicketEmbed = new discord.MessageEmbed()
                        .setColor(config.embedOrange)
                        .setTitle(`${config.emjORANGETICK} Verification Ticket Closed`)
                        .addField(`User:`, `${dmUser}`, true)
                        .addField(`User ID:`, `${dmUser.id}`, true)
                        .addField(`Verified?`, `\`\` NO \`\``, true)
                        .addField(`Ticket closed by:`, `<@${config.botId}> ***(automatically)***`)
                        .setTimestamp()
                    

                    // SENDING LOG ENTRY
                    guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logCloseTicketEmbed] })
                        .catch(err => console.log(err))

                    
                    // CLOSURE NOTICE TO CHANNEL
                    let closeNotice = new discord.MessageEmbed()
                        .setColor(config.embedOrange)
                        .setTitle(`${config.emjORANGETICK} Verification Window Expired`)
                        .setDescription(`**<@${config.botId}>** has automatically closed this ticket since it has been open for one full week. This message constitutes as the last message of the transcript; the DM-channel communications with the user have been severed.\n\nIf the contents of this ticket do not need to be archived for moderation actions, press \`\`Confirm Ticket Close\`\` to **permanently delete this channel *immediately***.\n\nIf this channel needs to be archived for moderation actions, press \`\`Do Not Close\`\` to keep this channel.`)
                        .setTimestamp()


                    // BUTTONS
                    let InfoButton = new MessageButton()
                        .setLabel("Confirm Ticket Close")
                        .setStyle("SUCCESS")
                        .setCustomId("Confirm_Ticket_Close")
                    let QuitButton = new MessageButton()
                        .setLabel("Do Not Close")
                        .setStyle("DANGER")
                        .setCustomId("Ticket_DoNotClose")


                    // BUTTON ROW
                    let TicketCloseReviewButtonRow = new MessageActionRow()
                    .addComponents(
                        InfoButton,
                        QuitButton
                    );


                    client.users.fetch(dmUser.id)
                        .then(dmUser => {
                            // FETCHING TICKET CHANNEL AND SENDING CLOSURE NOTICE
                            client.channels.cache.find(ch => ch.name === `verify-${dmUser.id}`).send({ embeds: [closeNotice], components: [TicketCloseReviewButtonRow] })
                                .then(msg => {
                                    // CHANGING TICKET CHANNEL NAME TO "closed-(username)" TO CUT DM-CHANNEL COMMS
                                    msg.channel.setName(`closed-${dmUser.username.toLowerCase()}`)

                                            // EDIT THE INITIAL TICKET MESSAGE TO DISABLE BUTTON
                                        // GRAB TICKET CHANNEL
                                        initialChMsg = client.channels.cache.find(ch => ch.name === `closed-${dmUser.username.toLowerCase()}`)
                                            .then(ch => {
                                                // GRABBING THE INITIAL MESSAGE FROM TICKET CHANNEL
                                                msg = ch.messages.fetch(dbTicketData[i].TICKETCH1_MSG_ID)

                                                // CREATE INTRO EMBED FOR ADMIN/MOD TICKET CHANNEL
                                                let newTicketEditedEmbed = new discord.MessageEmbed()
                                                    .setColor(config.embedGreen)
                                                    .setTitle(`**Verification Ticket Closed**`)
                                                    .addField(`User:`, `${dmUser}`, true)
                                                    .addField(`User Tag:`, `${dmUser.tag}`, true)
                                                    .addField(`User ID:`, `${dmUser.id}`, true)
                                                    .setDescription(`*This ticket has been closed. See the last message in the channel for information.*`)

                                                let QuitButton = new MessageButton()
                                                    .setLabel("End Verification")
                                                    .setStyle("DANGER")
                                                    .setCustomId("quit_CH")
                                                    .setDisabled(true)

                                                // BUTTON ROW
                                                let QuitButtonModBtn = new MessageActionRow()
                                                    .addComponents(
                                                        QuitButton
                                                    );

                                                // EDITING THE INITIAL DM PROMPT TO DISABLE BUTTONS
                                                msg.edit({ embeds: [newTicketEditedEmbed], components: [QuitButtonModBtn] })
                                                    .catch(err => console.log(err))
                                            })
                                })
                                .catch(err => console.log(err))
                        })
                })
        }
    }
}, {
    scheduled: true,
    timezone: "America/New_York"
});



// WEATHER REPORT - EVERY DAY AT 06:00:00AM EST
cron.schedule('00 00 06 * * *', async () => {

    console.log(`Running the daily weather report...`)

    // DEFINE GUILD BY NAME, FETCHING BDAY ROLE
    let guild = client.guilds.cache.find(guild => guild.name === 'Temple University')


    // GRAB WEATHER DATA
    let apiConfig = {
        method: 'get',
        url: encodeURI(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.weatherAPIkey}&q=39.981364957390184,-75.15441956488965&days=1&aqi=no&alerts=no`), // PHILLY WEATHER AT BELL TOWER
        headers: {}
    }

    let forecastHourlyReport1Embed, forecastHourlyReport2Embed


    // WEATHER API CALL
    axios(apiConfig)
        .then(async function(result) {

            console.log(`API request sent, grabbing data...`)

            await wait(500)

            // IF JSON RESPONSE IS UNDEFINED OR EMPTY - NO WEATHER DATA
            if(result === undefined || result.length === 0) {

                // DEFINING ERROR EMBED
                let noResultEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error generating daily report.`)
                    .setDescription(`I'm having trouble getting a daily weather report for Philly today. This is potentially indicative of an API issue or the Earth has been destroyed and there is no weather anymore...`)
                return guild.channels.cache.find(ch => ch.name === `🌞｜weather-report`).send({ embeds: [noResultEmbed], content: `<@${config.botAuthorId}>` })
            }


            // WEATHER API RESPONSE IS VALID AND HAS DATA
            console.log(`Weather API data received.`)
            forecastReport = result.data.forecast.forecastday[0]
            currentWeather = result.data.current
            

            // GENERATING SUCCESSFUL WEATHER EMBED
            let forecastWeatherEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`${moment().utcOffset(-4).format('dddd, MMMM D, YYYY')}`)
                .setThumbnail(encodeURI(`https:${forecastReport.day.condition.icon}`))

                // ROW 1
                .addField(`Conditions:`, `${forecastReport.day.condition.text}`, true)
                .addField(`High Temp:`, `${forecastReport.day.maxtemp_f}°F (${forecastReport.day.maxtemp_c}°C)`, true)
                .addField(`Low Temp:`, `${forecastReport.day.mintemp_f}°F (${forecastReport.day.mintemp_c}°C)`, true)
                // ROW 2
                .addField(`Humidity:`, `${forecastReport.day.avghumidity}%`, true)
                .addField(`Max Winds:`, `${forecastReport.day.maxwind_mph} mph (${forecastReport.day.maxwind_kph} kph)`, true)
                .addField(`UV Index:`, `${forecastReport.day.uv}`, true)
                // ROW 3
                .addField(`Chance of Rain:`, `${forecastReport.day.daily_chance_of_rain}%`, true)
                .addField(`Chance of Snow:`, `${forecastReport.day.daily_chance_of_snow}%`, true)
                .addField(`Precipitation:`, `${forecastReport.day.totalprecip_in}in (${forecastReport.day.totalprecip_mm} mm)`, true)
                // ROW 4
                .addField(`Sunrise:`, `${forecastReport.astro.sunrise}`, true)
                .addField(`Sunset:`, `${forecastReport.astro.sunset}`, true)
                .addField(`Moon Phase:`, `${forecastReport.astro.moon_phase}`, true)
                // ROW 5
                .addField(`Moonrise:`, `${forecastReport.astro.moonrise}`, true)
                .addField(`Moonset:`, `${forecastReport.astro.moonset}`, true)
                .addField(`Moon Illumination:`, `${forecastReport.astro.moon_illumination}%`, true)


            let sixAMdata = forecastReport.hour[6]
            let nineAMdata = forecastReport.hour[9]
            let noondata = forecastReport.hour[12]
            let threePMdata = forecastReport.hour[15]
            let sixPMdata = forecastReport.hour[18]
            let ninePMdata = forecastReport.hour[21]
            let uvIndicatorValue

            function uvIndicator (uvIndex) {
                // UV EVALUATIONS - https://www.epa.gov/enviro/uv-index-overview
                if(uvIndex >= 0 && uvIndex <= 2 ) {
                    uvIndicatorValue = `🟩 ${uvIndex} – *Low Risk*`
                }
                if(uvIndex >= 3 && uvIndex <= 5 ) {
                    uvIndicatorValue = `🟨 ${uvIndex} – *Moderate Risk*`
                }
                if(uvIndex >= 6 && uvIndex <= 7 ) {
                    uvIndicatorValue = `🟧 ${uvIndex} – *__High__ – Be mindful of sun damage!*`
                }
                if(uvIndex >= 8 && uvIndex <= 10 ) {
                    uvIndicatorValue = `🟥 ${uvIndex} – *__Very High__ – Protect against sun damage!*`
                }
                if(uvIndex >= 11 ) {
                    uvIndicatorValue = `🟪 ${uvIndex} – *__EXTREME__ – Protect against sun damage!*`
                }

                return uvIndicatorValue;
            }


            // GENERATING HOURLY REPORTS
            forecastHourlyReport1Embed = new discord.MessageEmbed()
                .setTitle(`Forecast:`)
                .setColor(config.embedBlurple)
                .addField(`6AM – ${sixAMdata.condition.text}`, `Temp: ${sixAMdata.temp_f}°F (${sixAMdata.temp_c}°C)\nFeels like: ${sixAMdata.feelslike_f}°F (${sixAMdata.feelslike_c}°C)\nWind chill: ${sixAMdata.windchill_f}°F (${sixAMdata.windchill_c}°C)\n\nUV: ${uvIndicator(sixAMdata.uv)}\nHumidity: ${sixAMdata.humidity}%\nWind: ${sixAMdata.wind_mph} mph (${sixAMdata.wind_kph} kph)\n\nRain Chance: ${sixAMdata.chance_of_rain}%\nSnow Chance: ${sixAMdata.chance_of_snow}%\nTotal Precipitation: ${sixAMdata.precip_in} in`, true)
                .addField(`9AM – ${nineAMdata.condition.text}`, `Temp: ${nineAMdata.temp_f}°F (${nineAMdata.temp_c}°C)\nFeels like: ${nineAMdata.feelslike_f}°F (${nineAMdata.feelslike_c}°C)\nWind chill: ${nineAMdata.windchill_f}°F (${nineAMdata.windchill_c}°C)\n\nUV: ${uvIndicator(nineAMdata.uv)}\nHumidity: ${nineAMdata.humidity}%\nWind: ${nineAMdata.wind_mph} mph (${nineAMdata.wind_kph} kph)\n\nRain Chance: ${nineAMdata.chance_of_rain}%\nSnow Chance: ${nineAMdata.chance_of_snow}%\nTotal Precipitation: ${nineAMdata.precip_in} in`, true)
                .addField(`Noon – ${noondata.condition.text}`, `Temp: ${noondata.temp_f}°F (${noondata.temp_c}°C)\nFeels like: ${noondata.feelslike_f}°F (${noondata.feelslike_c}°C)\nWind chill: ${noondata.windchill_f}°F (${noondata.windchill_c}°C)\n\nUV: ${uvIndicator(noondata.uv)}\nHumidity: ${noondata.humidity}%\nWind: ${noondata.wind_mph} mph (${noondata.wind_kph} kph)\n\nRain Chance: ${noondata.chance_of_rain}%\nSnow Chance: ${noondata.chance_of_snow}%\nTotal Precipitation: ${noondata.precip_in} in`, true)

            forecastHourlyReport2Embed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .addField(`3PM – ${threePMdata.condition.text}`, `Temp: ${threePMdata.temp_f}°F (${threePMdata.temp_c}°C)\nFeels like: ${threePMdata.feelslike_f}°F (${threePMdata.feelslike_c}°C)\nWind chill: ${threePMdata.windchill_f}°F (${threePMdata.windchill_c}°C)\n\nUV: ${uvIndicator(threePMdata.uv)}\nHumidity: ${threePMdata.humidity}%\nWind: ${threePMdata.wind_mph} mph (${threePMdata.wind_kph} kph)\n\nRain Chance: ${threePMdata.chance_of_rain}%\nSnow Chance: ${threePMdata.chance_of_snow}%\nTotal Precipitation: ${threePMdata.precip_in} in`, true)
                .addField(`6PM – ${sixPMdata.condition.text}`, `Temp: ${sixPMdata.temp_f}°F (${sixPMdata.temp_c}°C)\nFeels like: ${sixPMdata.feelslike_f}°F (${sixPMdata.feelslike_c}°C)\nWind chill: ${sixPMdata.windchill_f}°F (${sixPMdata.windchill_c}°C)\n\nUV: ${uvIndicator(sixPMdata.uv)}\nHumidity: ${sixPMdata.humidity}%\nWind: ${sixPMdata.wind_mph} mph (${sixPMdata.wind_kph} kph)\n\nRain Chance: ${sixPMdata.chance_of_rain}%\nSnow Chance: ${sixPMdata.chance_of_snow}%\nTotal Precipitation: ${sixPMdata.precip_in} in`, true)
                .addField(`9PM – ${ninePMdata.condition.text}`, `Temp: ${ninePMdata.temp_f}°F (${ninePMdata.temp_c}°C)\nFeels like: ${ninePMdata.feelslike_f}°F (${ninePMdata.feelslike_c}°C)\nWind chill: ${ninePMdata.windchill_f}°F (${ninePMdata.windchill_c}°C)\n\nUV: ${uvIndicator(ninePMdata.uv)}\nHumidity: ${ninePMdata.humidity}%\nWind: ${ninePMdata.wind_mph} mph (${ninePMdata.wind_kph} kph)\n\nRain Chance: ${ninePMdata.chance_of_rain}%\nSnow Chance: ${ninePMdata.chance_of_snow}%\nTotal Precipitation: ${ninePMdata.precip_in} in`, true)
                .setFooter(`Data from Weather API | Weather as of: ${moment(currentWeather.last_updated).subtract(0, 'hours').format(`MMMM D, YYYY, h:mm:ss a`)}`)

            EndingEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setDescription(`*To see the current weather at this moment or to generate a 3-day forecase, head to <#829685931501027359> or DMs with <@${config.botId}> and run* \`\`/weather\`\`.`)


            // FUNCTION THAT GENERATES THE RANDOM MESSAGE
            function greetingMsg() {
                const channelMsgStart = [
                    `Good morning, Owls! It's **${moment().format('dddd')}** and here's the weather:`,
                    `Happy **${moment().format('dddd')}**, Owls! Here's the weather for today:`,
                    ];      
                return channelMsgStart[Math.floor(Math.random() * channelMsgStart.length)];
            }

            console.log(`Posting new weather report...`)
            guild.channels.cache.find(ch => ch.name === `🌞｜weather-report`).send({ embeds: [forecastWeatherEmbed, forecastHourlyReport1Embed, forecastHourlyReport2Embed, EndingEmbed], content: `${greetingMsg()}\n` })
                .catch(err => {
                    // WEATHER LOAD ERROR RESPONSE
                    let weatherFetchErrEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjREDTICK} Sorry!`)
                        .setDescription(`I ran into an error posting today's weather in this channel, sorry!`)
                    guild.channels.cache.find(ch => ch.name === `🌞｜weather-report`).send({ embeds: [weatherFetchErrEmbed], content: `<@${config.botAuthorId}>` })

                    // LOG
                    console.log(`****** WEATHER API ERROR ******`);
                    console.log(err);
                    console.log(`********************************\n`);
                    
                    // DEFINING LOG EMBED
                    let logErrEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGrey)
                        .setTitle(`${config.emjERROR} An error has occurred with the Weather API...`)
                        .setDescription(`\`\`\`${err}\`\`\``)
                        .setTimestamp()
                    
                    // LOG ENTRY
                    return client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logErrEmbed] })
                })
        })
}, {
    scheduled: true,
    timezone: "America/New_York"
});



/***********************************************************/
/*      LEVELS                                             */
/***********************************************************/
let mongoUser = process.env.mongoUser;
let mongoPswrd = process.env.mongoPswrd;
let mongoDbName = process.env.mongoDbName;
levels.setURL(`mongodb+srv://${mongoUser}:${mongoPswrd}@cluster0.pwonb.mongodb.net/${mongoDbName}?retryWrites=true&w=majority`);