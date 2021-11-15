const discord = require('discord.js')
const config = require ('../../config.json')
const birthdaySchema = require('../../Database/birthdaySchema');
const infractionsSchema = require('../../Database/infractionsSchema');
const mutedUsersSchema = require('../../Database/mutedUsersSchema');
const levels = require('discord-xp');
const moment = require('moment');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription(`Commands regarding server members`)
}

    
//     name: 'user',
//     description: 'Commands regarding server members',
//     options: [
//         {
//             // USER BIRTHDAY
//             name: `birthday`,
//             description: `MODERATOR | A command for admins/mods to migrate MEE6's birthdays over to HooterBot.`,
//             type: 'SUB_COMMAND',
//             options: [
//                 {
//                     name: `user`,
//                     description: `The user who's birthday you're migrating.`,
//                     type: `USER`,
//                     required: true
//                 },{
//                     name: `month`,
//                     description: `The two-digit month value.`,
//                     type: `INTEGER`,
//                     required: true
//                 },{
//                     name: `day`,
//                     description: `The two-digit day value.`,
//                     type: `INTEGER`,
//                     required: true
//                 }
//             ]
//         },{
//             // INFO
//             name: `info`,
//             description: `MODERATOR | A command for generating information about a specific user in the server.`,
//             type: 'SUB_COMMAND',
//             options: [
//                 {
//                     name: `user`,
//                     description: `The user to generate information about.`,
//                     type: `USER`,
//                     required: true
//                 },
//             ],    
//         },{
//             // LEVEL IMPORT
//             name: `levelimport`,
//             description: `MODERATOR | Import MEE6 Leaderboard values for up to 10 users at once. (Overrides XP/level values)`,
//             type: 'SUB_COMMAND',
//             options: [
//                 {
//                     name: `user1`,
//                     description: `The user who's XP is being imported.`,
//                     type: `USER`,
//                     required: true
//                 },{
//                     name: `xp_value1`,
//                     description: `The XP value the user currently has.`,
//                     type: `INTEGER`,
//                     required: true
//                 },{
//                     name: `user2`,
//                     description: `The user who's XP is being imported.`,
//                     type: `USER`,
//                     required: false
//                 },{
//                     name: `xp_value2`,
//                     description: `The XP value the user currently has.`,
//                     type: `INTEGER`,
//                     required: false
//                 },{
//                     name: `user3`,
//                     description: `The user who's XP is being imported.`,
//                     type: `USER`,
//                     required: false
//                 },{
//                     name: `xp_value3`,
//                     description: `The XP value the user currently has.`,
//                     type: `INTEGER`,
//                     required: false
//                 },{
//                     name: `user4`,
//                     description: `The user who's XP is being imported.`,
//                     type: `USER`,
//                     required: false
//                 },{
//                     name: `xp_value4`,
//                     description: `The XP value the user currently has.`,
//                     type: `INTEGER`,
//                     required: false
//                 },{
//                     name: `user5`,
//                     description: `The user who's XP is being imported.`,
//                     type: `USER`,
//                     required: false
//                 },{
//                     name: `xp_value5`,
//                     description: `The XP value the user currently has.`,
//                     type: `INTEGER`,
//                     required: false
//                 },{
//                     name: `user6`,
//                     description: `The user who's XP is being imported.`,
//                     type: `USER`,
//                     required: false
//                 },{
//                     name: `xp_value6`,
//                     description: `The XP value the user currently has.`,
//                     type: `INTEGER`,
//                     required: false
//                 },{
//                     name: `user7`,
//                     description: `The user who's XP is being imported.`,
//                     type: `USER`,
//                     required: false
//                 },{
//                     name: `xp_value7`,
//                     description: `The XP value the user currently has.`,
//                     type: `INTEGER`,
//                     required: false
//                 },{
//                     name: `user8`,
//                     description: `The user who's XP is being imported.`,
//                     type: `USER`,
//                     required: false
//                 },{
//                     name: `xp_value8`,
//                     description: `The XP value the user currently has.`,
//                     type: `INTEGER`,
//                     required: false
//                 },{
//                     name: `user9`,
//                     description: `The user who's XP is being imported.`,
//                     type: `USER`,
//                     required: false
//                 },{
//                     name: `xp_value9`,
//                     description: `The XP value the user currently has.`,
//                     type: `INTEGER`,
//                     required: false
//                 },{
//                     name: `user10`,
//                     description: `The user who's XP is being imported.`,
//                     type: `USER`,
//                     required: false
//                 },{
//                     name: `xp_value10`,
//                     description: `The XP value the user currently has.`,
//                     type: `INTEGER`,
//                     required: false
//                 }
//             ],
//         },{
//             // INFRACTIONS
//             name: `infractions`,
//             description: `MODERATOR | A command recalling a user's recorded warnings and moderation actions.`,
//             type: 'SUB_COMMAND',
//             options: [
//                 {
//                     name: `target_user`,
//                     description: `The user to display the list of infractions.`,
//                     type: `USER`,
//                     required: true
//                 }
//             ],
//         },{
//             // WARN
//             name: `warn`,
//             description: `MODERATOR | A command for issuing warnings to users.`,
//             type: 'SUB_COMMAND',
//             options: [
//                 {
//                     name: `target_user`,
//                     description: `The user to warn.`,
//                     type: `USER`,
//                     required: true
//                 },{
//                     name: `reason`,
//                     description: `The reason for the warning. (LIMIT: 250 CHARACTERS)`,
//                     type: `STRING`,
//                     required: true
//                 },
//             ],
//         },{
//             // MUTE
//             name: `mute`,
//             description: `MODERATOR | A command for muting users.`,
//             type: 'SUB_COMMAND',
//             options: [
//                 {
//                     name: `target_user`,
//                     description: `The user to warn.`,
//                     type: `USER`,
//                     required: true
//                 },{
//                     name: `reason`,
//                     description: `The reason for the warning. (LIMIT: 250 CHARACTERS)`,
//                     type: `STRING`,
//                     required: true
//                 },
//             ],
//         },{
//             // UNMUTE
//             name: `unmute`,
//             description: `MODERATOR | A command for unmuting users.`,
//             type: 'SUB_COMMAND',
//             options: [
//                 {
//                     name: `target_user`,
//                     description: `The user to warn.`,
//                     type: `USER`,
//                     required: true
//                 },{
//                     name: `reason`,
//                     description: `The reason for the warning. (LIMIT: 250 CHARACTERS)`,
//                     type: `STRING`,
//                     required: true
//                 },
//             ],
//         },{
//             // BAN
//             name: `ban`,
//             description: `ADMINISTRATOR | A command for banning users from the server. Optional message purge.`,
//             type: 'SUB_COMMAND',
//             options: [
//                 {
//                     name: `target_user`,
//                     description: `The user to ban.`,
//                     type: `USER`,
//                     required: true
//                 },{
//                     name: `reason`,
//                     description: `The reason for the ban. (LIMIT: 250 CHARACTERS)`,
//                     type: `STRING`,
//                     required: true
//                 },{
//                     name: `purge_days`,
//                     description: `How many days' of messages to purge. (Limit: 7).`,
//                     type: `INTEGER`,
//                     required: false
//                 },
//             ],
//         },
//     ],
//     permissions: 'MANAGE_MESSAGES',
//     dmUse: false,
//     cooldown: 0,
//     defaultPermission: false,
//     run: async(client, interaction, inputs) => {

