const discord = require('discord.js');
const config = require('../config.json');
const ticketSchema = require('../Database/ticketSchema');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {

        // NORMALLY I'D HAVE THE BOT IGNORE ITS OWN MESSAGES HERE, BUT THAT'S BEEN REMOVED FOR TESTING...

                            
        // TICKET CHANNEL NAME
        let ticketChannelName = `verify-${message.author.username.toLowerCase()}`;

        console.log(`message.channel.type = ${message.channel.type}`)

        // IF PARTIAl, FETCH THE FULL THING
        if(message.partial) {
            message.fetch()
            .then(message => {
                

                // IN DMS, CHECK IF USER HAS A TICKET OPEN BY MATCHING THEIR USERNAME TO CHANNEL
                if (message.channel.type === 'DM') {

                    // IGNORE HOOTERBOT'S OWN MESSAGES
                    if(message.author.bot)   return;


                    // CHECK IF A CHANNEL EXISTS BY THIS NAME FOR THE USER - 
                    if (message.guild.channels.cache.find(ch => ch.name === `verify-${message.author.username}`)) {

                        // THE USER HAS A TICKET OPEN, SEND MESSAGE CONTENT TO THIS CHANNEL
                        console.log(`${message.author.username} has a ticket open. Rerouting DM message content to channel...`)


                        // GRABBING TICKET CHANNEL FOR THE USER
                        modAdminTicketCh = message.guild.channels.cache.get(ch => ch.name === ticketChannelName)


                        // GRABBING MESSAGE CONTENT AND FORMATTING FOR EMBED
                        let userTicketMsg = new discord.MessageEmbed()
                            .setColor(config.embedGrey)
                            .setAuthor(message.author.username, message.author.displayAvatarURL())
                            .setDescription(message.content)
                            .setTimestamp()

                        // SENDING MESSAGE FROM DMs TO MOD/ADMIN TICKET CHANNEL
                        return modAdminTicketCh.send({ embeds: [userTicketMsg] })
                    }
                }
            })
        }



        // IN TICKET CHANNEL, FETCH USERNAME FROM THE CHANNEL NAME
        if(message.channel.name.startsWith(`verify-`)) {

            // IGNORE HOOTERBOT'S OWN MESSAGES
            if(message.author.bot)   return;
            

            // GRAB THE USERNAME FROM THE CHANNEL THE MESSAGE WAS SENT IN
            dmUsername = message.channel.name.split('-').pop()


            // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
            const dbTicketData = await ticketSchema.findOne({
                GUILD_ID: message.guild.id
            }).exec();


            // FETCHING USER'S ID FROM DATABASE, THEN USER
            ticketUserId = dbTicketData.CREATOR_ID;
            ticketUser = client.users.cache.get(ticketUserId);


            // GRABBING MESSAGE CONTENT AND FORMATTING FOR EMBED
            let userTicketMsg = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(message.content)
                .setTimestamp()

            // SENDING MESSAGE FROM MOD/ADMIN TICKET CHANNEL TO USER IN DMs
            return ticketUser.send({ embeds: [userTicketMsg] })
        }
















        // MESSAGE IS A COMMAND
        if(message.content.startsWith(config.prefix)) {

            // GRABBING COMMAND NAME AND ARGUMENTS
            const args = message.content.slice(config.prefix.length).trim().split(/ +/);
            const cmdName = args.shift().toLowerCase();
            

            // SETTING COMMAND TO NAME OR TO ALIAS
            const command = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
    

            // COMMAND DNE
            if(!command) {
                return;
            }


            // CHECKING IF BOT HAS PERMISSION TO SPEAK IN THE CHANNEL
            if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) { 

                console.log(`Bot cannot speak in the channel "${message.channel.name}" of the guild ${message.guild.name}.`)

                // DEFINING LOG EMBED
                let logTalkPermErrorEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error: unable to send message in channel.`)
                    .addField(`Channel:`, `${message.channel}`)
                    .addField(`User:`, `${message.author}`)
                    .addField(`Message Content:`, `${message.content}`)
                    .setFooter(`This may be a permissions error either with my role or with the channel. Please take a moment to investigate.`)

                // LOG ENTRY
                client.channels.cache.get(config.logActionsChannelId).send({embeds: [logTalkPermErrorEmbed]})
                    .catch(err => console.log(err))


                // DEFINING LOG EMBED FOR DM
                let logTalkPermErrorDMEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error: unable to send your command.`)
                    .setDescription(`Hey ${message.author.username}, sorry to DM you, but I wasn't able to send your message just now. For your convenience, here's information about the command you ran below:`)
                    .addField(`Server:`, `${message.guild.name}`)
                    .addField(`Channel:`, `${message.channel}`)
                    .addField(`Message Content:`, `${message.content}`)
                    .setFooter(`You are receiving this because I do not have permission to speak in the channel listed. If I should be able to speak in this channel, please let the server owner know so they can investigate the channel and my role permissions.`)

                // DM USER WHO ISSUED COMMAND VIA CACHE
                client.users.cache.get(message.author.id).send({embeds: [logTalkPermErrorDMEmbed]})
                    .catch(err => { console.log(err)

                    // IF NOT CACHED, ATTEMPT DM DIRECTLY
                    message.author.send({embeds: [logTalkPermErrorDMEmbed]})
                        .catch(err => console.log(err))
                    })
                return;
            }


            // CHECKING USER PERMISSION REQUIREMENT
            if (command.permissions) {
                const authorPerms = message.channel.permissionsFor(message.author);

                if (!authorPerms || !authorPerms.has(command.permissions)) {

                    // DELETING INVOCATION MESSAGE
                    client.setTimeout(() => message.delete(), 0 );


                    // DEFINING EMBED TO SEND
                    let cmdUserPermErrEmbed = new discord.MessageEmbed()
                        .setColor(config.embedOrange)
                        .setTitle(`${config.emjORANGETICK} Sorry!`)
                        .setDescription(`You must have the \`\`${command.permissions}\`\` permission to use this command.`)


                    message.channel.send({embeds: [cmdUserPermErrEmbed]})
                    // DELETE AFTER 5 SECONDS
                        .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
                        .catch(err => console.log(err));
                    return
                }
            }


            // CHECKING USER ROLE REQUIREMENT
            if(command.requiredRoles) {
                for (const requiredRole of command.requiredRoles) {
                    const role = message.guild.roles.cache.find((role) => role.name === requiredRole)

                    // VALIDATING ROLE
                    if (!role || !message.member.roles.cache.has(role.id)) {

                        // DEFINING EMBED TO SEND
                            let cmdRoleErrEmbed = new discord.MessageEmbed()
                                .setColor(config.embedOrange)
                                .setTitle(`${config.emjORANGETICK} Sorry!`)
                                .setDescription(`You must have the \`\`${role}\`\` role to use this command.`)


                        // SENDING EMBED
                        message.channel.send({embeds: [cmdRoleErrEmbed]})


                        // DELETE AFTER 5 SECONDS
                            .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
                            .catch(err => console.log(err))
                        return
                    }
                }
            }


            // ENSURE CORRECT NUMBER OF ARGS
            if (args.length < command.minArgs || (command.maxArgs !== null && args.legnth > command.maxArgs)) {
                

                // DEFINING EMBED TO SEND
                let cmdArgsErrEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Sorry!`)
                    .setDescription(`Incorrect syntax - use \`\`${config.prefix}${cmdName} ${command.expectedArgs}\`\` and try again.`)


                // SENDING INCORRECT SYNTAX NOTICE
                message.channel.send({embeds: [cmdArgsErrEmbed]})
                    // DELETE AFTER 5 SECONDS
                    .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
                    .catch(err => console.log(err))
                return
            }


            // COOLDOWN SETUP
            const { cooldowns } = client;

            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new discord.Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownTime = (command.cooldown || 0) * 1000;
            

            // COOLDOWN 
            if (timestamps.has(message.author.id)) {
                const expireTime = timestamps.get(message.author.id) + cooldownTime;
        
                if (now < expireTime) {

                    const timeLeft = ((expireTime - now) / 1000).toFixed(0);

                    // DEFINING EMBED TO SEND
                    let cooldownWaitEmbed = new discord.MessageEmbed()
                        .setColor(config.embedOrange)
                        .setTitle(`${config.emjORANGETICK} Not so fast!`)
                        .setDescription(`You just ran that command. Please wait ${timeLeft} more second(s) before running \`\`${cmdName}\`\` again.`)
                        .setFooter(`(This message will disappear when the cooldown has ended.)`)
            

                    // SENDING COOLDOWN WAIT NOTICE
                    message.channel.send({embeds: [cooldownWaitEmbed]})
                        // DELETE AFTER 5 SECONDS
                        .then(msg => {client.setTimeout(() => msg.delete(), (timeLeft)*1000 )})
                        .catch(err => console.log(err))
                    return
                }
            }

            // SETTING COOLDOWN TIMEOUT
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownTime);


            // EXECUTE COMMAND
            try {
                command.execute(message, args, client);
            } catch (error) {
                console.error(error);

                // DEFINING EMBED TO SEND IN CHANNEL
                let errorEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error!`)
                    .setDescription(`There was an error trying to execute that command.`)


                // SENDING EMBED
                message.channel.send({embeds: [errorEmbed]})


                // DEFINING LOG EMBED
                let logErrorEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error: unable to execute command in channel!`)
                    .addField(`Channel:`, `${message.channel}`)
                    .addField(`User:`, `${message.author}`)
                    .addField(`Message Content:`, `${message.content}`)
                    .setTimestamp()
                

                // LOG ENTRY
                client.channels.cache.get(config.logActionsChannelId).send({embeds: [logErrorEmbed]})
            }
        }
    }
}