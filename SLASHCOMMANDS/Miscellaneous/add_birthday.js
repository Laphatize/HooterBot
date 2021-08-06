const discord = require('discord.js')
const config = require ('../../config.json')
const birthdaySchema = require('../../Database/birthdaySchema');

module.exports = {
    name: 'add_birthday',
    description: `Adds your birthday for HooterBot to remember and announce in the server. [10s]`,
    options: [
        {
            name: `month`,
            description: `The two-digit month value.`,
            type: `INTEGER`,
            required: true
        },{
            name: `day`,
            description: `The two-digit day value.`,
            type: `INTEGER`,
            required: true
        },
    ],
    permissions: '',
    cooldown: 10,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        if(interaction.user.id == config.botAuthorId) {
            interaction.reply({ content: `**GuildApplicationCommandData**\n**Slash Command ID:** ${interaction.commandId}`})
        }

        // GRABBING SLASH COMMAND INPUT VALUES
        const month = inputs[0];
        const day = inputs[1];


        // CHECK DATABASE FOR ENTRY
        const dbBirthdayData = await birthdaySchema.findOne({
            USER_ID: interaction.user.id
        }).exec();


        // IF A DB ENTRY EXISTS FOR THE USER ALREADY
        if(dbBirthdayData) {
            let birthdayExists = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} Sorry, you've already set your birthday!`)
                .setDescription(`You've already set your birthday as \`\`${dbBirthdayData.MONTH} / ${dbBirthdayData.DAY}\`\`. If this is not correct, use \`\`$forget_birthday\`\` before running this command again.`)

            // SENDING TO CHANNEL
            return interaction.reply({ embeds: [birthdayExists], ephemeral: true })
        }


        // CHECKING DAY HAS VALID RANGE
        if(month < 1 || month > 12) {
            let monthRangeEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`The value for the month is outside possible values. Please make sure the month is between 01 and 12.`)

            // SENDING TO CHANNEL
            return interaction.reply({ embeds: [monthRangeEmbed], ephemeral: true })
        }


        // CHECKING DAY HAS VALID RANGE
        if(day < 1 || day > 31) {
            let dayRangeEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} **Error!**`)
                .setDescription(`The value for the day is outside possible values. Please make sure the day is between 01 and 31.`)

            // SENDING TO CHANNEL
            return interaction.reply({ embeds: [dayRangeEmbed], ephemeral: true  })
        }


        // IF BIRTHDAY IS FEBRUARY 29 - LEAP YEAR DAY, RECOGNIZE BIRTHDAY ON FEBRUARY 28
        if(day == 29 && month == 2) {
            let dayRangeEmbed = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjORANGETICK} A leap year!`)
                .setDescription(`Because your birthday *technically* happens once every 4 years, I'm going to remind everyone of your birthday on February 28 instead so we can celebrate every year!`)

            // SENDING NOTICE TO CHANNEL
            interaction.reply({ embeds: [dayRangeEmbed], ephemeral: true })


            // LOG DATABASE INFORMATION FOR BIRTHDAY
            await birthdaySchema.findOneAndUpdate({
                USER_ID: interaction.user.id
            },{
                USER_ID: interaction.user.id,
                MONTH: 2,
                DAY: 28
            },{
                upsert: true
            }).exec();

            // FOR MONTH NUMBER TO NAME
            var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]


            // CHANNEL CONFIRMATION
            let bdaySetEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} **Birthday Saved!**`)
                .setDescription(`**${interaction.user.username}**, I'll remember your birthday on ${monthNames[month-1]} ${day-1}, even though your birthday is actually on February 29.
                \n*If you ever wish for me to forget your birthday, use* \`\`/forgetbirthday\`\`.`)

            return interaction.followUp({ embeds: [bdaySetEmbed] });
        }


        // LOG DATABASE INFORMATION FOR BIRTHDAY
        await birthdaySchema.findOneAndUpdate({
            USER_ID: interaction.user.id
        },{
            USER_ID: interaction.user.id,
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
            .setDescription(`**${interaction.user.username}**, I'll remember your birthday on ${monthNames[month-1]} ${day}.
            \n*If you ever wish for me to forget your birthday, use* \`\`/forgetbirthday\`\`.`)
        
        return interaction.reply({ embeds: [bdaySetEmbed] });

    }
}