const discord = require('discord.js')
var pjson = require('../../package.json');
const config = require ('../../config.json')

module.exports = {
    name: `sponsor`,
    aliases: [`support`, `donate`],
    description: `Describes information on how you can help support the development and operations of ${config.botName}.`,
    category: `Help and Info`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    permissions: '',
    requiredRoles: [],
    execute: (message, arguments, client) => {

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );


        // CREATING EMBED FOR RESPONSE        
        let infoEmbed = new discord.MessageEmbed()
        .setColor(config.embedBlurple)
        .setTitle(`**Support HooterBot!**`)
        .setDescription(`${config.botName} relies on a database connection for functionality. As ${config.botName} grows with new features, costs to keep the bot online will be incurred.
        \nIf you want to support ${config.botName}'s development and operations, check out ${config.botAuthorUsername}'s GitHub Sponsor page:`)
        .addField(`GitHub Sponsor Page`, `https://github.com/sponsors/MrMusicMan789`)
        .setThumbnail('https://avatars.githubusercontent.com/u/58273574?v=4')

        
        // RESPONDING TO USER WITH INFO EMBED
        message.channel.send({embeds: [infoEmbed]})
    }
}