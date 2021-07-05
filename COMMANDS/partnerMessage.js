const discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    commands: ['partnerMessage'],
    expectedArgs: ' <partner name> | <message> ',
    cooldown: -1,
    permissionError: ``,
    description: `(${config.emjAdmin}) Generate an embed in \#server-announcements to promote messages from partner servers.`,
    minArgs: 1,
    maxArgs: 1,
    callback: async (message, arguments, text, client) => {        

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );


        // COMBINING ARGS INTO STRING SO FULL MESSAGE CAN BE POSTED
        const fullCommand = arguments.join(' ');

        if (fullCommand.includes("|")) {
            // IF NO TICKET CATEGORY, SEND MESSAGE IN CHANNEL
            let notFormattedEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`${config.emjREDTICK} **Error!**`)
            .setDescription(`You need to use a `` | `` in your command. Use the following format:\n\n \`\` <partner name> | <message> \`\``)

            // SENDING TO CHANNEL
            message.channel.send({embeds: [notFormattedEmbed]})
            // DELETE AFTER 10 SECONDS
            .then(msg => {client.setTimeout(() => msg.delete(), 10000 )})
            .catch(err => console.log(err))
            return
        }


        // SPLITTING STRING TO REMOVE PREFIX AND COMMAND INVOCATION


        
        
        // EMBED MESSAGE
        let partnerEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`**Announcement from our partnered server**`)
            .setDescription(`fullCommand ${fullCommand}`)
            .addField(`Want to join this partnered server?`, `Head to <#832684556598640691> for the invite link!`)


        // POSTING EMBED MESSAGE AND BUTTON
        await client.channels.cache.get(config.serverAnnouncementsId).send({embeds: [partnerEmbed]})
    },
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
}