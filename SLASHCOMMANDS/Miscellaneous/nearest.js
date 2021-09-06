const discord = require('discord.js');
const botconf = require ('../../config.json')
const wait = require('util').promisify(setTimeout);
const axios = require('axios');


module.exports = {
    name: 'nearest',
    description: `Search for the nearest (query) location from main campus using the Google Maps API. [10s]`,
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
            url: encodeURI(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=philadelphia-${locationName}&inputtype=${inputType}&fields=${fieldsValues}&key=${process.env.GoogleMapsAPIkey}`),
            headers: {}
        }

        // GOOGLE MAPS API CALL
        axios(config)
            .then(async function (response) {
                resultAddress = response.data.candidates[0]["formatted_address"]
                resultName = response.data.candidates[0]["name"]
                resultLat = response.data.candidates[0]["geometry"].location.lat
                resultLong = response.data.candidates[0]["geometry"].location.lng
                        

                // GENERATE MAP WITH MARKERS
                let locationMarker = `markers=color:green%7Clabel:X%7C${resultLat},%20${resultLong}`

                let locationImg = `https://maps.googleapis.com/maps/api/staticmap?size=800x450&visible=39.981279908357614,%20-75.15559610217116&visible=${resultLat},%20${resultLong}&maptype=roadmap&markers=color:red%7Clabel:T%7C39.981279908357614,%20-75.15559610217116&${locationMarker}&key=${process.env.GoogleMapsAPIkey}`

                console.log(`locationImg = ${locationImg}`)

                // GENERATING SUCCESSFUL MAP EMBED
                let nearestLocationEmbed = new discord.MessageEmbed()
                    .setColor(botconf.embedDarkGrey)
                    .setDescription(`**Query:** ${locationName}\n**Result:**\n${resultName}\n${resultAddress}\n([Google Maps link](${encodeURI(`https://www.google.com/maps/search/?api=1&query=${locationName}`)}))`)
                    .setImage(`${locationImg}`)
                    .setFooter(`Click the image for a larger view | NOTE: Results may be wonky sometimes, thank the Google API for that.`)


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
