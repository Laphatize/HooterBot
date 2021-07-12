const discord = require('discord.js')
const config = require ('../../config.json');
const birthdaySchema = require('../../Database/birthdaySchema');
const moment = require('moment');

module.exports = {
    name: `forgetbirthday`,
    aliases: [`forgetbday`],
    description: `A command to set your birthday so HooterBot can announce it in the server.`,
    category: `Miscellaneous`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    guildUse: true,
    dmUse: true,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        // CHECKING FOR DATABASE ENTRY FOR USER
        const dbBirthdayData = await birthdaySchema.findOne({
            USER_ID: message.author.id
        }).exec();


        // IF DB INFO DOES NOT EXIST FOR USER, INFORM
        if(!dbBirthdayData) {
            let birthdayDNE = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`Sorry, **I do not have a birthday stored for you!**`)

            // SENDING TO CHANNEL
            message.channel.send({embeds: [birthdayDNE]})
            return;
        }

        await birthdaySchema.deleteOne({
            USER_ID: message.author.id
        }).exec();


        // CHANNEL CONFIRMATION
        let bdayRemoveEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjGREENTICK} **Birthday Removed.**`)
            .setDescription(`I have successfully forgotten your birthday.`)

        // SENDING TO CHANNEL
        message.channel.send({embeds: [bdayRemoveEmbed]})
            .catch(err => console.log(err))
        return



        
    },
}