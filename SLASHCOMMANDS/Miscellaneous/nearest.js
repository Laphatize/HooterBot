const discord = require('discord.js');
const config = require ('../../config.json')
const wait = require('util').promisify(setTimeout);


module.exports = {
    name: 'nearest',
    description: `[DEVELOPING] Search for the nearest (query) location from main campus using Google Maps. [10s]`,
    permissions: '',
    dmUse: true,
    cooldown: 10,
    defaultPermission: true,
    options: [
        {
            name: `place_name`,
            description: `The name of the place to find.`,
            type: 'STRING',
            required: true,
        }
    ],
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // DEFERRING
        await interaction.deferReply()


        // LOCATION QUERY
        let locationName = inputs[0]


        // GENERATING TOP RESULT LOCATION DETAILS
        let resultURL = encodeURI(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname&input=${locationName}&inputtype=textquery&key=${process.env.GoogleMapsAPIkey}`)


        // GENERATE MAP WITH MARKERS
        let mapDimensions = `800x450`
        let mapType = `terrain`
        let zoomLevel = `21`
        let scaleFactor = `2`
        let templeHomeMarker = `color:red%7Clabel:T%7C39.981279908357614, -75.15559610217116`
        let locationMarker = `color:green%7Clabel:X%7C39.95241373896032, -75.1636000435979`

        let locationImg = `https://maps.googleapis.com/maps/api/staticmap?format=png&size=${mapDimensions}&zoom=${zoomLevel}&scale=${scaleFactor}&maptype=${mapType}&markers=${templeHomeMarker}|${locationMarker}&key=${process.env.GoogleMapsAPIkey}`


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