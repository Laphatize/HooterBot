const discord = require('discord.js')
const config = require ('../../config.json')

module.exports = {
    name: `ping`,
    aliases: [`test`, `testing`],
    description: `A command to test if ${config.botName} is responding or suffering from latency issues.`,
    expectedArgs: '',
    cooldown: 10,
    minArgs: 0,
    maxArgs: 0,
    guildOnly: false,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        //DEFINING INITIAL EMBED
        let initialPingEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlue)
            .setTitle(`Ping...`)
            .setDescription(`Bot latency =\nAPI latency =`)


        // SENDING INITIAL EMBED
        message.channel.send({embeds: [initialPingEmbed]})
        .catch(err => {
            console.log(`************* ERROR ************`)
            console.log(`Sending initial ping embed.\n`)
            console.log(err)
            console.log(`********* END OF ERROR ***********\n\n`)
        })


        // CALCULATE PING BETWEEN MESSAGES
        .then(m => {
            var botPing = Date.now() - m.createdTimestamp
            var apiPing = client.ws.ping

            let botLatEmj, apiLatEmj


            // BOT LATENCY EMOJI PICK
            if (botPing < 100) {
                botLatEmj = config.emjGREENTICK
            }
            if (botPing >= 100 && botPing < 150) {
                botLatEmj = config.emjORANGETICK
            }
            if (botPing >= 150) {
                botLatEmj = config.emjREDTICK
            }


            // API LATENCY EMOJI PICK
            if (apiPing < 75) {
                apiLatEmj = config.emjGREENTICK
            }
            if (apiPing >= 75 && apiPing < 125) {
                apiLatEmj = config.emjORANGETICK
            }
            if (apiPing >= 125) {
                apiLatEmj = config.emjREDTICK
            }


            //DEFINING UPDAETE EMBED
            let updatedPingEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlue)
                .setTitle(`Ping... ...**Hoot!** 🦉`)
                .setDescription(`Bot latency = **${botPing}ms** ${botLatEmj}\nAPI latency = **${apiPing}ms** ${apiLatEmj}`)
                .setTimestamp()


            // SENDING UPDATED EMBED
            m.edit({embeds: [updatedPingEmbed]})
            .catch(err => {
                console.log(`************* ERROR ************`)
                console.log(`Sending updated ping embed.\n`)
                console.log(err)
                console.log(`********* END OF ERROR ***********\n\n`)
            })
        })
    },
}