//         // console.log(`user command ID: ${interaction.commandId}`)

//         // GRAB SUBCOMMAND
//         let subCmdName = interaction.options.getSubcommand()


//         /*******************/
//         /* BIRTHDAY        */
//         /*******************/
//         if(subCmdName == 'birthday') {

//             // GETTING OPTIONS VALUES
//             let birthdayUser = interaction.options.getUser('user');
//             let birthdayMonth = interaction.options.getInteger('month');
//             let birthdayDay = interaction.options.getInteger('day');


//             // CHECK DATABASE FOR ENTRY
//             const dbBirthdayData = await birthdaySchema.findOne({
//                 USER_ID: birthdayUser.id
//             }).exec();


//             // IF A DB ENTRY EXISTS FOR THE USER ALREADY
//             if(dbBirthdayData) {
//                 let birthdayExists = new discord.MessageEmbed()
//                     .setColor(config.embedTempleRed)
//                     .setTitle(`${config.emjREDTICK} **Error!**`)
//                     .setDescription(`${birthdayUser}'s birthday already exists in the database.`)
//                     .setFooter(`If this is a bug, please let ${config.botAuthorUsername} know.`)

//                 // SENDING TO CHANNEL
//                 return interaction.reply({ embeds: [birthdayExists], ephemeral: true })
//             }


//             // CHECKING DAY HAS VALID RANGE
//             if(birthdayMonth < 1 || birthdayMonth > 12) {
//                 let monthRangeEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedTempleRed)
//                     .setTitle(`${config.emjREDTICK} **Error!**`)
//                     .setDescription(`The value for the month is outside possible values. Please make sure the month is between 01 and 12.`)

//                 // SENDING TO CHANNEL
//                 return interaction.reply({ embeds: [monthRangeEmbed], ephemeral: true })
//             }


//             // CHECKING DAY HAS VALID RANGE
//             if(birthdayDay < 1 || birthdayDay > 31) {
//                 let dayRangeEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedTempleRed)
//                     .setTitle(`${config.emjREDTICK} **Error!**`)
//                     .setDescription(`The value for the day is outside possible values. Please make sure the day is between 01 and 31.`)

//                 // SENDING TO CHANNEL
//                 return interaction.reply({ embeds: [dayRangeEmbed], ephemeral: true  })
//             }


//             // IF BIRTHDAY IS FEBRUARY 29 - LEAP YEAR DAY, RECOGNIZE BIRTHDAY ON FEBRUARY 28
//             if(birthdayDay == 29 && birthdayMonth == 2) {
//                 let dayRangeEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedTempleRed)
//                     .setTitle(`${config.emjORANGETICK} A leap year!`)
//                     .setDescription(`Because ${birthdayUser}'s birthday *technically* happens once every 4 years, I'm going to remind everyone of your birthday on February 28 instead so we can celebrate every year!`)

//                 // SENDING NOTICE TO CHANNEL
//                 interaction.reply({ embeds: [dayRangeEmbed], ephemeral: true })


//                 // LOG DATABASE INFORMATION FOR BIRTHDAY
//                 await birthdaySchema.findOneAndUpdate({
//                     USER_ID: birthdayUser.id
//                 },{
//                     USER_ID: birthdayUser.id,
//                     MONTH: 2,
//                     DAY: 28
//                 },{
//                     upsert: true
//                 }).exec();

//                 // FOR MONTH NUMBER TO NAME
//                 let monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]


//                 // CHANNEL CONFIRMATION
//                 let bdaySetEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedGreen)
//                     .setTitle(`${config.emjGREENTICK} **Birthday Saved!**`)
//                     .setDescription(`I'll remember ${birthdayUser}'s birthday on ${monthNames[birthdayMonth-1]} ${birthdayDay-1}, even though their birthday is actually on February 29.
//                     \n*If you ever wish for me to forget your birthday, use* \`\`/forget_birthday\`\`.`)

//                 return interaction.followUp({ embeds: [bdaySetEmbed] });
//             }


//             // LOG DATABASE INFORMATION FOR BIRTHDAY
//             await birthdaySchema.findOneAndUpdate({
//                 USER_ID: birthdayUser.id
//             },{
//                 USER_ID: birthdayUser.id,
//                 MONTH: birthdayMonth,
//                 DAY: birthdayDay
//             },{
//                 upsert: true
//             }).exec();


