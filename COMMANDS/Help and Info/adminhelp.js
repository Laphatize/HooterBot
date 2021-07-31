const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require(`fs`)
const config = require ('../../config.json')

module.exports = {
    name: `adminhelp`,
    aliases: [`admincommands`],
    description: `Describes ${config.botName}'s commands for administrators. (🗺️📌 *You are here*)`,
    category: `Help and Info`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {




        
    }
}