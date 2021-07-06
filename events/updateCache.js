const guildSchema = require('../Database/guildSchema')
const guildPrefixes = {}


// CONNECT TO DB
module.exports = {
    name: 'loadPrefixes',
    async execute(client) {
        for (const guild of client.guilds.cache) {
            const guildID = guild[1].id

            const result = await guildSchema.findOne({ GUILD_ID: guildID })
            try {
                guildPrefixes[guildID] = result.prefix
            }
            catch(error) {
                // THE SERVER DOES NOT HAVE A CUSTOM PREFIX, IGNORE.
            }
        }
    }
}