//             // FOR MONTH NUMBER TO NAME
//             let monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]


//             // CHANNEL CONFIRMATION
//             let bdaySetEmbed = new discord.MessageEmbed()
//                 .setColor(config.embedGreen)
//                 .setTitle(`${config.emjGREENTICK} **Birthday Saved!**`)
//                 .setDescription(`I'll remember ${birthdayUser}'s birthday on ${monthNames[birthdayMonth-1]} ${birthdayDay}.
//                 \n*If you ever wish for me to forget your birthday, use* \`\`/forget_birthday\`\`.`)
            
//             return interaction.reply({ embeds: [bdaySetEmbed] });
//         }



//         /*******************/
//         /* INFO            */
//         /*******************/
//         if(subCmdName == 'info') {
//             // GETTING OPTIONS VALUES
//             let infoUser = interaction.options.getUser('user');

//             // FETCH GUILD MEMBER
//             interaction.guild.members.fetch(infoUser.id)
//                 .then(async user => {
//                     let member = client.users.cache.find(user => user.id === infoUser.id)
                    
//                     const flags = await member.fetchFlags()
//                     let userFlags = flags.toArray()

//                     if(userFlags) {
//                         userFlags = `${userFlags.join(`\n`)}`
//                     }

//                     // GRABBING NICKNAME IF SET
//                     let nickname;
//                     if(user.displayName == user.username) {
//                         nickname = `*(None)*`;
//                     }
//                     if(user.displayName !== user.username) {
//                         nickname = user.displayName
//                     }


//                     // SERVER BOOSTING DATE FIX
//                     let booster
//                     if(booster == 'undefined' || booster == null || booster == "") {
//                         booster =  `*(N/A)*`
//                     } else {
//                         booster = member.premiumSince
//                     }


//                     let userRoleList
//                     // ROLES
//                     let userRoles = user.roles.cache
//                         .map(role => role.toString())
//                         .slice(0, -1)

//                     userRoleList = userRoles.join('\n')


//                     let userInfoEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedDarkGrey)
//                         .setAuthor(`${member.tag} Information`, `${member.displayAvatarURL({ dynamic:true })}`)
//                         .addField(`Username:`, `${member.username}`, true)
//                         .addField(`ID:`, `${member.id}`, true)
//                         .addField(`Nickname:`, `${nickname}`, true)
//                         .addField(`Server Boosting:`, `${booster}`, true)
//                         .addField(`Server Join Date:`, `${moment(user.joinedAt).format(`LLL`)}`, true)
//                         .addField(`Discord Join Date:`, `${moment(member.createdTimestamp).format(`LL`)}`, true)
//                         .addField(`Server Roles:`, `${userRoleList || `*(None)*`}`, true)
//                         .addField(`Flags:`, `\`\`${userFlags || `(None)`}\`\``, true)
//                         .addField(`Bot?`, `${member.bot}`, true)

//                     return interaction.reply({ embeds: [userInfoEmbed], ephemeral: true });
//                 })
//         }



//         /*******************/
//         /* LEVEL IMPORT    */
//         /*******************/   
//         if(subCmdName == 'levelimport') {
//             // USERS
//             let user1 = interaction.options.getUser('user1');
//             let user2 = interaction.options.getUser('user2');
//             let user3 = interaction.options.getUser('user3');
//             let user4 = interaction.options.getUser('user4');
//             let user5 = interaction.options.getUser('user5');
//             let user6 = interaction.options.getUser('user6');
//             let user7 = interaction.options.getUser('user7');
//             let user8 = interaction.options.getUser('user8');
//             let user9 = interaction.options.getUser('user9');
//             let user10 = interaction.options.getUser('user10');

//             // XP
//             let xp1 = interaction.options.getInteger('xp_value1');
//             let xp2 = interaction.options.getInteger('xp_value2');
//             let xp3 = interaction.options.getInteger('xp_value3');
//             let xp4 = interaction.options.getInteger('xp_value4');
//             let xp5 = interaction.options.getInteger('xp_value5');
//             let xp6 = interaction.options.getInteger('xp_value6');
//             let xp7 = interaction.options.getInteger('xp_value7');
//             let xp8 = interaction.options.getInteger('xp_value8');
//             let xp9 = interaction.options.getInteger('xp_value9');
//             let xp10 = interaction.options.getInteger('xp_value10');

//             // ARRAY FOR CONFIRMATION MESSAGE
//             let confirmationArray = []

//             // AWARDING XP FOR USER, PUSHING CONFIRMATION TO ARRAY
//             levels.createUser(user1.id, interaction.guild.id)
//                 .then(user1DNE => {
//                     levels.setXp(user1.id, interaction.guild.id, xp1);
//                 })
//             confirmationArray.push(`**${xp1} XP** has been added to ${user1}.`)

