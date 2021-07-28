const discord = require('discord.js');
const config = require('../../config.json');
const ticketBlacklistSchema = require('../../Database/ticketBlacklistSchema');

module.exports = {
    name: `blacklist`,
    aliases: [`ticketblacklist`],
    description: `Blacklists a user from being able to create verification tickets.`,
    category: `Verification`,
    expectedArgs: '<USER_ID>',
    cooldown: 5,
    minArgs: 1,
    maxArgs: 1,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        // GRABBING USER ID FROM MSG, FETCHING USER
        let userId = arguments[0];
        const blacklistUser = await message.guild.members.fetch(userId)
        

        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await ticketBlacklistSchema.findOne({
            USER_ID: userId
        }).exec();


        // IF ENTRY ALREADY EXISTS
        if(dbData) {

            // DEFINING EMBED
            let alreadyBlacklistedEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Error!`)
                .setDescription(`${blacklistUser} has already been added to the blacklist.`)
                .setTimestamp()
            
            // SENDING MESSAGE
            return message.channel.send({ embeds: [alreadyBlacklistedEmbed] })
                .catch(err => console.log(err))
                .then(msg => {
                    client.setTimeout(() => msg.delete(), 5000 );
                })
        }


        // STORING IN DATABASE THE USER ID
        await ticketBlacklistSchema.insert({
            // CONTENT USED TO FIND UNIQUE ENTRY
            USER_ID: userId
        }).exec();
        
            
        // CONFIRMATION EMBED
        let confirmationEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`Successfully added to blacklist`)
            .setDescription(`${blacklistUser} (ID: ${userId}) has been successfully blacklisted from using the verification system.`)

        // SENDING CONFIRMATION
        message.channel.send({ embeds: [confirmationEmbed] })
            .catch(err => console.log(err))
            .then(msg => {
                client.setTimeout(() => msg.delete(), 1000 );
            })


        // LOG EMBED
        let blacklistLogEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`User added to verification blacklist`)
            .setDescription(`This user is now unable to open or use the verification system.\nPlease inform ${config.botAuthor} if this needs to be reversed.`)
            .addField(`User:`, blacklistUser, true)
            .addField(`Username:`, blacklistUser.username, true)
            .addField(`User ID:`, userId, true)
            .setTimestamp()
    
        // LOG ENTRY
        return client.channels.cache.get(config.logActionsChannelId).send({embeds: [blacklistLogEmbed]})
    }
}