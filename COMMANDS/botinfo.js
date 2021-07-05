const discord = require('discord.js')
var pjson = require('../package.json');
const config = require ('../config.json')


module.exports = {
    commands: ['info', 'botinfo'],
    expectedArgs: '',
    cooldown: 60,
    permissionError: '',
    description: `Describes the details about ${config.botName}.`,
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text, client) => {

        // UPTIME CALCULATION
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let botUptime = `${days}D, ${hours}H, ${minutes}M and ${seconds}S`;
        
        // CREATING EMBED FOR RESPONSE        
        let infoEmbed = new discord.MessageEmbed()
        .setColor(config.embedTempleRed)
        .setTitle(`**Information:**`)
        .addField(`Developer:`, `<@${config.botAuthorId}>`, true)
        .addField(`Bot Version:`, `**${pjson.version}**`, true)
        .addField(`Build Date:`, `${config.buildDate}`, true)
        .addField(`${config.emjNodejs} NodeJS:`, `${process.version.split(`v`).pop()}`, true)
        .addField(`${config.emjDiscordjs} Discord.js:`, `${pjson.dependencies['discord.js'].split(`^`).pop().split(`-`)}`, true)
        .addField(`Uptime:`, `${botUptime}`, true)
        .addField(`Description:`, `*"${pjson.description}"*`)
        .addField(`GitHub Repository`, `${pjson.repository.url.split(`+`).pop()}`)
        .setThumbnail('https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/HooterBot_Square_Shadow.png')

        // RESPONDING TO USER WITH INFO EMBED
        message.channel.send(infoEmbed)
    },
    permissions: '',
    requiredRoles: [],
}