//             if(user2) {
//                 levels.createUser(user2.id, interaction.guild.id)
//                     .then(user2DNE => {
//                         levels.setXp(user2.id, interaction.guild.id, xp2);
//                     })
//                 confirmationArray.push(`**${xp2} XP** has been added to ${user2}.`)
//             } if(user3) {
//                 levels.createUser(user3.id, interaction.guild.id)
//                     .then(user3DNE => {
//                         levels.setXp(user3.id, interaction.guild.id, xp3);
//                     })
//                 confirmationArray.push(`**${xp3} XP** has been added to ${user3}.`)
//             } if(user4) {
//                 levels.createUser(user4.id, interaction.guild.id)
//                     .then(user4DNE => {
//                         levels.setXp(user4.id, interaction.guild.id, xp4);
//                     })
//                 confirmationArray.push(`**${xp4} XP** has been added to ${user4}.`)
//             } if(user5) {
//                 levels.createUser(user5.id, interaction.guild.id)
//                     .then(user5DNE => {
//                         levels.setXp(user5.id, interaction.guild.id, xp5);
//                     })
//                 confirmationArray.push(`**${xp5} XP** has been added to ${user5}.`)
//             } if(user6) {
//                 levels.createUser(user6.id, interaction.guild.id)
//                     .then(user6DNE => {
//                         levels.setXp(user6.id, interaction.guild.id, xp6);
//                     })
//                 confirmationArray.push(`**${xp6} XP** has been added to ${user6}.`)
//             } if(user7) {
//                 levels.createUser(user7.id, interaction.guild.id)
//                     .then(user7DNE => {
//                         levels.setXp(user7.id, interaction.guild.id, xp7);
//                     })
//                 confirmationArray.push(`**${xp7} XP** has been added to ${user7}.`)
//             } if(user8) {
//                 levels.createUser(user8.id, interaction.guild.id)
//                     .then(user8DNE => {
//                         levels.setXp(user8.id, interaction.guild.id, xp8);
//                     })
//                 confirmationArray.push(`**${xp8} XP** has been added to ${user8}.`)
//             } if(user9) {
//                 levels.createUser(user9.id, interaction.guild.id)
//                     .then(user9DNE => {
//                         levels.setXp(user9.id, interaction.guild.id, xp9);
//                     })
//                 confirmationArray.push(`**${xp9} XP** has been added to ${user9}.`)
//             } if(user10) {
//                 levels.createUser(user10.id, interaction.guild.id)
//                     .then(user10DNE => {
//                         levels.setXp(user10.id, interaction.guild.id, xp10);
//                     })
//                 confirmationArray.push(`**${xp10} XP** has been added to ${user10}.`)
//             }


//             let levelImportConfirmEmbed = new discord.MessageEmbed()
//                 .setColor(config.embedGreen)
//                 .setTitle(`${config.emjGREENTICK} Level Import Success`)
//                 .setDescription(`${confirmationArray.join(`\n`)}`)

//             // CONFIRMATION
//             interaction.reply({ embeds: [levelImportConfirmEmbed], ephemeral: true })
//         }



//         /*******************/
//         /* INFRACTIONS     */
//         /*******************/
//         if(subCmdName == 'infractions') {

//             // GETTING OPTIONS VALUES
//             let targetUser = interaction.options.getUser('target_user');


//             // MESSAGE SENT IN INVALID CATEGORY
//             if (interaction.channel.parent.id !== '829420812951748628') {

//                 // GENERATE ERROR EMBED
//                 let wrongChannelsEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedRed)
//                     .setTitle(`${config.emjREDTICK} Error!`)
//                     .setDescription(`Sorry, this command can only be run in the \`\`MOD-CHANNELS\`\` category of the Temple Server.`)
//                     .setTimestamp()
            
//                 // SENDING MESSAGE
//                 return interaction.reply({ embeds: [wrongChannelsEmbed], ephemeral: true })
//             }


//             // CHECK DATABASE FOR ENTRIES
//             let dbInfractionData = await infractionsSchema.findOne({
//                 USER_ID: targetUser.id
//             }).exec();


//             // FETCHING GUILD MEMBER
//             let member = client.users.cache.find(user => user.id === targetUser.id)

//             // NO INFRACTIONS EXIST
//             if(!dbInfractionData) {
//                 // GENERATE ERROR EMBED
//                 let noInfractionsEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedRed)
//                     .setTitle(`${config.emjREDTICK} ${member.tag}: no recorded infractions`)
//                     .setDescription(`I've scanned the entire database and there are no recorded bans, mutes, or warnings issued to this user.`)
//                     .setTimestamp()
//                     .setFooter(`Target User ID: ${targetUser.id}`)
            
//                 // SENDING MESSAGE
//                 return interaction.reply({ embeds: [noInfractionsEmbed] })
//             }


//             // GRAB ARRAY OF ALL INFRACTIONS FOR THIS USER FROM THE DATABASE
//             if(dbInfractionData) {

//                 let infractionResults =  await infractionsSchema.find({
//                         USER_ID: targetUser.id
//                     }).sort( [['_id', -1]] ).exec();      // DESCENDING CREATION DATE

                    
//                 let result = []

//                 // LOOPING TO GENERATE ENTRIES FOR EACH INFRACTION
//                 for(let i in infractionResults) {
//                     result.push(`**CASE #${infractionResults[i].CASE_NUM} – ${infractionResults[i].ACTION}**\n**Date:** ${infractionResults[i].DATE} (EST)\n**Staff:** <@${infractionResults[i].STAFF_ID}>\n**Reason:** "${infractionResults[i].REASON}"`)
//                 }

//                 // GRABBING USER'S TOTAL MOD ACTIONS COUNT
//                 let userInfCount = await infractionsSchema.countDocuments({
//                     USER_ID: targetUser.id 
//                 })

//                 // DYNAMIC EMBED TITLE
//                 let embedTitle;
//                 if(userInfCount == 1) embedTitle = `${member.tag}: 1 recorded infraction`
//                 if(userInfCount >= 2) embedTitle = `${member.tag}: ${userInfCount} recorded infractions`

//                 // LIMITING LIST OF INFRACTIONS IF TOO LARGE
//                 let infractionBodyText = `${result.join('\n\n')}`
//                 let limitedInfractionBodyText;
                
//                 // LIMIT IF CHAR COUNT IS TOO HIGH
//                 if(infractionBodyText.length > 4096) {
//                     limitedInfractionBodyText = `*Limited display: showing 5 most-recent entries:* ${result[0]}\n\n${result[1]}\n\n${result[2]}\n\n${result[3]}\n\n${result[4]}`

