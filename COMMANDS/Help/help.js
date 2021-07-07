const discord = require('discord.js')
const config = require ('../../config.json')
const guildSchema = require('../../Database/guildSchema');

module.exports = {
    name: `help`,
    aliases: [`commands`],
    description: `Describes ${config.botName}'s commands. (🗺️📌 *You are here*)`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    guildOnly: false,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
            GUILD_ID: message.guild.id
        });


        // SETTING PREFIX VALUE USING DATABASE OR DEFAULT
        if(dbData.PREFIX) {
            serverPrefix = dbData.PREFIX;
        } else if(!dbData.PREFIX) {
            serverPrefix = config.prefix;
        }


        const data = [];
		const { commands } = message.client;


		if (!arguments.length) {
			data.push(`Here\'s a list of my commands you can use:`);
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${serverPrefix}help [command name]\` to get info on a specific command!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
		}

		const name = arguments[0].toLowerCase();
		const command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.expectedArgs) data.push(`**Usage:** ${serverPrefix}${command.name} ${command.expectedArgs}`);
        if (command.cooldown > 0) data.push(`**Cooldown:** ${command.cooldown} second(s)`);

		message.channel.send({content: data, split: true });
	},
};


















/*************************************************/
//
//          THE OLD HELP COMMAND
//
/*************************************************/
        
//         // DELETING INVOCATION MESSAGE
//         client.setTimeout(() => message.delete(), 0 );

//         let helptext = `Here is a list of the commands you can use, ${message.author}:\n\n`;
//         let commandList = ''; // THE LIST OF COMMMANDS GENERATED

//         // const commands = loadCommands()

//         // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
//         const dbData = await guildSchema.findOne({
//             GUILD_ID: message.guild.id
//         });


//         // SETTING PREFIX VALUE USING DATABASE OR DEFAULT
//         if(dbData.PREFIX) {
//             serverPrefix = dbData.PREFIX;
//         } else if(!dbData.PREFIX) {
//             serverPrefix = config.prefix;
//         }

//         for(const command of commands) {
//             // CHECK FOR USER PERMS TO AVOID SHARING INFO ABOUT COMMANDS THE USER CANNOT ACCESS
//             let { permissions } = command
        
//             if(permissions) {
//                 let hasPerm = true
                
//                 // SETTING PERMS TO ARRAY JUST IN CASE
//                 if (typeof permissions === 'string') {
//                     permissions = [permissions]
//                 }

//                 // IF USER LACKS PERMISSION
//                 for (const permission of permissions) {
//                     if(!message.member.permissions.has(permission)) {
//                         hasPerm = false
//                         break 
//                     }
//                 }

//                 // CONTINUING WITH LOOP TO NEXT COMMAND IN ARRAY 
//                 if (!hasPerm) {
//                     continue
//                 }
//             }

//             // CHECKING IF STRING OR NOT
//             const mainCommand = typeof command.commands === 'string'
//                 ? command.commands
//                 : command.commands[0]

//             // ACCESS ARGS
//             const args = command.expectedArgs
//              ? ` ${command.expectedArgs}` 
//              : '' 

//             // ACCESS DESCRIPTION
//             const {description} = command


//             // CONCATENATING COMMAND LIST - COMMAND NAME IN BOLD ON FIRST LINE, DESCRIPTION ON SECOND
//             commandList += `**${serverPrefix}${mainCommand}${args}**\n${description}\n\n`
//         }

        
//         // CREATING EMBED FOR RESPONSE        
//         let helpEmbed = new discord.MessageEmbed()
//         .setColor(config.embedBlue)
//         .setTitle(`**Help:**`)
//         .setDescription(`${commandList}`)
//         .setFooter(`(Crown = Need administrator permissions.)`)
        
//         // RESPONDING TO USER WITH COMMAND LIST
//         message.channel.send({content: helptext, embeds: [helpEmbed]})
//     }
// }