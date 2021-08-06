const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

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
                  .addField(`Roles`, `Grab roles in ${rolesChannel} to describe yourself and to denote your college or school.\nWe have a ${config.emjVerified} **verified role** for students and staff of Temple University that grants additional features in the server (access to more channels, image sharing abilities, and more!)`)
                  .addField(`Ask Questions`, `Get answers from current students to the questions you have about Temple University in ${questionsChannel}`)
                  .addField(`Rules`, `Take a minute to look over the server's ${rulesChannel}`)
                  .addField(`Need help?`, `If you encounter any problems in the server, please contact the moderators and admins by opening a ModMail ticket - DM <@${ModMailId}> to get started.`)

            // SENDING DM EMBED
            await member.send({embeds: [welcomeDMEmbed]})
                  .catch(err => console.log(err))

            
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
            


            // ACCOUNT AGE
            const accountAge = moment(member.user.createdAt).format('lll') + '\n*' + moment(new Date()).diff(member.user.createdAt, 'days') + ' days ago*';

            // AGE WARNING
            let ageWarning
            if(moment(member.user.createdAt).format('Z') < moment(Date.now()).subtract(1, 'hours').format('Z')) {
                  return ageWarning = `${config.emjERROR} **ACCOUNT IS LESS THAN 1 HOUR OLD**`
            }
            if(moment(member.user.createdAt).format('Z') < moment(Date.now()).subtract(12, 'hours').format('Z')) {
                  return ageWarning = `${config.emjERROR} **ACCOUNT IS LESS THAN 12 HOURS OLD**`
            }
            if(moment(member.user.createdAt).format('Z') < moment(Date.now()).subtract(1, 'days').format('Z')) {
                  return ageWarning = `${config.emjERROR} **ACCOUNT IS LESS THAN 1 DAY OLD**`
            }

            console.log(`moment(member.user.createdAt).format('Z')          = ${moment(member.user.createdAt).format('Z')}`)
            console.log(`moment(Date.now()).subtract(1, 'days').format('Z') = ${moment(Date.now()).subtract(1, 'days').format('Z')}`)


            // JOIN EMBED
            let logJoinGuild = new discord.MessageEmbed()
                  .setColor(config.embedGreen)
                  .setTitle(`New Server Member`)
                  .addField(`User:`, `${member}`, true)
                  .addField(`Tag:`, `${member.user.tag}`, true)
                  .addField(`ID:`, `${member.id}`, true)
                  .addField(`Account Created:`, `${accountAge} ${ageWarning}`, true)
                  .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logJoinGuild]})
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