//                     if(infractionBodyText.length > 4096) {
//                         limitedInfractionBodyText = `*Limited display: showing 4 most-recent entries:* ${result[0]}\n\n${result[1]}\n\n${result[2]}\n\n${result[3]}`

//                         if(limitedInfractionBodyText.length > 4096) {
//                             limitedInfractionBodyText = `*Limited display: showing 3 most-recent entries:* ${result[0]}\n\n${result[1]}\n\n${result[2]}`
//                         }
//                     }
//                 }


//                 // GENERATE ERROR EMBED
//                 let infractionsListEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedBlurple)
//                     .setTitle(`${embedTitle}`)
//                     .setDescription(`${result.join('\n\n')}`)
//                     .setTimestamp()
//                     .setFooter(`Target User ID: ${targetUser.id}`)
            
//                 // SENDING MESSAGE
//                 return interaction.reply({ embeds: [infractionsListEmbed] })
//             }
//         }



//         /*******************/
//         /* WARN            */
//         /*******************/
//         if(subCmdName == 'warn') {

//             // GETTING OPTIONS VALUES
//             let warnUser = interaction.options.getUser('target_user');
//             let warnMember = interaction.options.getMember('target_user');
//             let warnReason = interaction.options.getString('reason');


//             // REASON TOO LONG
//             if(warnReason.length > 250) {
//                 let overchar = warnReason.length - 250

//                 // GENERATE ERROR EMBED
//                 let reasonTooLargeEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedRed)
//                     .setTitle(`${config.emjREDTICK} Error!`)
//                     .setDescription(`Sorry, the reason you provided is ${overchar} characters over the 250 character reason limt. Please run this command again using a shorter reason.`)
//                     .setTimestamp()
            
//                 // SENDING MESSAGE
//                 return interaction.reply({ embeds: [reasonTooLargeEmbed], ephemeral: true })
//             }


//             // FETCHING GUILD MEMBER
//             let member = client.users.cache.find(user => user.id === warnUser.id)

            
//             let caseCounter = await infractionsSchema.countDocuments()


//             // CREATE DATABASE ENTRY FOR THE ISSUED WARNING
//             await infractionsSchema.findOneAndUpdate({
//                 USER_ID: warnUser.id,
//                 ACTION: 'WARN',
//                 REASON: warnReason,
//                 STAFF_ID: interaction.user.id,
//                 DATE: new moment(Date.now()).utcOffset(-4).format('LLL'),
//                 CASE_NUM: parseInt(caseCounter)+1
//             },{
//                 USER_ID: warnUser.id,
//                 ACTION: 'WARN',
//                 REASON: warnReason,
//                 STAFF_ID: interaction.user.id,
//                 DATE: new moment(Date.now()).utcOffset(-4).format('LLL'),
//                 CASE_NUM: parseInt(caseCounter)+1
//             },{
//                 upsert: true
//             }).exec();


//             let rolesCh = interaction.guild.channels.cache.find(ch => ch.name === `rules`)


//             // DM THE USER
//             let userWarnEmbed = new discord.MessageEmbed()
//                 .setColor(config.embedOrange)
//                 .setTitle(`Warning Issued`)
//                 .setDescription(`You have been issued a warning in the **${interaction.guild.name}** server by an admin or moderator for the following reason:\n\n*${warnReason}*\n\nPlease create a ticket with <@${config.ModMailId}> if you have questions (instructions can be found in ${rolesCh})`)

//             let notDMable = ``;
//             member.send({ embeds: [userWarnEmbed] })
//                 .catch(err => {
//                     let cannotDMEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedRed)
//                         .setTitle(`${config.emjREDTICK} Error!`)
//                         .setDescription(`**HooterBot was unable to DM ${member} about their warning** (they likely do not allow DMs from server members). Please find another method to inform this user of their warning.`)
//                         .setTimestamp()

//                     // SENDING MESSAGE IN MOD LOG AND PINGING USER
//                     interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [cannotDMEmbed], content: `<@${interaction.user.id}>` })
//                 })


//             // LOG THE ACTION IN THE PUBLIC MOD-ACTIONS CHANNEL
//             let userWarnPublicNoticeEmbed = new discord.MessageEmbed()
//                 .setColor(config.embedOrange)
//                 .setTitle(`Case \#${parseInt(caseCounter)+1}: Warning Issued`)
//                 .setDescription(`**User:** ${member}\n**User ID:** ${member.id}\n**Issued by:** ${interaction.user}\n**Reason:** ${warnReason}`)
//                 .setFooter(``)

//             interaction.guild.channels.cache.find(ch => ch.name === `mod-actions`).send({ embeds: [userWarnPublicNoticeEmbed] })
//                 .catch(err => console.log(err))


//             // CONFIRMATION MESSAGE TO INTERACTION USER
//             let confirmationEmbed = new discord.MessageEmbed()
//                 .setColor(config.embedGreen)
//                 .setTitle(`${config.emjGREENTICK} Warning Successfully Issued`)
//                 .setDescription(`You have successfully issued a warning to ${member}.${notDMable}`)

//             interaction.reply({ embeds: [confirmationEmbed], ephemeral: true });


//             // MOD LOG CHANNEL
//             let modLogEmbed = new discord.MessageEmbed()
//                 .setColor(config.embedRed)
//                 .setTitle(`${config.emjREDTICK} USER WARNED`)
//                 .setDescription(`**User:** ${member}\n**User ID:** ${member.id}\n**Issued by:** ${interaction.user}\n**Reason:** ${warnReason}`)
//                 .setTimestamp()

//             // SENDING MESSAGE IN MOD LOG AND PINGING USER
//             interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [modLogEmbed] })

//         }



//         /*******************/
//         /* MUTE            */
//         /*******************/
//         if(subCmdName == 'mute') {

//             // GETTING OPTIONS VALUES
//             let muteUser = interaction.options.getUser('target_user');
//             let muteMember = interaction.options.getMember('target_user');
//             let muteReason = interaction.options.getString('reason');


