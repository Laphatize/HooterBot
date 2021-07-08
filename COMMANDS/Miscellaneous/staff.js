const discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `staff`,
    aliases: [``],
    description: `Generates a list of current server staff for the Temple University Discord server.`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    guildUse: true,
    dmUse: true,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        let adminRole = message.guild.roles.cache.find((role) => role.name === "Admin");
        let modRole = message.guild.roles.cache.find((role) => role.name === "Moderator");

        let adminList = message.guild.roles.cache.get(adminRole);
        let modList =  message.guild.roles.cache.get(modRole);

        console.log(`adminList = ${adminList}\n`)
        console.log(`modList = ${modList}\n`)


        // CREATING EMBED FOR RESPONSE        
        let serverStaffList = new discord.MessageEmbed()
        .setColor(config.embedTempleRed)
        .setTitle(`**Temple University server staff:**`)
        .addField(`Admins:`, ``)
        .addField(`Moderators:`, ``)
        .setThumbnail('https://raw.githubusercontent.com/MrMusicMan789/HooterBot/main/HooterBot_Square_Shadow.png')


        // // POSTING LINK
        // await message.reply({embeds: [serverStaffList] })
        // .catch(err => console.log(err))
        // return;
    }
}