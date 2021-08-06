const discord = require('discord.js')
const config = require ('../../config.json')
const birthdaySchema = require('../../Database/birthdaySchema');

module.exports = {
    name: 'deploy',
    description: `For MMM's development of HooterBot. [60s]`,
    options: [],
    permissions: '',
    cooldown: 10,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        if(interaction.user.id !== config.botAuthorId) {
            let embed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`You're not ${config.botAuthorUsername}. Please run this command when you are ${config.botAuthorUsername}.`)

            // SENDING TO CHANNEL
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

        // FETCH ALL GUILD COMMANDS
        client.application?.commands.fetch()
            .then(commands => console.log(`Fetched ${commands.size} commands:\n${commands}\n\n`))
            .catch(console.error)


        let embed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`${config.emjGREENTICK} ApplicationCommandData successfully generated.`)
            .setDescription(`MMM visit the logs to view the ApplicationCommandData results.`)

        // SENDING TO CHANNEL
        return interaction.reply({ embeds: [embed] })
    }
}