//             // REASON TOO LONG
//             if(muteReason.length > 250) {
//                 let overchar = muteReason.length - 250

//                 // GENERATE ERROR EMBED
//                 let reasonTooLargeEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedRed)
//                     .setTitle(`${config.emjREDTICK} Error!`)
//                     .setDescription(`Sorry, the reason you provided is ${overchar} characters over the 250 character reason limt. Please run this command again using a shorter reason.`)
//                     .setTimestamp()
            
//                 // SENDING MESSAGE
//                 return interaction.reply({ embeds: [reasonTooLargeEmbed], ephemeral: true })
//             }


//             // FETCHING GUILD MEMBER
//             interaction.guild.members.fetch(muteUser.id)
//                 .then(async member => {

//                     let hasMutedRole = member.roles.cache.some(role => role.name == 'Muted :(')

//                     // USER IS ALREADY MUTED
//                     if(hasMutedRole == true) {
//                         // GENERATE ERROR EMBED
//                         let alreadyMutedEmbed = new discord.MessageEmbed()
//                             .setColor(config.embedRed)
//                             .setTitle(`${config.emjREDTICK} Error!`)
//                             .setDescription(`Sorry, it appears ${muteUser} is **already muted** and thus, cannot be muted again.`)
//                             .setTimestamp()

//                         // SENDING MESSAGE
//                         return interaction.reply({ embeds: [alreadyMutedEmbed], ephemeral: true })
//                     }


//                     // ADD ROLE
//                     member.roles.add(interaction.guild.roles.cache.find(role => role.name == 'Muted :(').id)
                

//                     // DM THE USER
//                     let userMuteEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedOrange)
//                         .setTitle(`Mute Applied`)
//                         .setDescription(`You have been muted in the **${interaction.guild.name}** server by an admin or moderator for the following reason:\n\n*${muteReason}*\n\nPlease create a ticket with <@${config.ModMailId}> if you have questions (instructions can be found in <#829417860820238356>)`)

//                     // DM USER, INFORM INTERACTION USER IF FAILED TO NOTIFY
//                     member.send({ embeds: [userMuteEmbed] })
//                         .catch(err => {
//                             let cannotDMEmbed = new discord.MessageEmbed()
//                                 .setColor(config.embedRed)
//                                 .setTitle(`${config.emjREDTICK} Error!`)
//                                 .setDescription(`**HooterBot was unable to DM ${member} about their mute** (they likely do not allow DMs from server members). Please find another method to inform this user of their mute.`)
//                                 .setTimestamp()

//                             // SENDING MESSAGE IN MOD LOG AND PINGING USER
//                             interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [cannotDMEmbed], content: `<@${interaction.user.id}>` })
//                         })
                    

//                     let caseCounter = await infractionsSchema.countDocuments()


//                     // CREATE DATABASE ENTRY FOR THE ISSUED MUTE
//                     infractionsSchema.findOneAndUpdate({
//                         USER_ID: muteUser.id,
//                         ACTION: 'MUTE',
//                         REASON: muteReason,
//                         STAFF_ID: interaction.user.id,
//                         DATE: new moment(Date.now()).utcOffset(-4).format('LLL'),
//                         CASE_NUM: parseInt(caseCounter)+1
//                     },{
//                         USER_ID: muteUser.id,
//                         ACTION: 'MUTE',
//                         REASON: muteReason,
//                         STAFF_ID: interaction.user.id,
//                         DATE: new moment(Date.now()).utcOffset(-4).format('LLL'),
//                         CASE_NUM: parseInt(caseCounter)+1
//                     },{
//                         upsert: true
//                     }).exec();

//                     // CREATE DATABASE ENTRY FOR THE ISSUED MUTE
//                     mutedUsersSchema.findOneAndUpdate({
//                         USER_ID: muteUser.id,
//                     },{
//                         USER_ID: muteUser.id,
//                     },{
//                         upsert: true
//                     }).exec();


//                     // LOG THE ACTION IN THE PUBLIC MOD-ACTIONS CHANNEL
//                     let userMutePublicNoticeEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedOrange)
//                         .setTitle(`Case \#${parseInt(caseCounter)+1}: User Muted`)
//                         .setDescription(`**User:** ${muteUser}\n**User ID:** ${muteUser.id}\n**Issued by:** ${interaction.user}\n**Reason:** ${muteReason}`)
//                         .setFooter(``)

//                     interaction.guild.channels.cache.find(ch => ch.name === `mod-actions`).send({ embeds: [userMutePublicNoticeEmbed] })
//                         .catch(err => console.log(err))


//                     // CONFIRMATION MESSAGE TO INTERACTION USER
//                     let confirmationEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedGreen)
//                         .setTitle(`${config.emjGREENTICK} Mute Successfully Issued`)
//                         .setDescription(`You have successfully issued a mute to ${muteUser}.\n\n**Please follow up with this user about the duration of the mute and more details on why they were muted if not included in the reason.**`)

//                     interaction.reply({ embeds: [confirmationEmbed], ephemeral: true });


//                     // MOD LOG CHANNEL
//                     let modLogEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedRed)
//                         .setTitle(`${config.emjREDTICK} USER MUTED`)
//                         .setDescription(`**User:** ${muteUser}\n**User ID:** ${muteUser.id}\n**Performed by:** ${interaction.user}\n**Reason:** ${muteReason}`)
//                         .setTimestamp()

//                     // SENDING MESSAGE IN MOD LOG AND PINGING USER
//                     interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [modLogEmbed] })
//                 })
//         }



//         /*******************/
//         /* UNMUTE          */
//         /*******************/
//         if(subCmdName == 'unmute') {

