const discord = require('discord.js');
const botconf = require ('../../config.json')
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
        let resultAddress, resultName, resultLat, resultLong
        let fieldsValues = `formatted_address,name,geometry`
        let inputType = `textquery`


        // GENERATING TOP RESULT LOCATION DETAILS
        let config = {
            method: 'get',
            url: encodeURI(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${locationName}&inputtype=${inputType}&fields=${fieldsValues}&key=${process.env.GoogleMapsAPIkey}`),
            headers: {}
        }

        // GOOGLE MAPS API CALL
        axios(config)
            .then(async function (response) {
                console.log(JSON.stringify(response.data))
                console.log(response.data.candidates[0])
                resultAddress = response.data.candidates[0]["formatted_address"]
                resultName = response.data.candidates[0]["name"]
                resultLat
                resultLong
                console.log(`resultAddress = ${resultAddress}`)
                console.log(`resultName = ${resultName}`)
                        

                // GENERATE MAP WITH MARKERS
                let mapDimensions = `800x450`
                let mapType = `terrain`
                let scaleFactor = `2`
                let center = `39.981279908357614,-75.15559610217116`
                let templeHomeMarker = `color:red%7Clabel:T%7C39.981279908357614,-75.15559610217116`
                let locationMarker = `color:green%7Clabel:X%7C39.95241373896032,-75.1636000435979`

                let markerList = `markers=${templeHomeMarker}&markers=${locationMarker}`

                let locationImg = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&size=${mapDimensions}&maptype=${mapType}&scale=${scaleFactor}&${markerList}&key=${process.env.GoogleMapsAPIkey}`


                // GENERATING SUCCESSFUL MAP EMBED
                let nearestLocationEmbed = new discord.MessageEmbed()
                    .setColor(botconf.embedDarkGrey)
                    .setTitle(`The nearest ${locationName} is...`)
                    .setDescription(`**Result:** ${resultName}\n${resultAddress}\n([Google Maps link](${encodeURI(`https://www.google.com/maps/search/?api=1&query=${locationName}`)}))`)
                    .setImage(`${encodeURI(locationImg)}`)
                    .setFooter(`Click the image for a larger view`)


                // WAIT AT LEAST 1.5 SECOND TO POST
                await wait(1500)


                // SHARING EMBED WITH LOCATION
                await interaction.editReply({ embeds: [nearestLocationEmbed] })
            })
            .catch(function (err) {
                console.log(`**** GOOGLE MAPS API ERROR *****`);
                console.log(err);
                console.log(`********************************\n`);
                
                // DEFINING LOG EMBED
                let logErrEmbed = new discord.MessageEmbed()
                    .setColor(botconf.embedDarkBlue)
                    .setTitle(`${botconf.emjERROR} An error has occurred with the Google Maps API`)
                    .setDescription(`\`\`\`${err}\`\`\``)
                    .setTimestamp()
                
                // LOG ENTRY
                client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logErrEmbed] })
            })
    }
}
