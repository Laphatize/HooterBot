const discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member, client) {

            // IGNORE BOT
            if(member.id == config.botId)   return;
      
            const rolesChannel = client.channels.cache.find(ch => ch.name === `roles`)
            const questionsChannel = client.channels.cache.find(ch => ch.name === `📬｜temple-questions`)
            const rulesChannel = client.channels.cache.find(ch => ch.name === `rules`)
            const introduceYourselfChannel = client.channels.cache.find(ch => ch.name === `📢｜introduce-yourself`)
            const joinsChannel = client.channels.cache.find(ch => ch.name === `joins`)
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
            const modLogChannel = client.channels.cache.find(ch => ch.name === `mod-log`)
            
            // CALCULATING DISCORD AGE
            let discordAge = moment(Date.now()).subtract(member.createdTimestamp, 'minutes')

            console.log(`discordAge = ${discordAge}`)

            // JOIN EMBED
            let logJoinGuild = new discord.MessageEmbed()
                  .setColor(config.embedGreen)
                  .setTitle(`New Server Member`)
                  .addField(`User:`, `${member}`, true)
                  .addField(`Username:`, `${member.name}`, true)
                  .addField(`ID:`, `${member.id}`, true)
                  .addField(`Joined Discord:`, `${moment(member.createdTimestamp).format(`LL`)}`)
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