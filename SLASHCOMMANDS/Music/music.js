const discord = require('discord.js')
const config = require ('../../config.json')
const yts = require('yt-search')
const { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');

const connection = getVoiceConnection(myVoiceChannel.guild.id);
const subscription = connection.subscribe(audioPlayer);



module.exports = {
    name: 'music',
    description: 'Commands regarding music playing in voice channels.',
    options: [
        {
            // MUSIC JOIN
            name: `join`,
            description: `Have HooterBot join your voice channel.`,
            type: 'SUB_COMMAND',
            options: []
        },{
            // MUSIC LEAVE
            name: `leave`,
            description: `Have HooterBot leave the voice channel.`,
            type: 'SUB_COMMAND',
            options: [],    
        },{
            // MUSIC PLAY
            name: `play`,
            description: `Starts playing music.`,
            type: 'SUB_COMMAND',
            options: []
        },{
            // MUSIC STOP
            name: `stop`,
            description: `Stops playing music.`,
            type: 'SUB_COMMAND',
            options: []
        },{
            // MUSIC SKIP
            name: `skip`,
            description: `Skips the current song for the next song in the queue.`,
            type: 'SUB_COMMAND',
            options: []
        },{
            // MUSIC QUEUE
            name: `queue`,
            description: `Displays the current music queue.`,
            type: 'SUB_COMMAND',
            options: []
        },{
            // MUSIC CLEAR_QUEUE
            name: `clear_queue`,
            description: `Clears the queue of all songs.`,
            type: 'SUB_COMMAND',
            options: [],
        },{
            // MUSIC SEARCH
            name: `search`,
            description: `Have HooterBot find and add a song to the queue using the title.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `title`,
                    description: `Search using the title.`,
                    type: `STRING`,
                    required: true
                },{
                    name: `artist`,
                    description: `Specify the artist of the song to find a more specific result.`,
                    type: `STRING`,
                    required: false
                },
            ],
        },{
            // MUSIC ADD
            name: `add`,
            description: `Add a song to the playlist using a YouTube URL.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `youtube_url`,
                    description: `Must be a video URL (cannot play playlists, currently).`,
                    type: `STRING`,
                    required: true
                },
            ],
        },
    ],
    permissions: '',
    dmUse: false,
    cooldown: 0,
    defaultPermission: false,
    run: async(client, interaction, inputs) => {

        // console.log(`user command ID: ${interaction.commandId}`)

        // GRAB SUBCOMMAND
        let subCmdName = interaction.options.getSubcommand()


        /*******************/
        /* JOIN            */
        /*******************/
        if(subCmdName == 'join') {

            let userVC = interaction.member.voice.channel

            // USER NOT IN VC
            if(!userVC) {
                let notInVcEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`You need to join a voice channel before I can join you! Hop in a voice channel and re-run this command.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notInVcEmbed], ephemeral: true })
            }
            


            interaction.reply({ content: 'You asked HooterBot to join your current voice channel.' });

            const connection = joinVoiceChannel({
                channelId: userVC.id,
                guildId: interaction.guild.id,
                adapterCreator: userVC.guild.voiceAdapterCreator,
            });

            connection.on(VoiceConnectionStatus.Signalling, () => {
                interaction.channel.send('\`\`Initial voice connection is signaling permission to join a voice channel.\`\`');
            });

            connection.on(VoiceConnectionStatus.Connecting, () => {
                interaction.channel.send('\`\`Permission to join voice channel authorized, establishing connection to voice channel.\`\`');
            });
            
            connection.on(VoiceConnectionStatus.Ready, () => {
                interaction.followUp('`\`\`[Connection has entered the Ready state - ready to play audio, join sequence complete!]\`\`');
            });
        }



        /*******************/
        /* LEAVE           */
        /*******************/
        if(subCmdName == 'leave') {

            let userVC = interaction.member.voice.channel

            // USER NOT IN VC
            if(!userVC) {
                let notInVcEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`You need to be in a voice channel for me to leave a voice channel, silly!`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notInVcEmbed], ephemeral: true })
            }

            connection.destroy();

            return interaction.reply({ content: 'You asked HooterBot to leave your current voice channel.' });
        }
        


        /*******************/
        /* PLAY            */
        /*******************/
        if(subCmdName == 'play') {

            let userVC = interaction.member.voice.channel


            // USER NOT IN VC
            if(!userVC) {
                let notInVcEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`You need to be in a voice channel before we can start jamming! 🎵\nHop into a voice channel and make sure I'm there too with \`\`/music join\`\`!`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notInVcEmbed], ephemeral: true })
            }

            return interaction.reply({ content: 'You asked HooterBot to play music in your current voice channel.' });
        }



        /*******************/
        /* STOP            */
        /*******************/
        if(subCmdName == 'stop') {

            let userVC = interaction.member.voice.channel

            // USER NOT IN VC
            if(!userVC) {
                let notInVcEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`You need to be in a voice channel for me to stop music\nHop into a voice channel and make sure I'm there too with \`\`/music join\`\`!`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notInVcEmbed], ephemeral: true })
            }

            return interaction.reply({ content: 'You asked HooterBot to stop the music in your current voice channel.' });
        }



        /*******************/
        /* SKIP            */
        /*******************/
        if(subCmdName == 'skip') {

            let userVC = interaction.member.voice.channel

            // USER NOT IN VC
            if(!userVC) {
                let notInVcEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`You need to be in a voice channel first before I can skip music.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notInVcEmbed], ephemeral: true })
            }

            return interaction.reply({ content: 'You asked HooterBot to skip to the next song in the queue.' });
        }



        /*******************/
        /* QUEUE           */
        /*******************/
        if(subCmdName == 'queue') {

            return interaction.reply({ content: 'You asked HooterBot to pull up the current queue of music for this session.' });
        }
        


        /*******************/
        /* CLEAR QUEUE     */
        /*******************/
        if(subCmdName == 'clear_queue') {

            // USER NOT IN VC
            if(!userVC) {
                let notInVcEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`You need to be in the voice channel before you can clear the queue!`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notInVcEmbed], ephemeral: true })
            }
            
            return interaction.reply({ content: 'You asked HooterBot to clear the current queue of music.' });
        }
                


        /*******************/
        /* SEARCH          */
        /*******************/
        if(subCmdName == 'search') {

            // GETTING OPTIONS VALUES
            let searchTitle = interaction.options.getString('title');
            let searchArtist = interaction.options.getString('artist');


            if(!searchArtist) {
                const result = await yts(searchTitle)

                interaction.reply({ content: `You asked HooterBot to search for music: *"${searchTitle}"*.` });

                resultsArray = []


                const videos = result.videos.slice( 0 , 1 )
                videos.forEach( function (v) {
                    resultsArray.push( `**"${ v.title }"** (${ v.timestamp }) by *${ v.author.name }*` )
                })

                interaction.channel.send({ content: `Result: ${resultsArray.join(`\n`)}`})
            }
            else {
                const result = await yts(`${searchTitle} by ${searchArtist}`)

                interaction.reply({ content: `You asked HooterBot to search for music: *"${searchTitle}"* by **${searchArtist}**.` });

                resultsArray = []

                const videos = result.videos.slice( 0 , 1 )
                videos.forEach( function (v) {
                    resultsArray.push( `**"${ v.title }"** (${ v.timestamp }) by *${ v.author.name }*` )
                })

                interaction.channel.send({ content: `Result: ${resultsArray.join(`\n`)}`})
            }
        }

        /*******************/
        /* ADD YOUTUBE     */
        /*******************/
        if(subCmdName == 'add') {

            // GETTING OPTIONS VALUES
            let videoURL = interaction.options.getString('youtube_url');

            interaction.reply({ content: `You asked HooterBot to add this song to the queue: <${videoURL}>` });
        }
    }
}