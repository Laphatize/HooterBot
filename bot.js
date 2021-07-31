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
client.slashcommands = new discord.Collection();
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
/*      INTERACTION HANDLER                                */
/***********************************************************/





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
cron.schedule('00 00 10 * * *', async () => {
    console.log('Finding verification tickets that are 2 days old to send first reminder.');

    // GETTING TICKETS WHO CLOSE IN 5 DAYS (2 DAYS OLD NOW)
    fiveDaysLeft = moment(Date.now()).add(5, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")


    // CHECK DATABASE FOR ENTRY
    const dbTicketData = await ticketSchema.find({
        TICKET_CLOSE: fiveDaysLeft
    }).exec();


    if(dbTicketData) {

        // DEFINING A NEW ARRAY TO STORE THE IDs FROM THE DATABASE
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


                    client.users.fetch( user.id )
                        .then(user => {
                            // FETCHING USER'S TICKET CHANNEL IN GUILD
                            let ticketChannel = client.channels.cache.find(ch => ch.name === `verify-${user.username.toLowerCase()}`);


                            // GENERATE NOTICE EMBED
                            let firstReminderTicketChEmbed = new discord.MessageEmbed()
                                .setColor(config.embedGrey)
                                .setDescription(`${config.botName} has automatically sent **${user.username}** the initial reminder message in their DMs because this ticket closes in 5 days.`)


                            // SEND MESSAGE IN TICKET CHANNEL
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
cron.schedule('30 00 10 * * *', async () => {
    console.log('Finding verification tickets that are 6 days old to send close notice.');

    // GETTING TICKETS WHO CLOSE IN 1 DAYS (6 DAYS OLD NOW)
    oneDayLeft = moment(Date.now()).add(1, 'days').utcOffset(-4).format("dddd, MMMM DD, YYYY")


    // CHECK DATABASE FOR ENTRY
    const dbTicketData = await ticketSchema.find({
        TICKET_CLOSE: oneDayLeft
    }).exec();


    if(dbTicketData) {

        // DEFINING A NEW ARRAY TO STORE THE IDs FROM THE DATABASE
        var result = []


        // FOR LOOP TO GRAB ID'S OF THE USERS WHO ARE GETTING CLOSE NOTICES
        for(let i in dbTicketData) {
            result.push(dbTicketData[i].CREATOR_ID)
        }


        // THE "result" ARRAY HAS ALL THE IDs FOR USERS RECEIVING CLOSE NOTICES
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


                            // SEND MESSAGE IN TICKET CHANNEL
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


// VERIFICATION TICKETS - AUTOMATIC CLOSING OF TICKET
// EVERY DAY AT 10:01:00AM EST
cron.schedule('30 00 10 * * *', async () => {
    console.log('Finding verification tickets that are 7 days old to close.');

    // GETTING TICKETS WHO'S CLOSING DAY MATCHES TODAY
    closingDay = moment(Date.now()).utcOffset(-4).format("dddd, MMMM DD, YYYY")


    // CHECK DATABASE FOR ENTRY
    const dbTicketData = await ticketSchema.find({
        TICKET_CLOSE: closingDay
    }).exec();


    if(dbTicketData) {


        // FOR LOOP TO GRAB ID'S OF THE USERS WHO'S TICKETS ARE CLOSING
        for(let i in dbTicketData) {
            
            // DEFINE GUILD BY NAME, FETCHING BDAY ROLE
            guild = client.guilds.cache.find(guild => guild.name === 'MMM789 Test Server')

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
                                secondDmMsg = dmCh.messages.fetch(dbTicketData[i].DM_2NDMSG_ID)
                                    .then(msg => {
                                        setTimeout(() => msg.delete(), 0 );
                                    })
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


                    dmUser = client.users.fetch(dmUser.id)
                        .then(dmUser => {
                            // FETCHING TICKET CHANNEL AND SENDING CLOSURE NOTICE
                            client.channels.cache.find(ch => ch.name === `verify-${dmUser.username.toLowerCase()}`).send({ embeds: [closeNotice], components: [TicketCloseReviewButtonRow] })
                                .then(msg => {
                                    // CHANGING TICKET CHANNEL NAME TO "closed-(username)" TO CUT DM-CHANNEL COMMS
                                    msg.channel.setName(`closed-${dmUser.username.toLowerCase()}`)
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