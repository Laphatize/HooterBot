const discord = require('discord.js');
const config = require ('../../config.json')
const wait = require('util').promisify(setTimeout);
const axios = require('axios');


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
        let resultAddress
        let resultName
        let fieldsValues = `formatted_address,name`
        let inputType = `textquery`


        // GENERATING TOP RESULT LOCATION DETAILS
        let config = {
            method: 'get',
            url: encodeURI(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${locationName}&inputtype=${inputType}&fields=${fieldsValues}&key=${process.env.GoogleMapsAPIkey}`),
            headers: {}
        }

        // GOOGLE MAPS API CALL
        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data))
                resultAddress = JSON.stringify(response.formatted_address)
                resultName = JSON.stringify(response.name)
            })
            .catch(function (err) {
                console.log(`**** GOOGLE MAPS API ERROR *****`);
                console.log(err);
                console.log(`********************************\n`);
                
                // DEFINING LOG EMBED
                let logErrEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setTitle(`${config.emjERROR} An error has occurred with the Google Maps API`)
                    .setDescription(`\`\`\`${err}\`\`\``)
                    .setTimestamp()
                
                // LOG ENTRY
                client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logErrEmbed], content: `<@${config.botAuthorId}>` })
            })


        // GENERATE MAP WITH MARKERS
        let mapDimensions = `800x450`
        let mapType = `terrain`
        let zoomLevel = `8`
        let scaleFactor = `2`
        let templeLatLong = `39.981279908357614,-75.15559610217116`
        let templeHomeMarker = `color:red%7Clabel:T%7C39.981279908357614,-75.15559610217116`
        let locationMarker = `color:green%7Clabel:X%7C39.95241373896032,-75.1636000435979`

        let locationImg = `https://maps.googleapis.com/maps/api/staticmap?format=png&size=${mapDimensions}&center=${templeLatLong}&scale=${scaleFactor}&maptype=${mapType}&markers=${templeHomeMarker}|${locationMarker}&key=${process.env.GoogleMapsAPIkey}`


        // GENERATING SUCCESSFUL MAP EMBED
        let nearestLocationEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`The nearest ${locationName} is...`)
            .setDescription(`**Result:** ${resultName}\n${resultAddress}\n([Google Maps link](${encodeURI(`https://www.google.com/maps/search/?api=1&query=${locationName}`)}))`)
            .setImage(`${encodeURI(locationImg)}`)
            .setFooter(`Click the image for a larger view`)


        // WAIT AT LEAST 1.5 SECOND TO POST
        await wait(1500)


        // SHARING EMBED WITH LOCATION
        await interaction.editReply({ embeds: [nearestLocationEmbed] })
    }
}