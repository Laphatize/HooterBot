const discord = require('discord.js')
const guildSchema = require('../Database/guildSchema')
const config = require('../config.json')
const guildPrefixes = {}


module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
   
        // SETTING PREFIX VALUE FROM DATABASE OR DEFAULT
        // CHECK IF DATABASE HAS A VALUE SET FOR THE TICKET CATEGORY - IF IT DOES NOT, TELL USER AND STOP COMMAND.
        const dbData = await guildSchema.findOne({
            GUILD_ID: message.guild.id
        });


        // SETTING PREFIX VALUE USING DATABASE OR DEFAULT
        if(dbData.PREFIX) {
            serverPrefix = dbData.PREFIX;
        } else if(!dbData.PREFIX) {
            serverPrefix = config.prefix;
        }


        // MESSAGE IS NOT A COMMAND, IGNORE
        if (!message.content.startsWith(serverPrefix) || message.author.bot) {
            return
        }


        // GRABBING COMMAND NAME AND ARGUMENTS
        const args = message.content.slice(serverPrefix.length).trim().split(/ +/);
	    const cmdName = args.shift().toLowerCase();

        
        // SETTING COMMAND TO NAME OR TO ALIAS
        const command = client.commands.get(cmdName)
                     || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));


        // IF COMMAND DOESN'T EXIST
        if (!command) {
            return
        }


        // IF COMMAND IS A GUILD-ONLY BUT RUN IN DMs
        if (command.guildOnly && message.channel.type === 'dm') {


            // DEFINING EMBED
            let guildOnlyEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`${config.emjREDTICK} Error: Unable To Send Your Command.`)
            .setDescription(`Hey ${message.author}, sorry for this message, but I wasn't able to send your message just now. For your convenience I've copied information about the command you ran below. I am sending this message because I do not have permission to speak in this channel, you'll want to investigate this.`)
            .addField(`Channel:`, `${message.channel}`)
            .addField(`User:`, `${message.author}`)
            .addField(`Message Content:`, `${message.content}`)


            // SENDING EMBED
            message.channel.send( {embed: [guildOnlyEmbed]} )


            // DELETE AFTER 5 SECONDS
            .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
            .catch(err => console.log(err))
            return
        }


        // IF BOT LACKS PERMISSION TO SPEAK IN THE CHANNEL
        if (!message.guild.me.permissionsIn(message.channel).has('SEND_MESSAGES')) { 
            

            // DEFINING LOG EMBED
            let logTalkPermErrorEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`${config.emjREDTICK} Error: Unable To Send Message in Channel!`)
            .addField(`Channel:`, `${message.channel}`)
            .addField(`User:`, `${message.author}`)
            .addField(`Message Content:`, `${message.content}`)
            .setTimestamp()
            

            // LOG ENTRY
            client.channels.cache.get(config.logActionsChannelId).send({embeds: [logTalkPermErrorEmbed]})


            // DEFINING LOG EMBED FOR DM
            let logTalkPermErrorDMEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`${config.emjREDTICK} Error: Unable To Send Your Command.`)
            .setDescription(`Hey ${message.author}, sorry for this message, but I wasn't able to send your message just now. For your convenience I've copied information about the command you ran below. I am sending this message because I do not have permission to speak in this channel, you'll want to investigate this.`)
            .addField(`Channel:`, `${message.channel}`)
            .addField(`User:`, `${message.author}`)
            .addField(`Message Content:`, `${message.content}`)


            // DM USER WHO ISSUED COMMAND
            message.author.send({embeds: [logTalkPermErrorDMEmbed]})
            return
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
                const role = message.guild.roles.cache.find((role) => role.name === command.requiredRole)


                // VALIDATING ROLE
                if (!role || !member.roles.cache.has(role.id)) {

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
                .setDescription(`Incorrect syntax - use \`\`${serverPrefix}${command.cmdName} ${command.expectedArgs}\`\` and try again.`)
        

            // SENDING EMBED
            message.channel.send({embeds: [cmdArgsErrEmbed]})
            

            // DELETE AFTER 5 SECONDS
            .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
            .catch(err => console.log(err))
            return                   
        }


        // COOLDOWN
        const { cooldowns } = client;
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new discord.Collection());
        }


        // DEFINING PIECES FOR COOLDOWN
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
	    const cooldownTime = (command.cooldown || 0) * 1000;


        if (timestamps.has(message.author.id)) {
            const expireTime = timestamps.get(message.author.id) + cooldownAmount;
    
            if (now < expireTime) {

                const timeLeft = (expireTime - now) / 1000;
                

                // DEFINING EMBED TO SEND
                let cooldownWaitEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Not so fast!`)
                    .setDescription(`You just ran that command. Please wait ${timeLeft.toFixed(1)} more second(s) before running \`\`${command.name}\`\` agaub.`)
                    .setFooter(`(This message will disappear when the cooldown has ended.)`)
        

                // SENDING EMBED
                message.channel.send({embeds: [cooldownWaitEmbed]})
                

                // DELETE AFTER 5 SECONDS
                .then(msg => {client.setTimeout(() => msg.delete(), (timeLeft.toFixed(1))*1000 )})
                .catch(err => console.log(err))
                return
            }
        }

        // SETTING COOLDOWN TIMEOUT
        timestamps.set(message.author.id, now);
	    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


        // EXECUTE COMMAND
        try {
            command.execute(message, args);
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
            .setTitle(`${config.emjREDTICK} Error: Unable To Execute Command in Channel!`)
            .addField(`Channel:`, `${message.channel}`)
            .addField(`User:`, `${message.author}`)
            .addField(`Message Content:`, `${message.content}`)
            .setTimestamp()
            

            // LOG ENTRY
            client.channels.cache.get(config.logActionsChannelId).send({embeds: [logErrorEmbed]})
        }
    }
}




// CONNECT TO DB
module.exports.loadPrefixes = async (client) => {
    for (const guild of client.guilds.cache) {
        const guildID = guild[1].id

        const result = await guildSchema.findOne({ GUILD_ID: guildID })
        try {
            guildPrefixes[guildID] = result.prefix
        }
        catch(error) {
            // THE SERVER DOES NOT HAVE A CUSTOM PREFIX, IGNORE.
        }
    }
}