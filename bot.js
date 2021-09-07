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
    let weatherSC = cmds.find(c => c.name === `weather`) 


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
            id: weatherSC.id,    // COMMAND: /weather
            permissions: [{
                id: '863650974513758259',   // TEST SERVER - ADMIN ROLE
                type: 'USER',
                permission: true,
            },{
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
    fiveDaysLeft = moment(Date.now()).add(5, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")

    console.log(`fiveDaysLeft = ${fiveDaysLeft}`)

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

    console.log(`oneDayLeft = ${oneDayLeft}`)


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
// EVERY DAY AT 10:32:00AM EST          00 01 10
cron.schedule('00 32 10 * * *', async () => {
    console.log('Finding verification tickets that are 7 days old to close.')

    // GETTING TICKETS WHO'S CLOSING DAY MATCHES TODAY
    let closingDay = moment(Date.now()).utcOffset(-4).format("dddd, MMMM DD, YYYY")

    console.log(`closingDay = ${closingDay}`)

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



/***********************************************************/
/*      LEVELS                                             */
/***********************************************************/
let mongoUser = process.env.mongoUser;
let mongoPswrd = process.env.mongoPswrd;
let mongoDbName = process.env.mongoDbName;
levels.setURL(`mongodb+srv://${mongoUser}:${mongoPswrd}@cluster0.pwonb.mongodb.net/${mongoDbName}?retryWrites=true&w=majority`);