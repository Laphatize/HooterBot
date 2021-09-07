const discord = require('discord.js');
const botconf = require ('../../config.json')
const wait = require('util').promisify(setTimeout);
const axios = require('axios');


module.exports = {
    name: 'weather',
    description: `Current weather and the upcoming weather forecast for Philadelphia (🤖｜bot-spam) [30]`,
    permissions: '',
    dmUse: true,
    cooldown: 30,
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
                    name: `5_day_forecast`,
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
                url: encodeURI(`https://api.openweathermap.org/data/2.5/weather?q=Philadelphia&units=imperial&APPID=${process.env.WeatherAPIkey}`),
                headers: {}
            }


            // WEATHER VARIABLES
            let mainForecast, mainDescription, mainIcon
            let currentTemp, feelsLikeTemp, lowTemp, highTemp, pressureValue, humidityPercent
            let windSpeed, windDegree
            let cloudCoverage


            // WEATHER API CALL
            axios(config)
                .then(async function (response) {
                    
                    await wait(500)

                    if(!response.coord) {
                        let noResultEmbed = new discord.MessageEmbed()
                            .setColor(botconf.embedRed)
                            .setTitle(`${botconf.emjREDTICK} Sorry!`)
                            .setDescription(`I'm having trouble grabbing the weather for Philly right now. Please try again in a little while.`)
                        return interaction.editReply({ embeds: [noResultEmbed], ephemeral: true })
                    }


                    mainForecast = response["weather"]["main"]
                    mainDescription = response["description"]["main"]
                    mainIcon = response["icon"]["main"]

                    console.log(`mainForecast = ${mainForecast}`)
                    console.log(`mainDescription = ${mainDescription}`)
                    console.log(`mainIcon = ${mainIcon}`)


                    // GENERATING SUCCESSFUL MAP EMBED
                    let nearestLocationEmbed = new discord.MessageEmbed()
                        .setColor(botconf.embed)
                        .setTitle(`Current Philadelphia Weather`)
                        .addField(`Current:`, `${mainForecast}`, true)
                        .addField(`Type:`, `${mainDescription}`, true)
                        .addField(`\u200b:`, `\u200b`, true)
                        .setFooter(`Powered by OpenWeatherMap API`)
                        .setThumbnail(encodeURI(`http://openweathermap.org/img/wn/10d@${mainIcon}.png`))


                    // WAIT AT LEAST 1.5 SECOND TO POST
                    await wait(1500)


                    // SHARING EMBED WITH LOCATION
                    await interaction.editReply({ embeds: [nearestLocationEmbed] })
                })
                .catch(function (err) {
                    console.log(`**** OPENWEATHER API ERROR *****`);
                    console.log(err);
                    console.log(`********************************\n`);
                    
                    // DEFINING LOG EMBED
                    let logErrEmbed = new discord.MessageEmbed()
                        .setColor(botconf.embedGrey)
                        .setTitle(`${botconf.emjERROR} An error has occurred with the OpenWeather API`)
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
        }
    }
}
