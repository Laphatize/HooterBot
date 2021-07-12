const discord = require('discord.js')
const config = require ('../../config.json');
const birthdaySchema = require('../../Database/birthdaySchema');
const moment = require('moment');

module.exports = {
    name: `setbirthday`,
    aliases: [`setbday`],
    description: `A command to set your birthday so HooterBot can announce it in the server.`,
    category: `Miscellaneous`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    guildUse: true,
    dmUse: true,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        message.channel.reply(`I will forget your birthday as soon as MMM789 gives me the code to do so.`)
        
    },
}