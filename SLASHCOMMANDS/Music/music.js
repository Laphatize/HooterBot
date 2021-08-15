const discord = require('discord.js')
const config = require ('../../config.json')
const yt = require('ytdl-core')
const ytSearch = require('yt-search')
const { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');


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
            
            var connection = getVoiceConnection(interaction.guild.id)

            // JOIN CONFIRMATION
            let joiningEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlue)
                .setTitle(`Here I Come!`)
                .setDescription(`Attempting to join you now!`)

            interaction.reply({ embeds: [joiningEmbed], ephemeral: true });

            // ATTEMPTING TO CONNECT
            if(connection?.state.status !== VoiceConnectionStatus.Destroyed) {
                // CONNECTING
                const connection = joinVoiceChannel({
                    channelId: userVC.id,
                    guildId: interaction.guild.id,
                    adapterCreator: userVC.guild.voiceAdapterCreator,
                    selfDeaf: false,
                    selfMute: false,
                });

                connection.on(VoiceConnectionStatus.Signalling, () => {
                    interaction.channel.send('\`\`Initial voice connection is signaling permission to join a voice channel.\`\`');
                });

                connection.on(VoiceConnectionStatus.Connecting, () => {
                    interaction.channel.send('\`\`Permission to join voice channel authorized, establishing connection to voice channel.\`\`');
                });
                
                connection.on(VoiceConnectionStatus.Ready, () => {
                    interaction.channel.send('\`\`[Connection has entered the Ready state - ready to play audio, join sequence complete!]\`\`');
                });

                // JOIN CONFIRMATION
                let joiningEmbed = new discord.MessageEmbed()
                    .setColor(config.embedBlue)
                    .setDescription(`I've joined ${userVC}! Let's get some music playing!`)

                interaction.followUp({ embeds: [joiningEmbed], ephemeral: true });
            }
            else{
                // JOIN CONFIRMATION
                let joiningEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Sorry!`)
                    .setDescription(`Seems I'm having a hard time joining you in ${userVC}... Try again in a little while.`)
                    .setFooter(`If this continues to happen, please create a ModMail ticket to inform MrMusicMan789.`)

                interaction.followUp({ embeds: [joiningEmbed], ephemeral: true });
            }
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

            var connection = getVoiceConnection(interaction.guild.id)


            // LEAVING VC - DESTROY CONNECTIOn
            connection.destroy();
        }
        


        /*******************/
        /* PLAY            */
        /*******************/
        if(subCmdName == 'play') {

            let userVC = interaction.member.voice.channel
            const player = connection.state.subscription.player;


            // USER NOT IN VC
            if(!userVC) {
                let notInVcEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`You need to be in a voice channel before we can start jamming! 🎵\nHop into a voice channel and make sure I'm there too with \`\`/music join\`\`!`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notInVcEmbed], ephemeral: true })
            }

            var connection = getVoiceConnection(interaction.guild.id)
            // const subscription = connection.subscribe(audioPlayer);

            return interaction.reply({ content: `You asked HooterBot to play music in your current voice channel. (Sorry, don't know how to do that yet!)` });
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

            var connection = getVoiceConnection(interaction.guild.id)
            // const subscription = connection.subscribe(audioPlayer);

            return interaction.reply({ content: `You asked HooterBot to stop the music in your current voice channel. (Sorry, don't know how to do that yet!)` });
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

            var connection = getVoiceConnection(interaction.guild.id)
            // const subscription = connection.subscribe(audioPlayer);

            return interaction.reply({ content: `You asked HooterBot to skip to the next song in the queue. (Sorry, don't know how to do that yet!)`});
        }



        /*******************/
        /* QUEUE           */
        /*******************/
        if(subCmdName == 'queue') {

            return interaction.reply({ content: `You asked HooterBot to pull up the current queue of music for this session. (Sorry, don't know how to do that yet!)`});
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
            
            return interaction.reply({ content: `You asked HooterBot to clear the current queue of music. (Sorry, don't know how to do that yet!)`});
        }
                


        /*******************/
        /* SEARCH          */
        /*******************/
        if(subCmdName == 'search') {

            // GETTING OPTIONS VALUES
            let searchTitle = interaction.options.getString('title');
            let searchArtist = interaction.options.getString('artist');


            if(!searchArtist) {
                const result = await ytSearch(searchTitle)

                interaction.reply({ content: `You asked HooterBot to search for music: *"${searchTitle}"*.` });

                resultsArray = []


                const videos = result.videos.slice( 0 , 1 )
                videos.forEach( function (v) {
                    resultsArray.push( `**"${ v.title }"** (${ v.timestamp }) by *${ v.author.name }*` )
                })

                interaction.channel.send({ content: `Result: ${resultsArray.join(`\n`)}`})
            }
            else {
                const result = await ytSearch(`${searchTitle} by ${searchArtist}`)

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


            // PLAYLIST URL ENTERED
            if(videoURL.includes(`&list=`)) {
                let playlistLinkEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`You submitted a link to a YouTube playlist! I unfortunately cannot handle those right now. Please share individual video links!`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [playlistLinkEmbed], ephemeral: true })
            }


            // INVALID LINK TYPE
            if(videoURL.includes(`youtube.com/watch?v=`) || videoURL.includes(`youtu.be/`)) {
                let validLinkEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} YouTube Link Recognized`)
                    .setDescription(`You shared a YouTube link I can use! (I still have a lot of work to go before I can add this to your queue)`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [validLinkEmbed], ephemeral: true })
            }

            
            // NON-YOUTUBE LINKS
            else {
                let invalidLinkEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} Error!`)
                    .setDescription(`Unrecognized link. Please make sure the link is for a single video from YouTube.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [invalidLinkEmbed], ephemeral: true })
            }
        }
    }
}