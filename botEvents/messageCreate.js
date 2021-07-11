const discord = require('discord.js');
const config = require('../config.json');
const { prefix } = require('../config.json');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {

        // MESSAGE IS NOT A COMMAND OR IS A MESSAGE FROM THE BOT
        if (!message.content.startsWith(prefix) || message.author.bot)   return;


        // GRABBING COMMAND NAME AND ARGUMENTS
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();
        

        // SETTING COMMAND TO NAME OR TO ALIAS
        const command = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
  

        // COMMAND DNE
        if(!command) {
            return;
        }


        // // ENSURING GUILD USE ONLY IN GUILD
        // if (command.dmUse === false && message.channel.type === 'dm') {

        //     // DEFINING EMBED
        //     let guildDisallowEmbed = new discord.MessageEmbed()
        //     .setColor(config.embedRed)
        //     .setTitle(`${config.emjREDTICK} Error: command cannot be used in servers.`)
        //     .setDescription(`Hey ${message.author}, sorry, but the command you just used, \`\`${cmdName}\`\`, cannot be run in server channels, only here in DMs. To see which commands can be run in channels, type \`\`${prefix} <something>\`\`.`)
        //     .setFooter(`This message will self-destruct in 30 seconds. Beep, boop...`)

        //     // SENDING EMBED
        //     return message.author.send( {embeds: [guildDisallowEmbed]} )
        //     // DELETE AFTER 30 SECONDS
        //     .then(msg => {client.setTimeout(() => msg.delete(), 30000 )})
        //     .catch(err => console.log(err));
        // }


        // // ENSURING DM USE ONLY IN DMS
        // if (command.guildUse === false && message.channel.type === 'text') {

        //     // DEFINING EMBED
        //     let dmDisallowEmbed = new discord.MessageEmbed()
        //     .setColor(config.embedRed)
        //     .setTitle(`${config.emjREDTICK} Error: command cannot be used outside of DMs.`)
        //     .setDescription(`Hey ${message.author}, sorry, but the command you just used, \`\`${cmdName}\`\`, cannot be run in DMs, only in the Temple University server. To see which commands can be run in channels, type \`\`${prefix} <something>\`\`.`)
        //     .setFooter(`This message will self-destruct in 30 seconds. Beep, boop...`)

        //     // SENDING EMBED
        //     return message.author.send( {embeds: [dmDisallowEmbed]} )
        //     // DELETE AFTER 30 SECONDS
        //     .then(msg => {client.setTimeout(() => msg.delete(), 30000 )})
        //     .catch(err => console.log(err));
        // }

        
        // *******************
        // NON-DM RESTRICTIONS
        // *******************
        if(!message.channel.type === 'dm') {
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
                const msgAuthorPerms = message.channel.permissionsFor(message.author);

                if (!msgAuthorPerms || !msgAuthorPerms.has(command.permissions)) {

                    // DELETING INVOCATION MESSAGE
                    client.setTimeout(() => message.delete(), 0 );


                    // DEFINING EMBED TO SEND
                    let cmdUserPermErrEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Sorry!`)
                    .setDescription(`You must have the \`\`${permissions}\`\` permission to use this command.`)


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
        }

        // ENSURE CORRECT NUMBER OF ARGS
        if (args.length < command.minArgs || (command.maxArgs !== null && args.legnth > command.maxArgs)) {
            

            // DEFINING EMBED TO SEND
            let cmdArgsErrEmbed = new discord.MessageEmbed()
                .setColor(config.embedOrange)
                .setTitle(`${config.emjORANGETICK} Sorry!`)
                .setDescription(`Incorrect syntax - use \`\`${prefix}${cmdName} ${command.expectedArgs}\`\` and try again.`)


            // SENDING INCORRECT SYNTAX NOTICE
            if(message.channel.type === 'dm') {
                message.author.send({embeds: [cmdArgsErrEmbed]})
                    // DELETE AFTER 5 SECONDS
                    .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
                    .catch(err => console.log(err))
                    return
            } else {
                message.channel.send({embeds: [cmdArgsErrEmbed]})
                    // DELETE AFTER 5 SECONDS
                    .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
                    .catch(err => console.log(err))
                    return   
            }
        }
        // ***************************
        // END OF NON-DM RESTRICTIONS
        // ***************************

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
                if(message.channel.type === 'dm') {
                    message.author.send({embeds: [cooldownWaitEmbed]})
                        // DELETE AFTER 5 SECONDS
                        .then(msg => {client.setTimeout(() => msg.delete(), (timeLeft)*1000 )})
                        .catch(err => console.log(err))
                        return
                } else {
                    message.channel.send({embeds: [cooldownWaitEmbed]})
                        // DELETE AFTER 5 SECONDS
                        .then(msg => {client.setTimeout(() => msg.delete(), (timeLeft)*1000 )})
                        .catch(err => console.log(err))
                        return
                }
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
                // IF CHANNEL
                if(message.channel.type === 'dm') {
                    message.author.send({embeds: [errorEmbed]})
                } else {
                    message.channel.send({embeds: [errorEmbed]})
                }


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