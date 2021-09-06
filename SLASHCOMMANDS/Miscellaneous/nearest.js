const discord = require('discord.js');
const config = require ('../../config.json')
const wait = require('util').promisify(setTimeout);


module.exports = {
    name: 'nearest',
    description: `Search for the nearest (query) location from main campus. [10s]`,
    permissions: '',
    dmUse: true,
    cooldown: 10,
    defaultPermission: false,
    options: [
        {
            name: `place_name`,
            description: `The name of the place to find`,
            type: 'STRING',
            required: true,
        }
    ],
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // DEFERRING
        interaction.deferReply()


        let locationName = inputs[0]
        let locationImg = `https://maps.googleapis.com/maps/api/staticmap?
        size=600x300
        &maptype=roadmap
        &markers=color:red%7Clabel:T%7C39.981279908357614, -75.15559610217116
        &key=${process.env.GoogleMapsAPIkey}`


        // GENERATING SUCCESSFUL MAP EMBED
        let nearestLocationEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`I've found a location!`)
            .setDescription(`**Search:** ${locationName}\n**Result:** (resulting address)`)
            .setImage(`${locationImg}`)


        // WAIT AT LEAST 1 SECOND TO POST
        wait(1000)


        // SHARING EMBED WITH LOCATION
        interaction.editReply({ embeds: [nearestLocationEmbed] })
    }
}