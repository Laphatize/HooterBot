const discord = require('discord.js');
const config = require ('../../config.json')
const wait = require('util').promisify(setTimeout);
const axios = require('axios');
const moment = require('moment');


module.exports = {
    name: 'dailyweatherreport',
    description: `[FOR TESTING ONLY] Running the daily weather report.`,
    permissions: '',
    dmUse: false,
    cooldown: 10,
    options: [],
    defaultPermission: false,
    run: async(client, interaction, inputs) => {

        // DEFERRING
        await interaction.deferReply()
     
        console.log(`Running the daily weather report...`)

    let guild = client.guilds.cache.find(guild => guild.name === 'MMM789 Test Server')

    // GRAB WEATHER DATA
    let apiConfig = {
        method: 'get',
        url: encodeURI(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.weatherAPIkey}&q=39.981364957390184,-75.15441956488965&days=1&aqi=no&alerts=no`), // PHILLY WEATHER AT BELL TOWER
        headers: {}
    }

    let forecastWeatherEmbed, forecastHourlyReport1Embed, forecastHourlyReport2Embed, alertsReportEmbed


    // WEATHER API CALL
    axios(apiConfig)
        .then(async function(result) {

            console.log(`API request sent, grabbing data...`)

            await wait(500)

            // IF JSON RESPONSE IS UNDEFINED OR EMPTY - NO WEATHER DATA
            if(result === undefined || result.length === 0) {

                // DEFINING ERROR EMBED
                let noResultEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error generating daily report.`)
                    .setDescription(`I'm having trouble getting a daily weather report for Philly today, possibly indicative of an API issue.`)
                guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [noResultEmbed], content: `<@${config.botAuthorId}>` })

                return interaction.editReply({ embeds: [noResultEmbed], ephemeral: true })
            }
            else {
                console.log(`Weather API data received.`)
                forecastReport = result.data.forecast.forecastday[0]
                currentWeather = result.data.current        
                
                // GENERATING SUCCESSFUL WEATHER EMBED
                let forecastWeatherEmbed = new discord.MessageEmbed()
                    .setColor(config.embedBlurple)
                    .setTitle(`Good morning, Owls! The weather for today, ${moment().format('dddd, MMMM D, YYYY')}:`)
                    .setThumbnail(encodeURI(`https:${forecastReport.day.condition.icon}`))

                    // ROW 1
                    .addField(`Conditions:`, `${forecastReport.day.condition.text}`, true)
                    .addField(`High Temp:`, `${forecastReport.day.maxtemp_f}°F (${forecastReport.day.maxtemp_c}°C)`, true)
                    .addField(`Low Temp:`, `${forecastReport.day.mintemp_f}°F (${forecastReport.day.mintemp_c}°C)`, true)
                    // ROW 2
                    .addField(`Humidity:`, `${forecastReport.day.avghumidity}%`, true)
                    .addField(`Max Winds:`, `${forecastReport.day.maxwind_mph} mph (${forecastReport.day.maxwind_kph} kph)`, true)
                    .addField(`UV Index:`, `${forecastReport.day.uv}`, true)
                    // ROW 3
                    .addField(`Chance of Rain:`, `${forecastReport.day.daily_chance_of_rain}%`, true)
                    .addField(`Chance of Snow:`, `${forecastReport.day.daily_chance_of_snow}%`, true)
                    .addField(`Precipitation:`, `${forecastReport.day.totalprecip_in}in (${forecastReport.day.totalprecip_mm} mm)`, true)
                    // ROW 4
                    .addField(`Sunrise:`, `${forecastReport.astro.sunrise}`, true)
                    .addField(`Sunset:`, `${forecastReport.astro.sunset}`, true)
                    .addField(`Moon Phase:`, `${forecastReport.astro.moon_phase}`, true)
                    // ROW 5
                    .addField(`Moonrise:`, `${forecastReport.astro.moonrise}`, true)
                    .addField(`Moonset:`, `${forecastReport.astro.moonset}`, true)
                    .addField(`Moon Illumination:`, `${forecastReport.astro.moon_illumination}%`, true)
                    // FOOTER
                    .setFooter(`Powered by Weather API | Weather as of: ${moment(currentWeather.last_updated).subtract(0, 'hours').format(`MMMM D, YYYY, h:mm:ss a`)}`)


                let sixAMdata = forecastReport.hour[6]
                let nineAMdata = forecastReport.hour[9]
                let noondata = forecastReport.hour[12]
                let threePMdata = forecastReport.hour[15]
                let sixPMdata = forecastReport.hour[18]
                let ninePMdata = forecastReport.hour[21]


                let uvIndicatorValue

                function uvIndicator (uvIndex) {
                    // UV EVALUATIONS - https://www.epa.gov/enviro/uv-index-overview
                    if(uvIndex >= 0 && uvIndex <= 2 ) {
                        uvIndicatorValue = `🟩 ${uvIndex}\n**UV Risk:** *Low Risk*`
                    }
                    if(uvIndex >= 3 && uvIndex <= 5 ) {
                        uvIndicatorValue = `🟨 ${uvIndex}\n**UV Risk:** *Moderate Risk*`
                    }
                    if(uvIndex >= 6 && uvIndex <= 7 ) {
                        uvIndicatorValue = `🟧 ${uvIndex}\n**UV Risk:** ***High** – Protect against sun damage!*`
                    }
                    if(uvIndex >= 8 && uvIndex <= 10 ) {
                        uvIndicatorValue = `🟥 ${uvIndex}\n**UV Risk:** ***Very High** – Protect against sun damage!*`
                    }
                    if(uvIndex >= 11 ) {
                        uvIndicatorValue = `🟪 ${uvIndex}\n**UV Risk:** ***EXTREME** – Protect against sun damage!*`
                    }

                    return uvIndicatorValue;
                }


                // GENERATING HOURLY REPORTS
                forecastHourlyReport1Embed = new discord.MessageEmbed()
                    .setTitle(`Weather Forecast`)
                    .setColor(config.embedDarkGrey)
                    .addField(`6AM – ${sixAMdata.condition.text}`, `**Temp:** ${sixAMdata.temp_f}°F (${sixAMdata.temp_c}°C)\n**Feels like:** ${sixAMdata.feelslike_f}°F (${sixAMdata.feelslike_c}°C)\n**Wind chill:** ${sixAMdata.windchill_f}°F (${sixAMdata.windchill_c}°C)\n\n**UV:** ${uvIndicator(sixAMdata.uv)}\n**Humidity:** ${sixAMdata.humidity}%\n**Wind:** ${sixAMdata.wind_mph} mph (${sixAMdata.wind_kph} kph)\n\n**Rain Chance:** ${sixAMdata.chance_of_rain}%\n**Snow Chance:** ${sixAMdata.chance_of_snow}%\n**Total Precipitation:** ${sixAMdata.precip_in}/hr`, true)
                    .addField(`9AM – ${nineAMdata.condition.text}`, `**Temp:** ${nineAMdata.temp_f}°F (${nineAMdata.temp_c}°C)\n**Feels like:** ${nineAMdata.feelslike_f}°F (${nineAMdata.feelslike_c}°C)\n**Wind chill:** ${nineAMdata.windchill_f}°F (${nineAMdata.windchill_c}°C)\n\n**UV:** ${uvIndicator(nineAMdata.uv)}\n**Humidity:** ${nineAMdata.humidity}%\n**Wind:** ${nineAMdata.wind_mph} mph (${nineAMdata.wind_kph} kph)\n\n**Rain Chance:** ${nineAMdata.chance_of_rain}%\n**Snow Chance:** ${nineAMdata.chance_of_snow}%\n**Total Precipitation:** ${nineAMdata.precip_in}/hr`, true)
                    .addField(`Noon – ${noondata.condition.text}`, `**Temp:** ${noondata.temp_f}°F (${noondata.temp_c}°C)\n**Feels like:** ${noondata.feelslike_f}°F (${noondata.feelslike_c}°C)\n**Wind chill:** ${noondata.windchill_f}°F (${noondata.windchill_c}°C)\n\n**UV:** ${uvIndicator(noondata.uv)}\n**Humidity:** ${noondata.humidity}%\n**Wind:** ${noondata.wind_mph} mph (${noondata.wind_kph} kph)\n\n**Rain Chance:** ${noondata.chance_of_rain}%\n**Snow Chance:** ${noondata.chance_of_snow}%\n**Total Precipitation:** ${noondata.precip_in}/hr`, true)
  
                forecastHourlyReport2Embed = new discord.MessageEmbed()
                    .setColor(config.embedDarkGrey)
                    .addField(`3PM – ${threePMdata.condition.text}`, `**Temp:** ${threePMdata.temp_f}°F (${threePMdata.temp_c}°C)\n**Feels like:** ${threePMdata.feelslike_f}°F (${threePMdata.feelslike_c}°C)\n**Wind chill:** ${threePMdata.windchill_f}°F (${threePMdata.windchill_c}°C)\n\n**UV:** ${uvIndicator(threePMdata.uv)}\n**Humidity:** ${threePMdata.humidity}%\n**Wind:** ${threePMdata.wind_mph} mph (${threePMdata.wind_kph} kph)\n\n**Rain Chance:** ${threePMdata.chance_of_rain}%\n**Snow Chance:** ${threePMdata.chance_of_snow}%\n**Total Precipitation:** ${threePMdata.precip_in}/hr`, true)
                    .addField(`6PM – ${sixPMdata.condition.text}`, `**Temp:** ${sixPMdata.temp_f}°F (${sixPMdata.temp_c}°C)\n**Feels like:** ${sixPMdata.feelslike_f}°F (${sixPMdata.feelslike_c}°C)\n**Wind chill:** ${sixPMdata.windchill_f}°F (${sixPMdata.windchill_c}°C)\n\n**UV:** ${uvIndicator(sixPMdata.uv)}\n**Humidity:** ${sixPMdata.humidity}%\n**Wind:** ${sixPMdata.wind_mph} mph (${sixPMdata.wind_kph} kph)\n\n**Rain Chance:** ${sixPMdata.chance_of_rain}%\n**Snow Chance:** ${sixPMdata.chance_of_snow}%\n**Total Precipitation:** ${sixPMdata.precip_in}/hr`, true)
                    .addField(`9PM – ${ninePMdata.condition.text}`, `**Temp:** ${ninePMdata.temp_f}°F (${ninePMdata.temp_c}°C)\n**Feels like:** ${ninePMdata.feelslike_f}°F (${ninePMdata.feelslike_c}°C)\n**Wind chill:** ${ninePMdata.windchill_f}°F (${ninePMdata.windchill_c}°C)\n\n**UV:** ${uvIndicator(ninePMdata.uv)}\n**Humidity:** ${ninePMdata.humidity}%\n**Wind:** ${ninePMdata.wind_mph} mph (${ninePMdata.wind_kph} kph)\n\n**Rain Chance:** ${ninePMdata.chance_of_rain}%\n**Snow Chance:** ${ninePMdata.chance_of_snow}%\n**Total Precipitation:** ${ninePMdata.precip_in}/hr`, true)
                    .setFooter(`Powered by Weather API`)

                EndingEmbed = new discord.MessageEmbed()
                    .setColor(config.embedBlurple)
                    .setDescription(`*To see the current weather or generate a 3-day forecase, head to <#829685931501027359> or DMs with <@${config.botId}> and run \`\`/weather\`\`.`)

                interaction.editReply({ embeds: [forecastWeatherEmbed, forecastHourlyReport1Embed, forecastHourlyReport2Embed, EndingEmbed] })

            }
        })
        .catch(err => {
            // // WEATHER LOAD ERROR RESPONSE
            // let weatherFetchErrEmbed = new discord.MessageEmbed()
            //     .setColor(config.embedRed)
            //     .setTitle(`${config.emjREDTICK} Sorry!`)
            //     .setDescription(`I ran into an error grabbing weather data from the API. Please try again in a little while.`)
            // guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [weatherFetchErrEmbed], content: `<@${config.botAuthorId}>` })

            // LOG
            console.log(`****** WEATHER API ERROR ******`);
            console.log(err);
            console.log(`********************************\n`);
            
            // // DEFINING LOG EMBED
            // let logErrEmbed = new discord.MessageEmbed()
            //     .setColor(config.embedGrey)
            //     .setTitle(`${config.emjERROR} An error has occurred with the Weather API...`)
            //     .setDescription(`\`\`\`${err}\`\`\``)
            //     .setTimestamp()
            
            // // LOG ENTRY
            // return client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logErrEmbed] })
        })


