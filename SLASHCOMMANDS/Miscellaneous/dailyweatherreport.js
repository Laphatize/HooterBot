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
                    .setTitle(`${config.emjREDTICK} Error generating daily report!`)
                    .setDescription(`I'm having trouble locating a daily weather report for Philly today, possibly indicative of an API issue.`)
                ({ embeds: [noResultEmbed], ephemeral: true })
                guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [noResultEmbed], content: `<@${config.botAuthorId}>` })
            }


            forecastReport = result.data.forecast
            currentWeather = result.data.current
            sixAmData = result.data.forecast.forecastday[0].filter(f => f["time"] === `${moment(Date.now()).utcOffset(-4).format('YYYY-MM-DD 06:00')}`);

            console.log(`\n\nsixAmData:\n${sixAmData}\n\n`)
            

            // // GENERATING SUCCESSFUL WEATHER EMBED
            // forecastWeatherEmbed = new discord.MessageEmbed()
            //     .setColor(config.embedBlurple)
            //     .setTitle(`Weather Report: ${moment().format('dddd, MMMM D, YYYY')}`)
            //     .setThumbnail(encodeURI(`https:${forecastReport.forecastday[0]["day"].condition.icon}`))

            //     // ROW 1
            //     .addField(`Conditions:`, `${forecastReport.forecastday[0]["day"].condition.text}`, true)
            //     .addField(`High Temp:`, `${forecastReport.forecastday[0]["day"].maxtemp_f}°F (${forecastReport.forecastday[0]["day"].maxtemp_c}°C)`, true)
            //     .addField(`Low Temp:`, `${forecastReport.forecastday[0]["day"].mintemp_f}°F (${forecastReport.forecastday[0]["day"].mintemp_c}°C)`, true)
            //     // ROW 2
            //     .addField(`Humidity:`, `${forecastReport.forecastday[0]["day"].avghumidity}`, true)
            //     .addField(`Max Winds:`, `${forecastReport.forecastday[0]["day"].maxwind_mph} mph (${forecastReport.forecastday[0]["day"].maxwind_kph} kph)`, true)
            //     .addField(`UV Index:`, `${forecastReport.forecastday[0]["day"].uv}`, true)
            //     // ROW 3
            //     .addField(`Chance of Rain:`, `${forecastReport.forecastday[0]["day"].daily_chance_of_rain}%`, true)
            //     .addField(`Chance of Snow:`, `${forecastReport.forecastday[0]["day"].daily_chance_of_snow}%`, true)
            //     .addField(`Precipitation:`, `${forecastReport.forecastday[0]["day"].totalprecip_in}in (${forecastReport.forecastday[0]["day"].totalprecip_mm} mm)`, true)
            //     // ROW 4
            //     .addField(`Sunrise:`, `${forecastReport.forecastday[0]["astro"].sunrise}`, true)
            //     .addField(`Sunset:`, `${forecastReport.forecastday[0]["astro"].sunset}`, true)
            //     .addField(`\u200b`, `\u200b`, true)
            //     // ROW 5
            //     .addField(`Moonrise:`, `${forecastReport.forecastday[0]["astro"].moonrise}`, true)
            //     .addField(`Moonset:`, `${forecastReport.forecastday[0]["astro"].moonset}`, true)
            //     .addField(`Moon Phase:`, `${forecastReport.forecastday[0]["astro"].moon_phase}`, true)
            //     // FOOTER
            //     .setFooter(`Powered by Weather API | Weather as of: ${moment(result.data.current.last_updated).subtract(0, 'hours').format(`MMMM D, YYYY, h:mm:ss a`)}`)


            // let sixAMdata = forecastReport.find(hour => hour.time === moment().utcOffset(-4).format(`YYYY-MM-DD 06:00`));
            // let nineAMdata = forecastReport.find(hour => hour.time === moment().utcOffset(-4).format(`YYYY-MM-DD 09:00`));
            // let noondata = forecastReport.find(hour => hour.time === moment().utcOffset(-4).format(`YYYY-MM-DD 12:00`));
            // let threePMdata = forecastReport.find(hour => hour.time === moment().utcOffset(-4).format(`YYYY-MM-DD 15:00`));
            // let sixPMdata = forecastReport.find(hour => hour.time === moment().utcOffset(-4).format(`YYYY-MM-DD 18:00`));
            // let ninePMdata = forecastReport.find(hour => hour.time === moment().utcOffset(-4).format(`YYYY-MM-DD 21:00`));


            // // GENERATING HOURLY REPORTS
            // forecastHourlyReport1Embed = new discord.MessageEmbed()
            //     .setColor(config.embedGreen)
            //     .addField(`6AM EST`, `Condition: ${sixAMdata.condition.text}\nTemp: ${sixAMdata.temp_f}°F (${sixAMdata.temp_c}°C)\nHumidity: ${sixAMdata.humidity}\nWind: ${sixAMdata.wind_mph} mph (${sixAMdata.wind_kph} kph)\nRain Chance: ${sixAMdata.chance_of_rain}\nSnow Chance: ${sixAMdata.chance_of_snow}`, true)
            //     .addField(`9AM EST`, `Condition: ${nineAMdata.condition.text}\nTemp: ${nineAMdata.temp_f}°F (${nineAMdata.temp_c}°C)\nHumidity: ${nineAMdata.humidity}\nWind: ${nineAMdata.wind_mph} mph (${nineAMdata.wind_kph} kph)\nRain Chance: ${nineAMdata.chance_of_rain}\nSnow Chance: ${nineAMdata.chance_of_snow}`, true)
            //     .addField(`12PM EST`, `Condition: ${noondata.condition.text}\nTemp: ${noondata.temp_f}°F (${noondata.temp_c}°C)\nHumidity: ${noondata.humidity}\nWind: ${noondata.wind_mph} mph (${noondata.wind_kph} kph)\nRain Chance: ${noondata.chance_of_rain}\nSnow Chance: ${noondata.chance_of_snow}`, true)

            // forecastHourlyReport2Embed = new discord.MessageEmbed()
            //     .setColor(config.embedGreen)
            //     .addField(`3PM EST`, `Condition: ${threePMdata.condition.text}\nTemp: ${threePMdata.temp_f}°F (${threePMdata.temp_c}°C)\nHumidity: ${threePMdata.humidity}\nWind: ${threePMdata.wind_mph} mph (${threePMdata.wind_kph} kph)\nRain Chance: ${threePMdata.chance_of_rain}\nSnow Chance: ${threePMdata.chance_of_snow}`, true)
            //     .addField(`6PM EST`, `Condition: ${sixPMdata.condition.text}\nTemp: ${sixPMdata.temp_f}°F (${sixPMdata.temp_c}°C)\nHumidity: ${sixPMdata.humidity}\nWind: ${sixPMdata.wind_mph} mph (${sixPMdata.wind_kph} kph)\nRain Chance: ${sixPMdata.chance_of_rain}\nSnow Chance: ${sixPMdata.chance_of_snow}`, true)
            //     .addField(`9PM EST`, `Condition: ${ninePMdata.condition.text}\nTemp: ${ninePMdata.temp_f}°F (${ninePMdata.temp_c}°C)\nHumidity: ${ninePMdata.humidity}\nWind: ${ninePMdata.wind_mph} mph (${ninePMdata.wind_kph} kph)\nRain Chance: ${ninePMdata.chance_of_rain}\nSnow Chance: ${ninePMdata.chance_of_snow}`, true)
        })
        .catch(err => {
            // WEATHER LOAD ERROR RESPONSE
            let weatherFetchErrEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`I ran into an error grabbing weather data from the API. Please try again in a little while.`)
            guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [weatherFetchErrEmbed], content: `<@${config.botAuthorId}>` })

            // LOG
            console.log(`****** WEATHER API ERROR ******`);
            console.log(err);
            console.log(`********************************\n`);
            
            // DEFINING LOG EMBED
            let logErrEmbed = new discord.MessageEmbed()
                .setColor(config.embedGrey)
                .setTitle(`${config.emjERROR} An error has occurred with the Weather API...`)
                .setDescription(`\`\`\`${err}\`\`\``)
                .setTimestamp()
            
            // LOG ENTRY
            return client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logErrEmbed] })
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