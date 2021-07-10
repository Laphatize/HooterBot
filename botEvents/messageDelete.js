const discord = require('discord.js')
const config = require('../config.json')
const guildSchema = require('../Database/guildSchema')

module.exports = {
	name: 'messageDelete',
	async execute(message, client) {

        console.log(`A message has been deleted.`)

        // FILTER TO THE RULES OR ROLES CHANNELS
        if (message.channel.id == config.rulesChannelId || message.channel.id == config.rolesChannelId) {

            // LOGGING TEST
            if(message.channel.id == config.rulesChannelId) console.log(`This message is in the rules channel.\nMessage: ${message.content}\nChannel: ${message.channel.name}\nMessage ID: ${message.id}`)
            if(message.channel.id == config.rolesChannelId) console.log(`This message is in the roles channel.\nMessage: ${message.content}\nChannel: ${message.channel.name}\nMessage ID: ${message.id}`)


            // CHECK THAT THERE IS ACTUALLY A DATABASE ENTRY FOR GUILD
            const dbData = await guildSchema.findOne({
                GUILD_ID: message.guild.id
            });


            // IF A MESSAGE ID CAN'T BE FETCHED
            if(!dbData.VERIF_PROMPT_MSG_ID) {
                // DEFINING LOG EMBED
                let logDbFetchErrorEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Error: unable to fetch value from database.`)
                .addField(`Channel:`, `${message.channel}`)
                .addField(`User:`, `${message.author}`)
                .addField(`Database value sought:`, `\`\`VERIF_PROMPT_MSG_ID\`\``)
                .addField(`Action:`, `Fetch message ID so database value can be removed so a new prompt can be made.`)

                // LOG ENTRY
                client.channels.cache.get(config.logActionsChannelId).send({embeds: [logDbFetchErrorEmbed]})
                    .catch(err => console.log(err))
                return;
            }

            console.log(`\"dbData.VERIF_PROMPT_MSG_ID === message.id\" yields: ${dbData.VERIF_PROMPT_MSG_ID === message.id}`)

            // COMPARE DB MSG ID TO DELETED MESSAGE ID
            if(dbData.VERIF_PROMPT_MSG_ID === message.id) {
                //IF EQUAL, OVERRIDE MESSAGE ID AND CHANNEL ID FROM DB
                await guildSchema.findOneAndUpdate({
                    GUILD_ID: message.guild.id
                },{
                    VERIF_PROMPT_CH_ID: null,
                    VERIF_PROMPT_MSG_ID: null
                },{
                    upsert: true
                })

                console.log(`The Verification Prompt has been removed from ${message.channel.name}.`)
            } else {
                // THIS ISN'T THE VERIFICATION PROMPT
                return;
            }
        }
    }
}