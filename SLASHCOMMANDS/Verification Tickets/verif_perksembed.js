const discord = require('discord.js')
const config = require ('../../config.json')
const ticketBlacklistSchema = require('../../Database/ticketBlacklistSchema');

module.exports = {
    name: 'verif_perksembed',
    description: `(ADMIN) Generate/update the verification perks embed message. [CD: 15s]`,
    options: [],
    permissions: 'ADMINISTRATOR',
    cooldown: 15,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

    }
}