const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member, client) {
      
            rolesChannel = config.rolesChannelId;
            questionsChannel = config.questionsChannelId;
            rulesChannel = config.rulesChannelId;
            introduceYourselfChannel = config.introductionsChannelId;
            ModMailId = config.ModMailId;

            
            const joinsChannel = client.channels.cache.get(config.joinsChannelId)

            // DM EMBED MESSAGE
		const welcomeDMEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`**Welcome!** ${config.emjTempleT}`)
            .setDescription(`Hey **${member.user.username}**, welcome to the **Temple University server**. 👋`)
            .addField(`Say Hi`, `Consider saying hi by posting a welcome message to fellow Owls in <#${introduceYourselfChannel}>.`)
            .addField(`Roles`, `Grab roles in <#${rolesChannel}> to describe yourself and to denote your college or school.\nWe have a ${config.emjVerified} **verified role** for students and staff of Temple University that grants additional features in the server (access to more channels, image sharing abilities, and more!`)
            .addField(`Ask Questions`, `Get answers from current students to the questions you have about Temple University in <#${questionsChannel}>`)
            .addField(`Rules`, `Take a minute to look over the server's <#${rulesChannel}>`)
            .addField(`Need help?`, `If you encounter any problems in the server, please contact the moderators and admins by opening a ModMail ticket - DM <@${ModMailId}> to get started.`)

            // SENDING DM EMBED
            member.send({embeds: [welcomeDMEmbed]})
            .catch(err => console.log(err))

            
            // DEFINING STRINGS FOR WELCOME MESSAGES IN #joins
            const channelMsgEnding = ` Grab some roles in <#${rolesChannel}> and say hi to your fellow Owls in <#${introduceYourselfChannel}>`;
            
            
            // CREATING RANDOM START TO THE STRING
            const channelMsgStart = createStart(member);

            // CONCATENATE GENERIC ENDING TO STRING
            let fullWelcomeMessage = channelMsgStart.concat(channelMsgEnding);
            
            // SEND TO #joins CHANNEL
            joinsChannel.send({content: [fullWelcomeMessage]})
            .catch(err => console.log(err))
	},
};



// FUNCTION THAT GENERATES THE RANDOM START OF THE WELCOME MESSAGE
function createStart(member) {
      const channelMsgStart = [
            `Welcome to the nest, ${member}! ${config.emjTempleT}`,
            `Welcome to the nest, ${member}! ${config.emjTempleTWhite}`,
            `Thanks for flying in, ${member}! ${config.emjHooter2}`,
            `Thanks for flying in, ${member}! ${config.emjHooter1}`,
            `${config.emjOwl} Welcome to the server, ${member}!`,
            `${config.emjTempleT} Welcome to the server, ${member}!`,
            `${config.emjTempleTWhite} Welcome to the server, ${member}!`,
            `${config.emjHooter1} Welcome to the server, ${member}!`,
            `${config.emjHooter1} Welcome to the server, ${member}!`,
            ];      
      return channelMsgStart[Math.floor(Math.random() * channelMsgStart.length)];
}