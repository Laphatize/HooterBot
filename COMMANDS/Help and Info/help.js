const discord = require('discord.js')
const config = require ('../../config.json')
const ms = require('ms')

module.exports = {
    name: `help`,
    aliases: [`commands`],
    description: `Describes ${config.botName}'s commands. (🗺️📌 *You are here*)`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    guildUse: true,
    dmUse: false,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        if(!arguments.length) {
            let commandListEmbed = new discord.MessageEmbed()
            .setDescription(
                `${[...client.categories]
                    .map((value) =>
                        `${value[0].toUpperCase() + value.slice(1).toLowerCase()}
                        [${client.commands.filter((cmd) => 
                            cmd.category == value.toLowerCase()).size}]
                        \n${client.commands.filter((cmd) => cmd.category == value.toLowerCase())
                            .map((value) => value.name)
                            .join(", ")
                    }`)
                .join("\n\n")}`
            );
            
            message.channel.send({ embeds: [commandListEmbed] })
        } else {


            // GRABBING COMMANDS AND ALIASES
            const cmd = client.commands.get(arguments[0].toLowerCase()) || client.commands.get(client.aliases.get(arguments[0].toLowerCase()))


            // IF NO COMMANDS OR ALIASES FOUND
            if(!cmd) {
                let helpCmdError = new discord.MessageEmbed()
                    .setTitle(`${config.emjREDTICK} Error!`)
                    .setDescription(`No commands have been found. This is *prooobably* an error.`)

                return message.channel.send(helpCmdError);
            }

            // DEFINING EMBED
            const embed = new discord.MessageEmbed()
            embed.setTitle(`${cmd.name[0].toUpperCase() + cmd.name.slice(1).toLowerCase()}`)
            

            // GRABBING PROPERTIES OF COMMAND
            const properties = Object.entries(cmd);
            

            // SETTING PROPERTIES IN DESCRIPTION
            embed.setDescription(properties.filter((value) => typeof value[1] != "function").map((value) => {
                const key = value[0][0].toUpperCase() + value[0].slice(1).toLowerCase();
                
                if(typeof value[1] == 'string') {
                    return `\`${key}\`: ${value[1]}`
                }

                else if(typeof value[1] == 'number') {
                    return `\`${key}\`: ${ms(value[1], { long: true })}`
                }

                else if(typeof value[1].map == 'function') {
                    return `\`${key}\`: ${value[1].join(`, `)}`
                }

                else {
                    return `\`${key}\`: ${value[1]}`
                }
            }))

            return message.channel.send(embed)
        }
    }
}