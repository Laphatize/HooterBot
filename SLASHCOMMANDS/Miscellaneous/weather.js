const discord = require('discord.js');
const botconf = require ('../../config.json')
const wait = require('util').promisify(setTimeout);
const axios = require('axios');


module.exports = {
    name: 'weather',
    description: `Current weather and upcoming 3-day forecast for Philadelphia (🤖｜bot-spam) [10 min]`,
    permissions: '',
    dmUse: true,
    cooldown: 60,
    options: [
        {
            name: `type`,
            description: `Select what type of weather to display`,
            type: `STRING`,
            required: true,
            choices: [
                {
                    name: `current`,
                    value: `current`,
                },{
                    name: `3day_forecast`,
                    value: `forecast`,
                }
            ]
        }
    ],
    defaultPermission: false,
    run: async(client, interaction, inputs) => {

        // BOT-SPAM CHANNEL ONLY
        if(interaction.channel.name !== '🤖｜bot-spam') {

            let botSpamChannel = interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === '🤖｜bot-spam')

            let wrongChannel = new discord.MessageEmbed()
                .setColor(botconf.embedRed)
                .setTitle(`${botconf.emjREDTICK} Sorry!`)
                .setDescription(`This command can only be run in <#${botSpamChannel.id}>. Head there and try again!`)

            // POST EMBED
            return interaction.reply({ embeds: [wrongChannel], ephemeral: true })
        }


        // GRAB COMMAND TYPE OF WEATHER TO RUN
        let weatherType = interaction.options.getString('type');


        // DEFERRING
        await interaction.deferReply()



        /***************************************/
        /*  CURRENT PHILLY WEATHER FORECAST    */
        /***************************************/
        if(weatherType == 'current') {
            // WEATHER DATA SETUP
            let config = {
                method: 'get',
                url: encodeURI(`https://api.weatherapi.com/v1/current.json?key=631c95d5491d44a1a4620615210709&q=39.981364957390184,-75.15441956488965&aqi=yes`), // PHILLY WEATHER AT BELL TOWER
            }


            // WEATHER VARIABLES
            let lastUpdateTimestamp
            let mainForecast, mainIcon
            let currentTempF, currentTempC, feelsLikeTempF, feelsLikeTempC, lowTempF, lowTempC, highTempF, highTempC, pressureValue, humidityPercent
            let windSpeedMph, windSpeedKph, windDir
            let precipIn, precipMm
            let cloudCoverage, uvIndex, airQualIndex


            // WEATHER API CALL
            axios(config)
                .then(async function (response) {
                    
                    console.log(`response[0] = ${response[0]}`)
                    console.log(`response[0]['location'] = ${response[0]['location']}`)
                    console.log(`response[0].location = ${response[0].location}`)

                    await wait(500)

                    if(!response["location"]) {
                        let noResultEmbed = new discord.MessageEmbed()
                            .setColor(botconf.embedRed)
                            .setTitle(`${botconf.emjREDTICK} Sorry!`)
                            .setDescription(`I'm having trouble grabbing the current weather for Philly right now. Please try again in a little while.`)
                        return interaction.editReply({ embeds: [noResultEmbed], ephemeral: true })
                    }


                    mainForecast = data["current"]["condition"]
                    mainIcon = data["current"]["icon"]

                    console.log(`mainForecast = ${mainForecast}`)
                    console.log(`mainIcon = ${mainIcon}`)


                    // GENERATING SUCCESSFUL MAP EMBED
                    let nearestLocationEmbed = new discord.MessageEmbed()
                        .setColor(botconf.embed)
                        .setTitle(`Current Philadelphia Weather`)
                        .addField(`Current:`, `${mainForecast}`, true)
                        .addField(`Type:`, `${mainDescription}`, true)
                        .addField(`\u200b:`, `\u200b`, true)
                        .setFooter(`Powered by Weather API`)
                        .setThumbnail(encodeURI(mainIcon))


                    // WAIT AT LEAST 1.5 SECOND TO POST
                    await wait(1500)


                    // SHARING EMBED WITH LOCATION
                    await interaction.editReply({ embeds: [nearestLocationEmbed] })
                })
                .catch(function (err) {
                    console.log(`****** WEATHER API ERROR ******`);
                    console.log(err);
                    console.log(`********************************\n`);
                    
                    // DEFINING LOG EMBED
                    let logErrEmbed = new discord.MessageEmbed()
                        .setColor(botconf.embedGrey)
                        .setTitle(`${botconf.emjERROR} An error has occurred with the Weather API`)
                        .setDescription(`\`\`\`${err}\`\`\``)
                        .setTimestamp()
                    
                    // LOG ENTRY
                    client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logErrEmbed] })
                })
        }


        /***************************************/
        /*  CURRENT PHILLY 5-DAY FORECAST      */
        /***************************************/
        if(weatherType == 'forecast') {
            interaction.editReply({ content: 'Command is not ready yet, but will be soon.' })

            // WEATHER DATA SETUP
            let config = {
                method: 'get',
                url: encodeURI(`https://api.weatherapi.com/v1/forecast.json?key=631c95d5491d44a1a4620615210709&q=39.981364957390184,-75.15441956488965&days=5&aqi=no&alerts=no`), // PHILLY WEATHER AT BELL TOWER
            }

            await wait(500)





        }
    }
}
