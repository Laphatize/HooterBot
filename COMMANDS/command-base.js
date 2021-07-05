const discord = require('discord.js')
const guildSchema = require('../Database/guildSchema')
const config = require('../config.json')
const guildPrefixes = {}

const validatePerms =  (permissions) => {
    const validPerms = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
        'USE_SLASH_COMMANDS'
    ]

    // IF PERM USED THAT IS NOT VALID
    for (const permission of permissions) {
        if (!validPerms.includes(permission)) {
            throw new Error(`Unknown permission node "${permission}".`)
        }
    }
}

// FOR COOLDOWN
let recentCmdRun = []


// DEFAULT COMMAND VALUES
module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = `You do not have permission to run this command.`,
        minArgs = 0,
        maxArgs = null,
        cooldown = -1,  // NEGATIVE COOLDOWN IS IGNORED, SO NO COOLDOWN BY DEFAULT
        permissions = [],
        requiredRoles = [],
        callback,
    } = commandOptions

    // ENSURING COMMAND AND ALIASES ARE IN AN ARRAY
    if (typeof commands === 'string') {
        commands = [commands]
    }

    console.log(`Command: "${commands[0]}"`)

    // ENSURE PERMS IN ARRAY AND VALID
    if (permissions.length) {
        if (typeof permissions === 'string') {
            permissions = [permissions]
        }
    
        validatePerms(permissions)
    }

    // MESSAGE LISTENER
    client.on('messageCreate', async (message) => {
        const { member, content, guild } = message
        
        // IGNORE DM USE
        if(message.channel.type == "dm") {
            return;
        }
        
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

        for (const alias of commands) {
            const command = `${serverPrefix}${alias.toLowerCase()}`
        
            // A COMMAND HAS BEEN RUN
            if (content.toLowerCase().startsWith(`${command} `) || content.toLowerCase() === command) {
                
                // ENSURE USER HAS PERMISSIONS
                for (const permission of permissions) {
                    if (!member.permissions.has(permission)) {
                        // DEFINING EMBED TO SEND
                        let cmdUserPermErrEmbed = new discord.MessageEmbed()
                        .setColor(config.embedOrange)
                        .setTitle(`${config.emjORANGETICK} Sorry!`)
                        .setDescription(`${permissionError}\nYou must have the \`\`${permissions}\`\` permission to use this command.`)

                        message.channel.send({embeds: [cmdUserPermErrEmbed]})
                        return
                    }
                }

                // ENSURE USER HAS REQUIRED ROLE
                for (const requiredRole of requiredRoles) {
                    const role = message.guild.roles.cache.find((role) => role.name === requiredRole)
                    
                    // VALIDATING ROLE
                    if (!role || !member.roles.cache.has(role.id)) {
                        // DEFINING EMBED TO SEND
                            let cmdPermErrEmbed = new discord.MessageEmbed()
                            .setColor(config.embedOrange)
                            .setTitle(`${config.emjORANGETICK} Sorry!`)
                            .setDescription(`You must have the \`\`${requiredRoles}\`\` role to use this command.`)

                        // SENDING EMBED
                        message.channel.send({embeds: [cmdPermErrEmbed]})

                        // DELETE AFTER 5 SECONDS
                        .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
                        .catch(err => console.log(err))
                        return
                    }
                }

                // ENSURING COMMAND USAGE FOR COOLDOWN
                let cooldownString = `${guild.id}-${member.id}-${commands[0]}`
                if (cooldown > 0 && recentCmdRun.includes(cooldownString)) {
                    message.channel.send(`Sorry, ${message.author} you just ran that command. Please wait ${cooldown} seconds before running the command again.`)
                    .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
                    return
                }

                // SPLITTING ON ANY NUMBER OF SPACES
                // E.g. treating "!cmd _ X" the same as "!cmd _ _ X"
                const arguments = content.split(/[ ]+/)


                // REMOVE COMMAND FROM INVOCATION
                arguments.shift()


                // DEFINING EMBED TO SEND
                let cmdSyntaxErrEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Sorry!`)
                    .setDescription(`Incorrect syntax - use \`\`${serverPrefix}${alias} ${expectedArgs}\`\` and try again.`)


                // ENSURE CORRECT NUMBER OF ARGS
                if (arguments.length < minArgs || (maxArgs !== null && arguments.legnth > maxArgs)) {
                    message.channel.send({embeds: [cmdSyntaxErrEmbed]})

                    // DELETE AFTER 5 SECONDS
                    .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
                    .catch(err => console.log(err))
                    return                   
                }

                // CHECKING IF COOLDOWN IS PRESENT
                if(cooldown > 0) {
                    // ADD COOLDOWN STRING TO ARRAY
                    recentCmdRun.push(cooldownString)
                
                    setTimeout(() => {
                        recentCmdRun = recentCmdRun.filter((string) => {
                            return string !== cooldownString
                        })
                    }, 1000 * cooldown)
                }


                // HANDLING CUSTOM COMMAND CODE
                callback(message, arguments, arguments.join(' '), client)

                return
            }
        }
    })
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