const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `initialprompt`,
    aliases: [`verifprompt1`],
    description: `(${config.emjAdmin}) A demo command to prototype the embed initially sent to a user looking to verify.`,
    expectedArgs: '',
    cooldown: -1,
    minArgs: 0,
    maxArgs: 0,
    guildUse: false,
    dmUse: true,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {


        // POSTING EMBED MESSAGE AND BUTTON
        await message.channel.send({content: "This is a DM which means things are working."})
    }
}