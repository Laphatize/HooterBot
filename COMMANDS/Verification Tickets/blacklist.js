const discord = require('discord.js');
const config = require('../../config.json');
const ticketBlacklistSchema = require('../../Database/ticketBlacklistSchema');

module.exports = {
    name: `blacklist`,
    aliases: [`ticketblacklist`],
    description: `Blacklists a user from being able to create verification tickets.`,
    category: `Verification`,
    expectedArgs: '<USER_ID> (reason - optional)',
    cooldown: 5,
    minArgs: 1,
    maxArgs: 1,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        // GRABBING USER ID FROM MSG, FETCHING USER
        let userId = arguments[0];
        const blacklistUser = await message.guild.members.fetch(userId)
        let combinedArgs = arguments.join('')
        let reason = combinedArgs.substring(userId.length+1);

        console.log(`reason = "${reason}"`)

        if (!reason) {
            reason = "(No reason provided)"
        }


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
        await ticketBlacklistSchema.findOneAndUpdate({
            USER_ID: userId
        },{
            USER_ID: userId
        },{
            upsert: true
        }).exec();
        
            
        // CONFIRMATION EMBED
        let confirmationEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`User Successfully Blacklisted`)
            .setDescription(`${blacklistUser} (ID: ${userId}) is now blacklisted from the verification system.\nIf this is not the user you intended, please inform <@${config.botAuthorId}> immediately.`)

        // SENDING CONFIRMATION
        message.channel.send({ embeds: [confirmationEmbed] })


        // LOG EMBED
        let blacklistLogEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`Blacklisted User Added`)
            .setDescription(`This user is now prevented from opening or using the verification system:`)
            .addField(`User:`, `${blacklistUser}`, true)
            .addField(`User ID:`, `${userId}`, true)
            .addField(`Reason:`, `${reason}`)
            .setTimestamp()
    
        // LOG ENTRY
        return client.channels.cache.get(config.logActionsChannelId).send({embeds: [blacklistLogEmbed]})
    }
}