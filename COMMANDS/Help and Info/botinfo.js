const discord = require('discord.js')
var pjson = require('../../package.json');
const config = require ('../../config.json')

module.exports = {
    name: `botinfo`,
    aliases: [`info`],
    description: `Describes the details about ${config.botName}.`,
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


        // UPTIME CALCULATION
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let botUptime = `${days}D, ${hours}H, ${minutes}M and ${seconds}S`;
        
        let DJSv = pjson.dependencies['discord.js'].split(`^`).pop().split('-', 1)[0]

        if(pjson.dependencies['discord.js'].split(`^`).pop().includes('dev')) {
            devVer = pjson.dependencies['discord.js'].split(`-`).pop()
            DJSversion = DJSv.concat(`\n*(${devVer})*`)
        }
        else {
            DJSversion = DJSv;
        }


        // CREATING EMBED FOR RESPONSE        
        let infoEmbed = new discord.MessageEmbed()
        .setColor(config.embedTempleRed)
        .setTitle(`**Information:**`)
        .addField(`Developer:`, `<@${config.botAuthorId}>`, true)
        .addField(`Bot Version:`, `**${pjson.version}**`, true)
        .addField(`Build Date:`, `${config.buildDate}`, true)
        .addField(`${config.emjNodejs} NodeJS:`, `${process.version.split(`v`).pop()}`, true)
        .addField(`${config.emjDiscordjs} Discord.js:`, `${DJSversion}`, true)
        .addField(`Uptime:`, `${botUptime}`, true)
        .addField(`Description:`, `*"${pjson.description}"*`)
        .addField(`GitHub Repository`, `${pjson.repository.url.split(`+`).pop()}`)
        .setThumbnail('https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/HooterBot_Square_Shadow.png')

        
        // RESPONDING TO USER WITH INFO EMBED
        message.channel.send({embeds: [infoEmbed]})
    }
}