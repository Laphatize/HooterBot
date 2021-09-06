const discord = require('discord.js');
const config = require ('../../config.json')
const wait = require('util').promisify(setTimeout);


module.exports = {
    name: 'nearest',
    description: `[DEVELOPING] Search for the nearest (query) location from main campus. [10s]`,
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
        await interaction.deferReply()


        let locationName = inputs[0]

        let mapDimensions = `800x450`
        let mapType = `roadmap`
        let templeHomeMarker = `color:red%7Clabel:T%7C39.981279908357614, -75.15559610217116`
        let locationMarker = `color:green%7Clabel:X%7C39.95241373896032, -75.1636000435979`

        let locationImg = `https://maps.googleapis.com/maps/api/staticmap?size=${mapDimensions}&maptype=${mapType}&markers=${templeHomeMarker}&markers=${locationMarker}&visible=${templeHomeMarker}&visible=${locationMarker}&key=${process.env.GoogleMapsAPIkey}`


        // GENERATING SUCCESSFUL MAP EMBED
        let nearestLocationEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`I've found a location!`)
            .setDescription(`**Search:** ${locationName}\n**Result:** result address ([Google Maps link](${encodeURI(`https://www.google.com/maps/search/?api=1&query=${locationName}`)}))`)
            .setImage(`${encodeURI(locationImg)}`)
            .setFooter(`Click the image for a larger view`)


        // WAIT AT LEAST 1.5 SECOND TO POST
        await wait(1500)


        // SHARING EMBED WITH LOCATION
        await interaction.editReply({ embeds: [nearestLocationEmbed] })
    }
}