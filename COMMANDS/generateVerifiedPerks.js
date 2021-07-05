const discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    commands: ['verifyPerksEmbed'],
    expectedArgs: '',
    cooldown: -1,
    permissionError: ``,
    description: `(${config.emjAdmin}) Generate the embed in the \#roles channel so users can view the list of perks for verifying.`,
    minArgs: 0,
    maxArgs: 0,
    callback: async (message, arguments, text, client) => {

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );

        
        // EMBED MESSAGE
        let ticketEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`**Why Verify?**`)
            .setDescription(`Students, alumni, and employee of Temple University gain access to additional channels and permissions in the server:`)
            .addField(`Image posting and GIF embed:`, "Server-wide (non-verified can only post/embed in <#829409161581821999>, <#831152843166580777>, and <#832649518079672340>)")
            .addField(`Channel access:`, `<#829445602868854804>, <#831527136438255626>, <#832976391985168445>, and <#829629393629872159>`)
            .addField(`Posting abilities:`, `<#829732282079903775>`)
            .addField(`Voice chat features:`, `Screen sharing`)

        // POSTING EMBED MESSAGE AND BUTTON
        await message.channel.send(ticketEmbed);
    },
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
}