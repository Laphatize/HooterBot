const discord = require('discord.js');
const botconf = require ('../../config.json')
const wait = require('util').promisify(setTimeout);
const axios = require('axios');
const moment = require('moment');


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

        let currentWeather
        let forecastWeather
        

        /***************************************/
        /*  CURRENT PHILLY WEATHER FORECAST    */
        /***************************************/
        if(weatherType == 'current') {

            // FETCHING WEATHER
            let config = {
                method: 'get',
                url: encodeURI(`https://api.weatherapi.com/v1/current.json?key=${process.env.weatherAPIkey}&q=39.981364957390184,-75.15441956488965&aqi=yes`),
                headers: {}
            }

            // GOOGLE MAPS API CALL
            axios(config)
                .then(async function(result) {
                    await wait(500)
                    console.log(`\n\nWEATHER API DATA:\n`,JSON.stringify(result.data, null, 5),`\n(END OF WEATHER API DATA)\n\n`);


                    // IF JSON RESPONSE IS UNDEFINED OR EMPTY - NO WEATHER DATA
                    if(result === undefined || result.length === 0) {

                        // DEFINING ERROR EMBED
                        let noResultEmbed = new discord.MessageEmbed()
                            .setColor(botconf.embedRed)
                            .setTitle(`${botconf.emjREDTICK} Sorry!`)
                            .setDescription(`I'm having trouble locating a weather report for Philly right now. Please try again in a little while.`)
                        return interaction.editReply({ embeds: [noResultEmbed], ephemeral: true })
                    }


                    // // WEATHER VALUES
                    // let temperature, currentTempC, feelsLikeTempF, feelsLikeTempC, lowTempF, lowTempC, highTempF, highTempC, pressureValue, humidityPercent
                    // let windSpeedMph, windSpeedKph, windDir
                    // let precipIn, precipMm
                    // let cloudCoverage, uvIndex, airQualIndex
                    
                    currentWeather = result.data.current


                    let airQualIndicatorText

                    // AIR QUALITY INDEX METER - https://www.epa.gov/wildfire-smoke-course/wildfire-smoke-and-your-patients-health-air-quality-index
                    if(currentWeather.air_quality['us-epa-index'] >= 0 && currentWeather.air_quality['us-epa-index'] <= 50 ) {
                        airQualIndicatorText = `🟩 ${currentWeather.air_quality['us-epa-index']} (Good)`
                    }
                    if(currentWeather.air_quality['us-epa-index'] >= 51 && currentWeather.air_quality['us-epa-index'] <= 10 ) {
                        airQualIndicatorText = `🟨 ${currentWeather.air_quality['us-epa-index']} (Moderate)`
                    }
                    if(currentWeather.air_quality['us-epa-index'] >= 101 && currentWeather.air_quality['us-epa-index'] <= 150 ) {
                        airQualIndicatorText = `🟧 ${currentWeather.air_quality['us-epa-index']} (Unhealthy for Sensitive Groups)`
                    }
                    if(currentWeather.air_quality['us-epa-index'] >= 151 && currentWeather.air_quality['us-epa-index'] <= 200 ) {
                        airQualIndicatorText = `🟥 ${currentWeather.air_quality['us-epa-index']} (Unhealthy)`
                    }
                    if(currentWeather.air_quality['us-epa-index'] >= 201 && currentWeather.air_quality['us-epa-index'] <= 300 ) {
                        airQualIndicatorText = `🟪 ${currentWeather.air_quality['us-epa-index']} (Very Unhealthy)`
                    }
                    if(currentWeather.air_quality['us-epa-index'] >= 301) {
                        airQualIndicatorText = `⬛ ${currentWeather.air_quality['us-epa-index']} (Hazardous)`
                    }



                    atmPressure = currentWeather.pressure_mb / 1013


                    // GENERATING SUCCESSFUL WEATHER EMBED
                    let mainWeatherEmbed = new discord.MessageEmbed()
                        .setColor(botconf.embedGold)
                        .setTitle(`Current Philadelphia Weather (${moment(currentWeather.last_updated_epoch, 'x').format(`h:mm a`).utcOffset(-4)})`)
                        .setThumbnail(encodeURI(currentWeather.condition.icon))
                        // ROW 1
                        .addField(`Current Condition:`, `${currentWeather.condition.text}`, true)
                        .addField(`Temperature:`, `${currentWeather.temp_f}°F (${currentWeather.temp_c}°C)`, true)
                        .addField(`Feels Like:`, `${rescurrentWeather.feelslike_f}°F (${currentWeather.feelslike_c}°C)`, true)
                        // ROW 2
                        .addField(`Wind:`, `${currentWeather.wind_mph} mph (${currentWeather.wind_kph} kph)`, true)
                        .addField(`Direction:`, `${currentWeather.wind_dir} (${currentWeather.wind_degree}°)`, true)
                        .addField(`Max Gust Speed:`, `${currentWeather.gust_mph} mph (${currentWeather.gust_kph} kph)`, true)
                        // ROW 3
                        .addField(`Precipitation:`, `${currentWeather.precip_in} in/hour (${currentWeather.precip_mm} mm/hour)`, true)
                        .addField(`Humidity:`, `${currentWeather.humidity}%`, true)
                        .addField(`Pressure:`, `${currentWeather.pressure_in} inHg (${currentWeather.pressure_mb} mbar) (${atmPressure} atm)`, true)
                        // ROW 4
                        .addField(`UV Index:`, `${currentWeather.uv}`, true)
                        .addField(`Cloud Coverage:`, `${currentWeather.cloud}%`, true)
                        .addField(`Visibility:`, `${currentWeather.vis_miles} mi (${currentWeather.vis_km} km)`, true)

                        // FOOTER
                        .setFooter(`Powered by Weather API | Weather as of: ${moment(currentWeather.last_updated_epoch, 'x').format(`MMMM D YYYY, h:mm:ss a`).utcOffset(-4)}`)


                    let airQualityEmbed = new discord.MessageEmbed()
                        .setColor(botconf.embedGold)
                        .setTitle(`Current Philadelphia Air Quality`)
                        // ROW 1
                        .setDescription(`**EPA Air Quality Index:** ${airQualIndicatorText}`)
                        // ROW 2
                        .addField(`Carbon Monoxide (CO):`, `${currentWeather.air_quality['co']} μg/m³`, true)
                        .addField(`Ozone (O₃):`, `${currentWeather.air_quality['o3']} μg/m³`, true)
                        .addField(`Nitrogen Dioxide (NO₂):`, `${currentWeather.air_quality['no2']} μg/m³`, true)
                        // ROW 3
                        .addField(`Sulfur Dioxide (SO₂):`, `${currentWeather.air_quality['so2']} μg/m³`, true)
                        .addField(`Particulate Matter (<2.5μm):`, `${currentWeather.air_quality['pm2_5']} μg/m³`, true)
                        .addField(`Particulate Matter (<10μm):`, `${currentWeather.air_quality['pm10']} μg/m³`, true)
                        // FOOTER
                        .setFooter(`Powered by Weather API | Weather as of: ${moment(currentWeather.last_updated_epoch, 'x').format(`MMMM D YYYY, h:mm:ss a`).utcOffset(-4)}`)

                    // SHARING EMBED WITH LOCATION
                    await interaction.editReply({ embeds: [mainWeatherEmbed, airQualityEmbed] })
                })
                .catch(err => {
                    // WEATHER LOAD ERROR RESPONSE
                    let weatherFetchErrEmbed = new discord.MessageEmbed()
                        .setColor(botconf.embedRed)
                        .setTitle(`${botconf.emjREDTICK} Sorry!`)
                        .setDescription(`I ran into an error grabbing weather data from the API. Please try again in a little while.`)
                    interaction.editReply({ embeds: [weatherFetchErrEmbed], ephemeral: true })

                    // LOG
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
                    return client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logErrEmbed] })
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
                url: encodeURI(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.weatherAPIkey}&q=39.981364957390184,-75.15441956488965&days=5&aqi=no&alerts=no`), // PHILLY WEATHER AT BELL TOWER
                headers: {}
            }

            await wait(500)





        }
    }
}
