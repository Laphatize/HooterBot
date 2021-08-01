const discord = require('discord.js')
const config = require ('../../config.json')
const ticketBlacklistSchema = require('../../Database/ticketBlacklistSchema');

module.exports = {
    name: 'verif_promptembed',
    description: `(ADMIN) Generate/update the verification prompt containing the buttons.`,
    options: [],
    permissions: 'ADMINISTRATOR',
    cooldown: 15,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

    }
}