//             // GETTING OPTIONS VALUES
//             let unmuteUser = interaction.options.getUser('target_user');
//             let unmuteMember = interaction.options.getMember('target_user');
//             let unmuteReason = interaction.options.getString('reason');


//             // REASON TOO LONG
//             if(unmuteReason.length > 250) {

//                 let overchar = unmuteReason.length - 250

//                 // GENERATE ERROR EMBED
//                 let reasonTooLargeEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedRed)
//                     .setTitle(`${config.emjREDTICK} Error!`)
//                     .setDescription(`Sorry, the reason you provided is ${overchar} characters over the 250 character reason limt. Please run this command again using a shorter reason.`)
//                     .setTimestamp()
            
//                 // SENDING MESSAGE
//                 return interaction.reply({ embeds: [reasonTooLargeEmbed], ephemeral: true })
//             }

            
//             // FETCHING GUILD MEMBER
//             interaction.guild.members.fetch(unmuteUser.id)
//                 .then(async member => {

//                     let hasMutedRole = member.roles.cache.some(role => role.name == 'Muted :(')

//                     // USER IS ALREADY UNMUTED
//                     if(hasMutedRole == false) {
//                         // GENERATE ERROR EMBED
//                         let notMutedEmbed = new discord.MessageEmbed()
//                             .setColor(config.embedRed)
//                             .setTitle(`${config.emjREDTICK} Error!`)
//                             .setDescription(`Sorry, it appears ${unmuteUser} is **not currently muted** and thus, cannot be unmuted.`)
//                             .setTimestamp()

//                         // SENDING MESSAGE
//                         return interaction.reply({ embeds: [notMutedEmbed], ephemeral: true })
//                     }


//                     // REMOVE ROLE
//                     member.roles.remove(interaction.guild.roles.cache.find(role => role.name == 'Muted :(').id)


//                     // DM USER, INFORM INTERACTION USER IF FAILED TO NOTIFY
//                     let userMuteEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedGreen)
//                         .setTitle(`Mute Removed`)
//                         .setDescription(`You have been unmuted in the **${interaction.guild.name}** server by an admin or moderator for the following reason:\n\n*${unmuteReason}*`)


//                     member.send({ embeds: [userMuteEmbed] })
//                         .catch(err => {
//                             let cannotDMEmbed = new discord.MessageEmbed()
//                                 .setColor(config.embedRed)
//                                 .setTitle(`${config.emjREDTICK} Error!`)
//                                 .setDescription(`**HooterBot was unable to DM ${unmuteUser} about their mute removal** (they likely do not allow DMs from server members). Please find another method to inform this user of their mute.`)
//                                 .setTimestamp()

//                             // SENDING MESSAGE IN MOD LOG AND PINGING USER
//                             interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [cannotDMEmbed], content: `<@${interaction.user.id}>` })
//                         })


//                     // FETCHING MOST-RECENT MUTE CASE FOR USER
//                     let infractionResult = await infractionsSchema.find({
//                         USER_ID: member.user.id,
//                         ACTION: `MUTE`
//                     }).sort( [['_id', -1]] ).exec();


//                     // DELETING DATABASE ENTRY FOR THE ISSUED MUTE
//                     mutedUsersSchema.deleteOne({
//                         USER_ID: unmuteUser.id,
//                     },{
//                         upsert: true
//                     }).exec();


//                     // LOG THE ACTION IN THE PUBLIC MOD-ACTIONS CHANNEL
//                     let userUnmutePublicNoticeEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedOrange)
//                         .setTitle(`Case \#${infractionResult[0].CASE_NUM} (Update): User Unmuted`)
//                         .setDescription(`**User:** ${member}\n**User ID:** ${member.id}\n**Issued by:** ${interaction.user}\n**Reason:** ${unmuteReason}`)
//                         .setFooter(``)

//                     interaction.guild.channels.cache.find(ch => ch.name === `mod-actions`).send({ embeds: [userUnmutePublicNoticeEmbed] })
//                         .catch(err => console.log(err))


//                     // CONFIRMATION MESSAGE TO INTERACTION USER
//                     let confirmationEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedGreen)
//                         .setTitle(`${config.emjGREENTICK} Mute Successfully Removed`)
//                         .setDescription(`You have successfully removed the mute from ${unmuteUser}.`)

//                     interaction.reply({ embeds: [confirmationEmbed], ephemeral: true });


//                     // MOD LOG CHANNEL
//                     let modLogEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedRed)
//                         .setTitle(`${config.emjREDTICK} USER UNMUTED`)
//                         .setDescription(`**User:** ${member}\n**User ID:** ${member.id}\n**Performed by:** ${interaction.user}\n**Reason:** ${unmuteReason}`)
//                         .setTimestamp()

//                     // SENDING MESSAGE IN MOD LOG AND PINGING USER
//                     interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [modLogEmbed] })
//                 })
//         }



//         /*******************/
//         /* BAN             */
//         /*******************/
//         if(subCmdName == 'ban') {

//             // CHECKING IF USER IS AN ADMIN
//             if(!interaction.member.permissions.has('ADMINISTRATOR')) {
//                 // DEFINING EMBED
//                 let notAdminEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedRed)
//                     .setTitle(`${config.emjREDTICK} Error!`)
//                     .setDescription(`Sorry, like the command description says, you must be an **Administrator** to ban members.`)
//                     .setTimestamp()
                
//                 // SENDING MESSAGE
//                 return interaction.reply({ embeds: [notAdminEmbed], ephemeral: true })
//             }


//             // GETTING OPTIONS VALUES
//             let banUser = interaction.options.getUser('target_user')
//             let banMember = interaction.options.getMember('target_user');;
//             let banReason = interaction.options.getString('reason');
//             let banPurgeDays = interaction.options.getInteger('purge_days');


//             // REASON TOO LONG
//             if(banReason.length > 250) {
//                 let overchar = banReason.length - 250

