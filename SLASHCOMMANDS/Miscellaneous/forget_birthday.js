const discord = require('discord.js')
const config = require ('../../config.json')
const birthdaySchema = require('../../Database/birthdaySchema');


module.exports = {
    name: 'forget_birthday',
    description: `Remove your birthday from HooterBot's memory. (🤖｜bot-spam) [10s]`,
    options: [],
    permissions: '',
    dmUse: true,
    cooldown: 10,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // BOT-SPAM CHANNEL ONLY
        if(interaction.channel.type !== 'DM' && interaction.channel.name !== '🤖｜bot-spam') {

            let botSpamChannel = interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === '🤖｜bot-spam')

            let wrongChannel = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`This command can only be run in <#${botSpamChannel.id}>. Head there and try again!`)

            // POST EMBED
            return interaction.reply({ embeds: [wrongChannel], ephemeral: true })
        }


        // CHECK DATABASE FOR ENTRY
        const dbBirthdayData = await birthdaySchema.findOne({
            USER_ID: interaction.user.id
        }).exec();


        // IF A DB ENTRY EXISTS FOR THE USER ALREADY
        if(!dbBirthdayData) {
            let birthdayDNE = new discord.MessageEmbed()
                .setColor(config.embedTempleRed)
                .setTitle(`${config.emjREDTICK} Sorry, I do not have your birthday stored!`)

            // SENDING TO CHANNEL
            return interaction.reply({ embeds: [birthdayDNE], ephemeral: true })
        }


        // DELETING DATABASE ENTRY
        await birthdaySchema.deleteOne({
            USER_ID: interaction.user.id
        }).exec();

        // CHANNEL CONFIRMATION
        let bdaySetEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjGREENTICK} **Birthday Removed!**`)
            .setDescription(`I have successfully forgotten your birthday.`)

        return interaction.reply({ embeds: [bdaySetEmbed] });
    }
}