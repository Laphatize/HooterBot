const discord = require('discord.js')
const config = require ('../../config.json');
const birthdaySchema = require('../../Database/birthdaySchema');
const moment = require('moment');

module.exports = {
    name: `addbirthday`,
    aliases: [`addbday`],
    description: `A command for admins to migrate MEE6's birthdays over to HooterBot.`,
    category: `Administrator`,
    expectedArgs: '<User_ID> ## / ##  [month / day]',
    cooldown: 10,
    minArgs: 1,
    maxArgs: 1,
    guildUse: true,
    dmUse: true,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        console.log(`arguments = ${arguments}`)

        return;

        // GRABBING FULL ARGS - TRIMMING WHITESPACE, JOINING
        const combinedArgs = arguments.join('')


        // CHECK DATABASE FOR ENTRY
        const dbBirthdayData = await birthdaySchema.findOne({
            USER_ID: message.author.id
        }).exec();


        // IF A DB ENTRY EXISTS FOR THE USER ALREADY
        if(dbBirthdayData) {
            let birthdayExists = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`That user's birthday already exists in the database.`)

            // SENDING TO CHANNEL
            message.channel.send({embeds: [birthdayExists]})
            return;
        }



        // DOES NOT FOLLOW FORMATTING
        if(!combinedArgs.includes("/")) {
            let notFormattedEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`You need to use a \`\` / \`\` in your command to separate the month and day. Use the following format:\n\n \`\` ## / ##  (month / day) \`\`\n\n(e.g. \`\`${moment(Date.now()).utcOffset(-5).format(`MM / DD`)}\`\` for today.).`)

            // SENDING TO CHANNEL
            message.channel.send({embeds: [notFormattedEmbed]})
                // DELETE AFTER 10 SECONDS
                .then(msg => {client.setTimeout(() => msg.delete(), 10000 )})
                .catch(err => console.log(err))
            return
        }


        // SPLITTING INTO MONTH AND DAY VALUE
        let month = combinedArgs.substring(0, combinedArgs.indexOf('/'));
        let day = combinedArgs.split(`/`).pop();

        

        // NO DAY VALUE PROVIDED
        if(!day) {
            let missingDayEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`You need to provide a number for both the month and day. Use the following format:\n\n \`\` ## / ##  (month / day)\`\`\n\n(e.g. \`\`${moment(Date.now()).utcOffset(-5).format(`MM / DD`)}\`\` for today.).`)

            // SENDING TO CHANNEL
            message.channel.send({embeds: [missingDayEmbed]})
                // DELETE AFTER 10 SECONDS
                .then(msg => {client.setTimeout(() => msg.delete(), 10000 )})
                .catch(err => console.log(err))
            return
        }



        // CHECKING ARGUMENTS ARE NUMBERS
        if(isNaN(day) || isNaN(month)) {
            let argNumCheckEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`The value entered does not follow the date format needed. Please use:\n\n \`\` ## / ##  (month / day)\`\`\n\n(e.g. \`\`${moment(Date.now()).utcOffset(-5).format(`MM / DD`)}\`\` for today.).`)

            // SENDING TO CHANNEL
            message.channel.send({embeds: [argNumCheckEmbed]})
                // DELETE AFTER 10 SECONDS
                .then(msg => {client.setTimeout(() => msg.delete(), 10000 )})
                .catch(err => console.log(err))
            return
        }



        // CHECKING DAY HAS VALID RANGE
        if(month < 1 || month > 12) {
            let monthRangeEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`The value for the month is outside possible values. Please make sure the month is between 1 and 12.`)

            // SENDING TO CHANNEL
            message.channel.send({embeds: [monthRangeEmbed]})
                // DELETE AFTER 5 SECONDS
                .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
                .catch(err => console.log(err))
            return
        }
        
        
        
        // CHECKING DAY HAS VALID RANGE
        if(day < 1 || day > 31) {
            let dayRangeEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`The value for the day is outside possible values. Please make sure the day is between 1 and 31.`)

            // SENDING TO CHANNEL
            message.channel.send({embeds: [dayRangeEmbed]})
                // DELETE AFTER 5 SECONDS
                .then(msg => {client.setTimeout(() => msg.delete(), 5000 )})
                .catch(err => console.log(err))
            return
        }



        // LOG DATABASE INFORMATION FOR BIRTHDAY
        await birthdaySchema.findOneAndUpdate({
            USER_ID: message.author.id
        },{
            USER_ID: message.author.id,
            MONTH: month,
            DAY: day
        },{
            upsert: true
        }).exec();


        // FOR MONTH NUMBER TO NAME
        var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]


        // CHANNEL CONFIRMATION
        let bdaySetEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjGREENTICK} **Birthday Saved!**`)
            .setDescription(`${message.author}, I'll remember your birthday on ${monthNames[month-1]} ${day}.`)
            .setFooter(`If you ever wish for me to forget your birthday, use "${config.prefix}forgetbirthday".`)

        // SENDING TO CHANNEL
        message.channel.send({embeds: [bdaySetEmbed]})
            .catch(err => console.log(err))
        return
    },
}