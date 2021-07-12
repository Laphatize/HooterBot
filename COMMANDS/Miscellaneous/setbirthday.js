const discord = require('discord.js')
const config = require ('../../config.json');
const birthdaySchema = require('../../Database/birthdaySchema');
const moment = require('moment');

module.exports = {
    name: `setbirthday`,
    aliases: [`setbday`],
    description: `A command to set your birthday so HooterBot can announce it in the server.`,
    category: `Miscellaneous`,
    expectedArgs: '## / ##  [month / day]',
    cooldown: 10,
    minArgs: 1,
    maxArgs: 1,
    guildUse: true,
    dmUse: true,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        // GRABBING FULL ARGS
        const combinedArgs = arguments.join(' ').trim()

        // CHECK DATABASE FOR USER'S ENTRY
        const dbTicketData = await birthdaySchema.findOne({
            USER_ID: message.author.id
        }).exec();


        // IF A DB ENTRY EXISTS FOR THE USER ALREADY
        if(dbTicketData) {
            let birthdayExists = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`Sorry, **you've already set your birthday!** Use \`\`$forgetbirthday\`\` and try running this command again.`)

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


        // SETTING MONTH AND DAY
        month = combinedArgs[0]
        day = combinedArgs[1]


        console.log(`month = ${month}`)
        console.log(`day = ${day}`)


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


        // STRIPPING ANY 0'S THAT START NUMBERS (e.g. "03" to "3")
        if(day.startsWith('0')) {
            removeZerosD = day.split('0')
            day = removeZerosD[1];
        }


        // STRIPPING ANY 0'S THAT START NUMBERS (e.g. "03" to "3")
        if(month.startsWith('0')) {
            removeZerosM = month.split('0')
            month = removeZerosM[1];
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
        if(day < 1 || day > 31 || day.length() > 2) {
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


        // CHECKING DAY HAS VALID RANGE
        if(month < 1 || month > 12 || month.length() > 2) {
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


        
        // CHANNEL CONFIRMATION
        let bdaySetEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjGREENTICK} **Saved!**`)
            .setDescription(`${message.author}, I'll remember your birthday on ${moment(day).utcOffset(-5).format('D')} ${moment(month).utcOffset(-5).format('MMMM')}.`)
            .setFooter(`If you ever wish for me to forget your birthday, use \`\`${config.prefix}forgetbirthday\`\`.`)

        // SENDING TO CHANNEL
        message.channel.send({embeds: [bdaySetEmbed]})
            .catch(err => console.log(err))
        return
    },
}