//     // CHECK DB FOR GUILD WEATHER MESSAGE
//     const dbGuildData = await guildSchema.find({
//         GUILD_ID: guild.id,
//     }).exec();
    

//     // PAST WEATHER MESSAGE EXISTS IN CHANNEL - DELETE OLD AND POST NEW, UPDATE MSG ID IN DB
//     if(!dbGuildData.WEATHER_MSG_ID) {

//         console.log(`Past weather message does not exist... posting and logging.`)
        
//         // guild.channels.cache.find(ch => ch.name === `🌤｜weather-report`).send({ embeds: [forecastWeatherEmbed, forecastHourlyReport1Embed, forecastHourlyReport2Embed] })
//         guild.channels.cache.find(ch => ch.name === `🌤｜weather-report`).send({ embeds: [forecastWeatherEmbed] })
//         // .then(msg => {
//         //     // LOG MESSAGE ID IN DATABASE FOR GUILD
//         //     guildSchema.findOneAndUpdate({
//         //         GUILD_ID: guild.id
//         //     },{
//         //         WEATHER_MSG_ID: msg.id,
//         //     },{
//         //         upsert: true
//         //     }).exec();
//         // })
//     }

//     // // PAST WEATHER MESSAGE DNE - POST IN CHANNEL AND LOG
//     // if(dbGuildData.WEATHER_MSG_ID) {

