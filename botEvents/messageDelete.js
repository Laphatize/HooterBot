const discord = require('discord.js')
const config = require('../config.json')
const guildSchema = require('../Database/guildSchema')

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {

        console.log(`A message has been deleted.`)

        // FILTER TO THE ROLES CHANNEL
        if (message.channel.id == config.rolesChannelId) {

            console.log(`This message is within the roles channel.\nMessage: ${message.content}\nChannel: ${message.channel.name}`)

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


            // COMPARE DB MSG ID TO DELETED MESSAGE ID
            if(dbData.VERIF_PROMPT_MSG_ID === message.id ) {
                //IF EQUAL, DELETE MESSAGE ID AND CHANNEL ID FROM DB
                await guildSchema.findOneAndUpdate({
                    GUILD_ID: message.guild.id
                },{
                    // OVERRIDE VALUES SO THEY ARE NULL
                    VERIF_PROMPT_CH_ID: null,
                    VERIF_PROMPT_MSG_ID: null
                },{
                    upsert: true
                })
            } else {
                // THIS ISN'T THE VERIFICATION PROMPT
                return;
            }
        }
    }
}