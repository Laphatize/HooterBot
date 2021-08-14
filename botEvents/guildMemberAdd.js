const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');
const mutedUsersSchema = require('../Database/mutedUsersSchema');



module.exports = {
	name: 'guildMemberAdd',
	async execute(member, client) {

        // IGNORE BOT
        if(member.id == config.botId)   return;
    
        const rolesChannel = member.guild.channels.cache.find(ch => ch.name === `roles`)
        const questionsChannel = member.guild.channels.cache.find(ch => ch.name === `📬｜temple-questions`)
        const rulesChannel = member.guild.channels.cache.find(ch => ch.name === `rules`)
        const introduceYourselfChannel = member.guild.channels.cache.find(ch => ch.name === `📢｜introduce-yourself`)
        const joinsChannel = member.guild.channels.cache.find(ch => ch.name === `joins`)
        const ModMailId = config.ModMailId;

        // DM EMBED MESSAGE
		const welcomeDMEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`**Welcome!** ${config.emjTempleT}`)
            .setDescription(`Hey **${member.user.username}**, welcome to the **Temple University server**. ${config.emjAnimatedWave}`)
            .addField(`Say Hi`, `Consider saying hi by posting a welcome message to fellow Owls in ${introduceYourselfChannel}.`)
            .addField(`Roles`, `Grab roles in ${rolesChannel} to describe yourself and to denote your college or school.\nWe have a ${config.emjVerified} **verified role** for students and staff of Temple University that grants additional features in the server (access to more channels, image sharing abilities, and more!).`)
            .addField(`Ask Questions`, `Get answers from current students to the questions you have about Temple University in ${questionsChannel}.`)
            .addField(`Rules`, `Take a minute to look over the server's ${rulesChannel}.`)
            .addField(`Need help?`, `If you encounter any problems in the server, please contact the moderators and admins by opening a ModMail ticket - see ${rulesChannel} for instructions.`)

        // SENDING DM EMBED
        await member.send({embeds: [welcomeDMEmbed]})
            .catch(err => {
                console.log(`Welcome message could not be sent to ${member.user.tag}.`)
            })

        
        // DEFINING STRINGS FOR WELCOME MESSAGES IN #joins
        const channelMsgEnding = ` Grab some roles in ${rolesChannel} and say hi to your fellow Owls in ${introduceYourselfChannel}`;
            
            
        // CREATING RANDOM START TO THE STRING
        const channelMsgStart = createStart(member);

        
        // CONCATENATE GENERIC ENDING TO STRING
        let fullWelcomeMessage = channelMsgStart.concat(channelMsgEnding);
        

        // SEND TO #joins CHANNEL
        await joinsChannel.send({content: fullWelcomeMessage})
            .catch(err => console.log(err))


        // LOGGING NEW USER JOINING GUILD
        const modLogChannel = member.guild.channels.cache.find(ch => ch.name === `mod-log`)
        


        // ACCOUNT CREATION DATE
        const accountCreated = `${moment(member.user.createdAt).format('LLL')}`


        // ACCOUNT AGE CALCULATION
        let totalSeconds = moment(new Date()).diff(member.user.createdAt, 'seconds');
        
        // YEARS
        let yearValue = Math.floor(totalSeconds / 31536000 );
            totalSeconds %= 31536000

        // MONTHS
        let monthValue = Math.floor(totalSeconds / 2628288 );
            totalSeconds %= 2628288

        // DAYS
        let dayValue = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;

        // HOURS
        let hourValue = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;

        // MINUTES
        let minuteValue = Math.floor(totalSeconds / 60);

        // SECONDS
        let secondValue = Math.floor(totalSeconds % 60);


        // AGE IN RELATIVE TIME
        let ageArray = [];
            if(yearValue > 1) ageArray.push(`${yearValue} years, `)
            if(yearValue == 1) ageArray.push(`${yearValue} year, `)
            
            if(monthValue > 1) ageArray.push(`${monthValue} months, `)
            if(monthValue == 1) ageArray.push(`${monthValue} month, `)
            if(monthValue == 0 && yearValue > 0) ageArray.push(`${monthValue} months, `)

            if(dayValue > 1 || dayValue == 0) ageArray.push(`${dayValue} days, `)
            if(dayValue == 1) ageArray.push(`${dayValue} day, `)
            if(dayValue == 0 && monthValue > 0) ageArray.push(`${dayValue} days, `)

            if(hourValue > 1 || hourValue == 0) ageArray.push(`${hourValue} hours, `)
            if(hourValue == 1) ageArray.push(`${hourValue} hour, `)
            if(hourValue == 0 && dayValue > 0) ageArray.push(`${hourValue} hours, `)

            if(minuteValue > 1 || minuteValue == 0) ageArray.push(`${minuteValue} minutes, `)
            if(minuteValue == 1) ageArray.push(`${minuteValue} minute, `)
            if(minuteValue == 0 && hourValue > 0) ageArray.push(`${minuteValue} minutes, `)

            if(secondValue > 1 || secondValue == 0) ageArray.push(`and ${secondValue} seconds. `)
            if(secondValue == 1) ageArray.push(`and ${secondValue} second.`)
            if(secondValue == 0 && minuteValue > 0) ageArray.push(`and ${secondValue} seconds. `)

        const accountAge = ageArray.join('')

        // AGE WARNING
        let ageWarning = " "
        if( yearValue == 0 && monthValue == 0 && dayValue == 0 && hourValue <= 23 ) {
            ageWarning = `\n${config.emjERROR} ***ACCOUNT IS LESS THAN 1 DAY OLD***`
        }
        if( yearValue == 0 && monthValue == 0 && dayValue == 0 && hourValue <= 11 ) {
            ageWarning = `\n${config.emjERROR} ***ACCOUNT IS LESS THAN 12 HOURS OLD***`
        }
        if( yearValue == 0 && monthValue == 0 && dayValue == 0 && hourValue == 0 ) {
            ageWarning = `\n${config.emjERROR} ***ACCOUNT IS LESS THAN 1 HOUR OLD***`
        }
        if( yearValue == 0 && monthValue == 0 && dayValue == 0 && hourValue == 0 && minuteValue <= 5 ) {
            ageWarning = `\n${config.emjERROR} ***ACCOUNT IS LESS THAN 5 MINUTES OLD***`
        }


        // JOIN EMBED
        let logJoinGuild = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`New Server Member`)
            .addField(`User:`, `${member}`, true)
            .addField(`Tag:`, `${member.user.tag}`, true)
            .addField(`ID:`, `${member.id}`, true)
            .addField(`Account Created:`, `${accountCreated}${ageWarning}`)
            .addField(`Account Age:`, `${accountAge}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logJoinGuild]})

        
        console.log(`Checking if ${member.user.username} has been logged as muted.`)

        // CHECK IF USER IS MUTED IN THE DATABASE
        const dbMutedData = await mutedUsersSchema.findOne({
            USER_ID: member.id
        }).exec();

        // USER JOINING SHOULD BE MUTED
        if(dbMutedData) {
            console.log(`User was muted, reapplying role...`)
            
            // FETCHING MUTED ROLE
            let mutedRole = member.guild.roles.cache.find(role => role.name == 'Muted :(')
            
            // APPLYING ROLE TO USER
            member.roles.add(mutedRole.id)

            console.log(`Mute has been reapplied.`)
        }
    },
};



// FUNCTION THAT GENERATES THE RANDOM START OF THE WELCOME MESSAGE
function createStart(member) {
      const channelMsgStart = [
            `Welcome to the nest, ${member}! ${config.emjTempleT}`,
            `Welcome to the nest, ${member}! ${config.emjTempleTWhite}`,
            `Welcome to the nest, ${member}! ${config.emjOwl}`,
            `Thanks for flying in, ${member}! ${config.emjHooter1}`,
            `Thanks for flying in, ${member}! ${config.emjHooter2}`,
            `${config.emjOwl} Welcome to the server, ${member}!`,
            `${config.emjTempleT} Welcome to the server, ${member}!`,
            `${config.emjTempleTWhite} Welcome to the server, ${member}!`,
            `${config.emjHooter1} Welcome to the server, ${member}!`,
            `${config.emjHooter2} Welcome to the server, ${member}!`,
            ];      
      return channelMsgStart[Math.floor(Math.random() * channelMsgStart.length)];
}