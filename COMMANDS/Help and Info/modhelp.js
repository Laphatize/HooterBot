const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require(`fs`)
const config = require ('../../config.json')

module.exports = {
    name: `modhelp`,
    aliases: [`modcommands`],
    description: `Describes ${config.botName}'s commands for moderators. (🗺️📌 *You are here*)`,
    category: `Help and Info`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    permissions: 'MANAGE_CHANNELS',
    requiredRoles: [],
    execute: async (message, arguments, client) => {


    }
}