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
        .setDescription(`${config.botName} is built by <@${config.botAuthorId}> in his free time to improve the server. HooterBot runs on the newest version of Discord.js (✨ ***v13***, *fancy...* ✨), uses brand new features from Discord like buttons, slash commands (*Soon™*), ephemeral messages, and more. The bot's code is also open source (\`\`$botinfo\`\` for link).
        \nThis is not ${config.botAuthorUsername}'s first Discord bot, but it is his first to utilize and rely on a database connection for functionality. As ${config.botName} grows with new features, the costs to keep the bot online will increase.
        \nIf you want to support ${config.botName}'s development and operations, check out ${config.botAuthorUsername}'s GitHub Sponsor page:`)
        .addField(`GitHub Sponsor Page`, `https://github.com/sponsors/MrMusicMan789`)
        .setThumbnail('https://avatars.githubusercontent.com/u/58273574?v=4')

        
        // RESPONDING TO USER WITH INFO EMBED
        message.channel.send({embeds: [infoEmbed]})
    }
}