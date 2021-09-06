const config = require ('../../config.json')


module.exports = {
    name: 'nearest',
    description: `Search for the nearest (query) location from main campus. [10s]`,
    permissions: '',
    dmUse: true,
    cooldown: 10,
    defaultPermission: true,
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

        let locationName = inputs[0]


        let locationImg = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap
        &markers=color:red%7Clabel:T%7C39.98069752863743, -75.15573473188353
        &markers=color:red%7Clabel:C%7C40.718217,-73.998284
        &key=${process.env.GoogleMapsAPIkey}`


        // POSTING LINK USING VALUES FROM ABOVE
        interaction.reply({ content: `Here you go!` })
    }
}