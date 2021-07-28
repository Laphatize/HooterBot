const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../config.json');
const ticketBlacklistSchema = require('../../Database/ticketBlacklistSchema');

module.exports = {
    name: `blacklist`,
    aliases: [`ticketblacklist`],
    description: `Blacklists a user from being able to create verification tickets.`,
    category: `Verification`,
    expectedArgs: '<USER_ID>',
    cooldown: 0,
    minArgs: 1,
    maxArgs: 1,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        let userId = arguments[0];

        
        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await ticketBlacklistSchema.findOne({
            GUILD_ID: message.guild.id
        }).exec();


        if(dbData.USER_ID == userId) {

            // DEFINING EMBED
            let alreadyBlacklistedEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} This user is already blacklisted`)
                .setDescription(`This user ID has already been added to the database.`)
                .setTimestamp()
            
            // SENDING TO USER
            return message.channel.send({ embeds: [alreadyBlacklistedEmbed] })
                .catch(err => console.log(err))
        }
        

        // FETCH GUILD USER VIA ID
        const blacklistUser = await guild.members.fetch(userId)


        // STORING IN DATABASE THE RULE EMBED'S MESSAGE ID AND CHANNEL ID
        await ticketBlacklistSchema.findOne({
            // CONTENT USED TO FIND UNIQUE ENTRY
            USER_ID: userId
        },{
            // CONTENT TO BE UPDATED
            GUILD_ID: message.guild.id,
            GUILD_NAME: message.guild.name,
            USER_ID: userId,
            USER_NAME: blacklistUser.username
        },{ 
            upsert: true
        }).exec();
        
            
        // CONFIRMATION
        let confirmationEmbed = new discord.MessageEmbed()
        .setColor(config.embedGreen)
        .setTitle(`${config.embedGreen} User added to Verification Blacklist`)
        .addField(`User:`, blacklistUser, true)
        .addField(`Username:`, blacklistUser.username, true)
        .addField(`User ID:`, userId, true)
        .setTimestamp()
    

        // SENDING TO USER
        return message.channel.send({ embeds: [confirmationEmbed] })
            .catch(err => console.log(err))
    }
}