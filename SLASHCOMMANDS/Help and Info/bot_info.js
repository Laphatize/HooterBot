const discord = require('discord.js')
const pjson = require('../../package.json');
const config = require ('../../config.json')


module.exports = {
    name: 'bot_info',
    description: `Describes details about ${config.botName}. [60s]`,
    options: [],
    permissions: '',
    dmUse: false,
    cooldown: 60,
    defaultPermission: true,
    run: async(client, interaction, args) => {

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
        let DJSemoji;

        // IF DEV BRANCH OF DJS
        if(pjson.dependencies['discord.js'].split(`^`).pop().includes('dev')) {
            devVer = pjson.dependencies['discord.js'].split(`-`).pop()
            DJSversion = DJSv.concat(`\n*(${devVer})*`)
            DJSemoji = config.emjDJSdev
        }
        // OTHERWISE, JUST DJS
        else {
            DJSversion = DJSv;
            DJSemoji = config.emjDJS
        }


        // CREATING EMBED FOR RESPONSE        
        let infoEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`**Information:**`)
            .addField(`Developer:`, `<@${config.botAuthorId}>`, true)
            .addField(`Bot Version:`, `**${pjson.version}**`, true)
            .addField(`Build Date:`, `${config.buildDate}`, true)
            .addField(`${config.emjNodejs} NodeJS:`, `${process.version.split(`v`).pop()}`, true)
            .addField(`${DJSemoji} Discord.js:`, `${DJSversion}`, true)
            .addField(`Uptime:`, `${botUptime}`, true)
            .addField(`Description:`, `*"${pjson.description}"*`)
            .addField(`GitHub Repository:`, `${pjson.repository.url.split(`+`).pop()}`)
            .addField(`Latest Bot Update:`, `https://github.com/MrMusicMan789/HooterBot/releases`)
            .setThumbnail('https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/HooterBot_Square_Shadow.png')

        interaction.reply({ embeds: [infoEmbed] })
    }
}