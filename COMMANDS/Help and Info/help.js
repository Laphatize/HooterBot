const discord = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: `help`,
    aliases: [`commands`],
    description: `Describes ${config.botName}'s commands. (🗺️📌 *You are here*)`,
    category: `Help and Info`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    guildUse: true,
    dmUse: false,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        let helptext = `Here is a list of my commands you can use:\n\n`;

        const commands = []

        // READING COMMANDS
        const readCommands = (dir) => {
            const files = fs.readdirSync(path.join(__dirname, dir))
            
            for (const file of files) {
                const stat = fs.lstatSync(path.join(__dirname, dir, file))
                
                if (stat.isDirectory()) {
                    readCommands(path.join(dir, file))
                } else {
                    const option = require(path.join(__dirname, dir, file))
                    commands.push(option)
                }
            }
        }


        // SETTING PREFIX VALUE USING DATABASE OR DEFAULT
        if(dbData.PREFIX) {
            serverPrefix = dbData.PREFIX;
        } else if(!dbData.PREFIX) {
            serverPrefix = config.prefix;
        }

        for(const command of commands) {
            // CHECK FOR USER PERMS TO AVOID SHARING INFO ABOUT COMMANDS THE USER CANNOT ACCESS
            let { permissions } = command
        
            if(permissions) {
                let hasPerm = true
                
                // SETTING PERMS TO ARRAY JUST IN CASE
                if (typeof permissions === 'string') {
                    permissions = [permissions]
                }

                // IF USER LACKS PERMISSION
                for (const permission of permissions) {
                    if(!message.member.permissions.has(permission)) {
                        hasPerm = false
                        break 
                    }
                }

                // CONTINUING WITH LOOP TO NEXT COMMAND IN ARRAY 
                if (!hasPerm) {
                    continue
                }
            }

            // CHECKING IF STRING OR NOT
            const mainCommand = typeof command.commands === 'string'
                ? command.commands
                : command.commands[0]

            // ACCESS ARGS
            const args = command.expectedArgs
             ? ` ${command.expectedArgs}` 
             : '' 

            // ACCESS DESCRIPTION
            const {description} = command


            // CONCATENATING COMMAND LIST - COMMAND NAME IN BOLD ON FIRST LINE, DESCRIPTION ON SECOND
            helptext += `**${serverPrefix}${mainCommand}${args}**\n${description}\n\n`
        }

        
        // CREATING EMBED FOR RESPONSE        
        let helpEmbed = new discord.MessageEmbed()
        .setColor(config.embedBlue)
        .setTitle(`**Help:**`)
        .setDescription(`${helptext}`)
        .setFooter(`(Crown = Need administrator permissions.)`)
        
        // RESPONDING TO USER WITH COMMAND LIST
        message.channel.send(helpEmbed)
    }
}