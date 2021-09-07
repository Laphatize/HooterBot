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

                    // // WEATHER LOAD ERROR
                    // if(err) {
                    //     // DEFINING ERROR EMBED
                    //     let weatherFetchErrEmbed = new discord.MessageEmbed()
                    //         .setColor(botconf.embedRed)
                    //         .setTitle(`${botconf.emjREDTICK} Sorry!`)
                    //         .setDescription(`I ran into an error grabbing weather data from the API. Please try again in a little while.`)
                    //     await interaction.editReply({ embeds: [weatherFetchErrEmbed], ephemeral: true })

                    //     console.log(`****** WEATHER API ERROR ******`);
                    //     console.log(err);
                    //     console.log(`********************************\n`);
                        
                    //     // DEFINING LOG EMBED
                    //     let logErrEmbed = new discord.MessageEmbed()
                    //         .setColor(botconf.embedGrey)
                    //         .setTitle(`${botconf.emjERROR} An error has occurred with the Weather API`)
                    //         .setDescription(`\`\`\`${err}\`\`\``)
                    //         .setTimestamp()
                        
                    //     // LOG ENTRY
                    //     return client.channels.cache.find(ch => ch.name === `hooterbot-error-logging`).send({ embeds: [logErrEmbed] })
                    // }

                    // currentWeather = result.data.current

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
                    

                    // // GENERATING SUCCESSFUL WEATHER EMBED
                    // let nearestLocationEmbed = new discord.MessageEmbed()
                    //     .setColor(botconf.embed)
                    //     .setTitle(`Current Philadelphia Weather`)
                    //     .addField(`Current:`, `${condition.text}`, true)
                    //     .addField(`\u200b:`, `\u200b`, true)
                    //     .addField(`\u200b:`, `\u200b`, true)
                    //     .setFooter(`Powered by Weather API`)
                    //     .setThumbnail(encodeURI(condition.icon))
                    //     .setFooter(`Last Updated: ${moment.unix(last_updated_epoch).format(`MMMM D YYYY, h:mm:ss a`)}`)


                    // // SHARING EMBED WITH LOCATION
                    // await interaction.editReply({ embeds: [nearestLocationEmbed] })
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
