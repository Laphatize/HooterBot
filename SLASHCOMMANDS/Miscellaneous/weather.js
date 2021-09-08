const discord = require('discord.js');
const botconf = require ('../../config.json')
const wait = require('util').promisify(setTimeout);
const axios = require('axios');
const moment = require('moment');


module.exports = {
    name: 'weather',
    description: `Current weather and 3-day forecast for Philadelphia (🤖｜bot-spam) [15 min]`,
    permissions: '',
    dmUse: true,
    cooldown: 900,
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

            // CURRENT WEATHER API CALL
            axios(config)
                .then(async function(result) {
                    await wait(500)
                    
                    // IF JSON RESPONSE IS UNDEFINED OR EMPTY - NO WEATHER DATA
                    if(result === undefined || result.length === 0) {

                        // DEFINING ERROR EMBED
                        let noResultEmbed = new discord.MessageEmbed()
                            .setColor(botconf.embedRed)
                            .setTitle(`${botconf.emjREDTICK} Sorry!`)
                            .setDescription(`I'm having trouble locating a weather report for Philly right now. Please try again in a little while.`)
                        return interaction.editReply({ embeds: [noResultEmbed], ephemeral: true })
                    }


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

                    let atmPressure = currentWeather.pressure_mb / 1013


                    // TIME SPLITTING AND REFORMATTING
                    let updateTime = `${currentWeather.last_updated}`
                    let localTime = updateTime.split(' ').pop().split(':')
                    let localTimeHour = localTime[0]
                    let localTimeMin = localTime[1];
                    let xm

                    if(localTimeHour > 12) {
                        localTimeHour = `${localTime[0]-12}`
                        xm = `PM`
                    }
                    else {
                        xm = 'AM'
                    }

                    // GENERATING SUCCESSFUL WEATHER EMBED
                    let mainWeatherEmbed = new discord.MessageEmbed()
                        .setColor(botconf.embedGold)
                        .setTitle(`Current Philadelphia Weather (${localTimeHour}:${localTimeMin}${xm})`)
                        .setThumbnail(encodeURI(`https:${currentWeather.condition.icon}`))
                        // ROW 1
                        .addField(`Current Condition:`, `${currentWeather.condition.text}`, true)
                        .addField(`Temperature:`, `${currentWeather.temp_f}°F (${currentWeather.temp_c}°C)`, true)
                        .addField(`Feels Like:`, `${currentWeather.feelslike_f}°F (${currentWeather.feelslike_c}°C)`, true)
                        // ROW 2
                        .addField(`Wind:`, `${currentWeather.wind_mph} mph (${currentWeather.wind_kph} kph)`, true)
                        .addField(`Direction:`, `${currentWeather.wind_dir} (${currentWeather.wind_degree}°)`, true)
                        .addField(`Max Gust Speed:`, `${currentWeather.gust_mph} mph (${currentWeather.gust_kph} kph)`, true)
                        // ROW 3
                        .addField(`Precipitation:`, `${currentWeather.precip_in} in/hour\n(${currentWeather.precip_mm} mm/hour)`, true)
                        .addField(`Humidity:`, `${currentWeather.humidity}%`, true)
                        .addField(`Pressure:`, `${currentWeather.pressure_in} inHg (${currentWeather.pressure_mb} mbar)\n(${atmPressure.toFixed(2)} atm)`, true)
                        // ROW 4
                        .addField(`UV Index:`, `${currentWeather.uv}`, true)
                        .addField(`Cloud Coverage:`, `${currentWeather.cloud}%`, true)
                        .addField(`Visibility:`, `${currentWeather.vis_miles} mi (${currentWeather.vis_km} km)`, true)


                    let airQualityEmbed = new discord.MessageEmbed()
                        .setColor(botconf.embedGold)
                        .setTitle(`Current Philadelphia Air Quality`)
                        // ROW 1
                        .setDescription(`**EPA Air Quality Index:** ${airQualIndicatorText}`)
                        // ROW 2
                        .addField(`Carbon Monoxide (CO):`, `${currentWeather.air_quality['co'].toFixed(2)} μg/m³`, true)
                        .addField(`Ozone (O₃):`, `${currentWeather.air_quality['o3'].toFixed(2)} μg/m³`, true)
                        .addField(`Nitrogen Dioxide (NO₂):`, `${currentWeather.air_quality['no2'].toFixed(2)} μg/m³`, true)
                        // ROW 3
                        .addField(`Sulfur Dioxide (SO₂):`, `${currentWeather.air_quality['so2'].toFixed(2)} μg/m³`, true)
                        .addField(`Particulate Matter (<2.5μm):`, `${currentWeather.air_quality['pm2_5'].toFixed(2)} μg/m³`, true)
                        .addField(`Particulate Matter (<10μm):`, `${currentWeather.air_quality['pm10'].toFixed(2)} μg/m³`, true)
                        // FOOTER
                        .setFooter(`Powered by Weather API | Weather as of: ${moment(currentWeather.last_updated).subtract(0, 'hours').format(`MMMM D, YYYY, h:mm:ss a`)}`)

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
        /*  CURRENT PHILLY 3-DAY FORECAST      */
        /***************************************/
        if(weatherType == 'forecast') {
            // WEATHER FORECAST DATA SETUP
            let config = {
                method: 'get',
                url: encodeURI(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.weatherAPIkey}&q=39.981364957390184,-75.15441956488965&days=3&aqi=no&alerts=no`), // PHILLY WEATHER AT BELL TOWER
                headers: {}
            }

            // WEATHER API CALL
            axios(config)
                .then(async function(result) {
                    await wait(500)

                    // IF JSON RESPONSE IS UNDEFINED OR EMPTY - NO WEATHER DATA
                    if(result === undefined || result.length === 0) {

                        // DEFINING ERROR EMBED
                        let noResultEmbed = new discord.MessageEmbed()
                            .setColor(botconf.embedRed)
                            .setTitle(`${botconf.emjREDTICK} Sorry!`)
                            .setDescription(`I'm having trouble locating a weather report for Philly right now. Please try again in a little while.`)
                        return interaction.editReply({ embeds: [noResultEmbed], ephemeral: true })
                    }
                    
                    
                    console.log(`\n\nWEATHER FORECAST API DATA:\n`,JSON.stringify(result.data, null, 5),`\n(END OF WEATHER FORECAST API DATA)\n\n`);

                    forecastWeather = result.data.forecast
                    

                    // GENERATING SUCCESSFUL WEATHER EMBED
                    let forecastWeatherEmbed = new discord.MessageEmbed()
                        .setColor(botconf.embedGold)
                        .setTitle(`3-Day Philadelphia Weather Forecast`)
                        .setThumbnail(encodeURI(`https:${forecastWeather.forecastday[1]["day"].condition.icon}`))

                        // TODAY
                        .addField(`${moment(forecastWeather.forecastday[0].date).format(`dddd, MMMM D, YYYY`)}`,
                        `\n**Conditions:** ${forecastWeather.forecastday[0]["day"].condition.text}
                        \n**High:** ${forecastWeather.forecastday[0]["day"].maxtemp_f}°F (${forecastWeather.forecastday[0]["day"].maxtemp_c}°C)\n**Low:** ${forecastWeather.forecastday[0]["day"].mintemp_f}°F (${forecastWeather.forecastday[0]["day"].mintemp_c}°C)
                        \n**Humidity:** ${forecastWeather.forecastday[0]["day"].avghumidity}
                        \n**Chance of Rain:** ${forecastWeather.forecastday[0]["day"].daily_chance_of_rain}%\n**Chance of Snow:** ${forecastWeather.forecastday[0]["day"].daily_chance_of_snow}%\n**Precipitation:** ${forecastWeather.forecastday[0]["day"].totalprecip_in}in (${forecastWeather.forecastday[0]["day"].totalprecip_mm} mm)
                        `, true)

                        // TOMORROW
                        .addField(`${moment(forecastWeather.forecastday[1].date).format(`dddd, MMMM D, YYYY`)}`,
                        `\n**Conditions:** ${forecastWeather.forecastday[1]["day"].condition.text}
                        \n**High:** ${forecastWeather.forecastday[1]["day"].maxtemp_f}°F (${forecastWeather.forecastday[1]["day"].maxtemp_c}°C)\n**Low:** ${forecastWeather.forecastday[1]["day"].mintemp_f}°F (${forecastWeather.forecastday[1]["day"].mintemp_c}°C)
                        \n**Humidity:** ${forecastWeather.forecastday[1]["day"].avghumidity}
                        \n**Chance of Rain:** ${forecastWeather.forecastday[1]["day"].daily_chance_of_rain}%\n**Chance of Snow:** ${forecastWeather.forecastday[1]["day"].daily_chance_of_snow}%\n**Precipitation:** ${forecastWeather.forecastday[1]["day"].totalprecip_in}in (${forecastWeather.forecastday[1]["day"].totalprecip_mm} mm)
                        `, true)
                        
                        // TWO DAYS FROM NOW
                        .addField(`${moment(forecastWeather.forecastday[2].date).format(`dddd, MMMM D, YYYY`)}`,
                        `\n**Conditions:** ${forecastWeather.forecastday[2]["day"].condition.text}
                        \n**High:** ${forecastWeather.forecastday[2]["day"].maxtemp_f}°F (${forecastWeather.forecastday[2]["day"].maxtemp_c}°C)\n**Low:** ${forecastWeather.forecastday[2]["day"].mintemp_f}°F (${forecastWeather.forecastday[2]["day"].mintemp_c}°C)
                        \n**Humidity:** ${forecastWeather.forecastday[2]["day"].avghumidity}
                        \n**Chance of Rain:** ${forecastWeather.forecastday[2]["day"].daily_chance_of_rain}%\n**Chance of Snow:** ${forecastWeather.forecastday[2]["day"].daily_chance_of_snow}%\n**Precipitation:** ${forecastWeather.forecastday[2]["day"].totalprecip_in}in (${forecastWeather.forecastday[2]["day"].totalprecip_mm} mm)
                        `, true)

                        // FOOTER
                        .setFooter(`Powered by Weather API | Weather as of: ${moment(result.data.current.last_updated).subtract(0, 'hours').format(`MMMM D, YYYY, h:mm:ss a`)}`)

                    // SHARING EMBED WITH LOCATION
                    await interaction.editReply({ embeds: [forecastWeatherEmbed] })
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
    }
}