//     //     console.log(`Past weather message already exists... deleting and then postin and logging.`)

//     //     // DELETE 2ND REMINDER IF EXISTS
//     //     if(dbGuildData.WEATHER_MSG_ID) {                            
//     //         // FETCH MESSAGE BY ID AND DELETE
//     //         guild.channels.cache.find(ch => ch.name === `🌤｜weather-report`).messages.fetch(dbGuildData.WEATHER_MSG_ID)
//     //             .then(msg => {
//     //                 setTimeout(() => msg.delete(), 0 );
//     //             })
//     //             .catch(err => console.log(err))
//     //     }

//     //     // guild.channels.cache.find(ch => ch.name === `🌤｜weather-report`).send({ embeds: [forecastWeatherEmbed, forecastHourlyReport1Embed, forecastHourlyReport2Embed] })
//     // interaction.editReply({ embeds: [forecastWeatherEmbed] })
//     //     .then(msg => {
//     //         // LOG MESSAGE ID IN DATABASE FOR GUILD
//     //         guildSchema.findOneAndUpdate({
//     //             GUILD_ID: guild.id
//     //         },{
//     //             WEATHER_MSG_ID: msg.id,
//     //         },{
//     //             upsert: true
//     //         }).exec();
//     //     })
//     // }
    }
}