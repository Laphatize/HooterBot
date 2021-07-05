const discord = require('discord.js')
const config = require ('../config.json')

module.exports = {
    commands: ['ping', 'test', 'testing'],
    expectedArgs: '',
    cooldown: 10,
    permissionError: ``,
    description: `A command to test if ${config.botName} is responding or suffering from latency issues.`,
    minArgs: 0,
    maxArgs: 0,
    callback: async (message, arguments, text, client) => {
        //DEFINING INITIAL EMBED
        let initialPingEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlue)
            .setTitle(`Ping...`)
            .setDescription(`Bot latency =\nAPI latency =`)
            .setTimestamp()

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
            var botPing = m.createdTimestamp - message.createdTimestamp
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

            // SENDING EMBED
            m.edit({embeds: [updatedPingEmbed]})
            .catch(err => {
                console.log(`************* ERROR ************`)
                console.log(`Sending updated ping embed.\n`)
                console.log(err)
                console.log(`********* END OF ERROR ***********\n\n`)
            })
        })
    },
    permissions: '',
    requiredRoles: [],
}