//                 // GENERATE ERROR EMBED
//                 let reasonTooLargeEmbed = new discord.MessageEmbed()
//                     .setColor(config.embedRed)
//                     .setTitle(`${config.emjREDTICK} Error!`)
//                     .setDescription(`Sorry, the reason you provided is ${overchar} characters over the 250 character reason limt. Please run this command again using a shorter reason.`)
//                     .setTimestamp()
            
//                 // SENDING MESSAGE
//                 return interaction.reply({ embeds: [reasonTooLargeEmbed], ephemeral: true })
//             }


//             // PURGE COUNT CHECK
//             if(banPurgeDays !== null) {
//                 // PURGE DAYS INVALID RANGE
//                 if(banPurgeDays < 1 || banPurgeDays > 7) {
//                     // GENERATE ERROR EMBED
//                     let purgeTooLargeEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedRed)
//                         .setTitle(`${config.emjREDTICK} Error!`)
//                         .setDescription(`Sorry, the purge day value you provided is not valid. Please run this command again using a value between 1 and 7 days (or do not provide if no purge should happen).`)
//                         .setTimestamp()
                
//                     // SENDING MESSAGE
//                     return interaction.reply({ embeds: [purgeTooLargeEmbed], ephemeral: true })
//                 }
//             }

            
//             // FETCHING GUILD MEMBER TO BAN
//             interaction.guild.members.fetch(banUser.id)
//                 .then(async member => {
//                     if(!member.manageable) {
//                         // GENERATE ERROR EMBED
//                         let cannotBanEmbed = new discord.MessageEmbed()
//                             .setColor(config.embedRed)
//                             .setTitle(`${config.emjREDTICK} Error!`)
//                             .setDescription(`Sorry, you are unable to ban this user because they have higher permissions/roles than you.`)
//                             .setTimestamp()
                    
//                         // SENDING MESSAGE
//                         return interaction.reply({ embeds: [cannotBanEmbed], ephemeral: true })
//                     }

                    
//                     // DMING THE USER, INFORM INTERACTION USER IF FAILED TO NOTIFY
//                     let banUserEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedRed)
//                         .setTitle(`Banned`)
//                         .setDescription(`You have been banned from the **${interaction.guild.name}** server by an admin for the following reason:\n\n*${banReason}*`)


//                     member.send({ embeds: [banUserEmbed] })
//                         .catch(err => {
//                             let cannotDMEmbed = new discord.MessageEmbed()
//                                 .setColor(config.embedRed)
//                                 .setDescription(`HooterBot couldn't DM ${banUser} about their ban removal. ***w e l p***`)
//                                 .setTimestamp()

//                             // SENDING MESSAGE IN MOD LOG AND PINGING USER
//                             interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [cannotDMEmbed] })
//                         })



//                     let caseCounter = await infractionsSchema.countDocuments()

//                     // CREATE DATABASE ENTRY FOR THE ISSUED MUTE
//                     infractionsSchema.findOneAndUpdate({
//                         USER_ID: banUser.id,
//                         ACTION: 'BAN',
//                         REASON: banReason,
//                         STAFF_ID: interaction.user.id,
//                         DATE: new moment(Date.now()).utcOffset(-4).format('LLL'),
//                         CASE_NUM: parseInt(caseCounter)+1
//                     },{
//                         USER_ID: banUser.id,
//                         ACTION: 'BAN',
//                         REASON: banReason,
//                         STAFF_ID: interaction.user.id,
//                         DATE: new moment(Date.now()).utcOffset(-4).format('LLL'),
//                         CASE_NUM: parseInt(caseCounter)+1
//                     },{
//                         upsert: true
//                     }).exec();



//                     // BANNING THE USER
//                     // WITH MESSAGE PURGE
//                     if(banPurgeDays !== null) {
//                         member.ban({ reason: banReason, days: banPurgeDays })                        
//                     }
//                     // WITHOUT MESSAGE PURGE
//                     else {
//                         member.ban({ reason: banReason })   
//                     }


//                     // LOG THE ACTION IN THE PUBLIC MOD-ACTIONS CHANNEL
//                     let userUnmutePublicNoticeEmbed = new discord.MessageEmbed()
//                         .setColor(config.embedRed)
//                         .setTitle(`Case \#${parseInt(caseCounter)+1}: User Banned`)
//                         .setDescription(`**User:** ${member}\n**User ID:** ${member.id}\n**Issued by:** ${interaction.user}\n**Reason:** ${banReason}`)
//                         .setFooter(``)

//                     interaction.guild.channels.cache.find(ch => ch.name === `mod-actions`).send({ embeds: [userUnmutePublicNoticeEmbed] })
//                         .catch(err => console.log(err))


                    
//                     if(banPurgeDays !== null) {

//                         // CONFIRMATION MESSAGE TO INTERACTION USER
//                         let confirmationEmbed = new discord.MessageEmbed()
//                             .setColor(config.embedGreen)
//                             .setTitle(`${config.emjGREENTICK} Successfully Banned`)
//                             .setDescription(`You have successfully banned ${banUser} from the server. HooterBot has also deleted ${banPurgeDays} days worth of messages from the user as you requested.`)

//                         interaction.reply({ embeds: [confirmationEmbed], ephemeral: true });
//                     }
//                     else {

//                         // CONFIRMATION MESSAGE TO INTERACTION USER
//                         let confirmationEmbed = new discord.MessageEmbed()
//                             .setColor(config.embedGreen)
//                             .setTitle(`${config.emjGREENTICK} Successfully Banned`)
//                             .setDescription(`You have successfully banned ${banUser} from the server.`)

//                         interaction.reply({ embeds: [confirmationEmbed], ephemeral: true });
//                     }


//                     // MOD LOG NOTICE OF GUILD BAN HAPPENS IN THE guildBanAdd EVENT
//                 })
//         }
//     }
// }