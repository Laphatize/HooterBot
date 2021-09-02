const discord = require('discord.js')
const config = require ('../../config.json')
const yt = require('ytdl-core')
const ytSearch = require('yt-search')
const { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection, createAudioPlayer } = require('@discordjs/voice');


module.exports = {
    name: 'music',
    description: 'Commands regarding music playing in voice channels.',
    options: [
        {
            // MUSIC JOIN
            name: `join`,
            description: `[In development] Have HooterBot join your voice channel.`,
            type: 'SUB_COMMAND',
            options: []
        },{
            // MUSIC LEAVE
            name: `leave`,
            description: `[In development] Have HooterBot leave the voice channel.`,
            type: 'SUB_COMMAND',
            options: [],    
        },{
            // MUSIC PLAY
            name: `play`,
            description: `[In development] Starts playing music.`,
            type: 'SUB_COMMAND',
            options: []
        },{
            // MUSIC STOP
            name: `pause`,
            description: `[In development] Pauses the music.`,
            type: 'SUB_COMMAND',
            options: []
        },{
            // MUSIC SKIP
            name: `skip`,
            description: `[In development] Skips the current song for the next song in the queue.`,
            type: 'SUB_COMMAND',
            options: []
        },{
            // MUSIC QUEUE
            name: `queue`,
            description: `[In development] Displays the current music queue.`,
            type: 'SUB_COMMAND',
            options: []
        },{
            // MUSIC CLEAR_QUEUE
            name: `clear_queue`,
            description: `[In development] Clears the queue of all songs.`,
            type: 'SUB_COMMAND',
            options: [],
        },{
            // MUSIC SEARCH
            name: `search`,
            description: `[In development] Have HooterBot find and add a song to the queue using the title.`,
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
            description: `[In development] Add a song to the playlist using a YouTube URL.`,
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


            // BOT UNABLE TO SPEAK IN VC
            if(!userVC.joinable) {
                let notJoinableEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`I do not have permission to join your voice channel. An admin should check the voice channel's permissions.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notJoinableEmbed], ephemeral: true })
            }


            // BOT UNABLE TO JOIN BECAUSE OF USER LIMIT
            if(!userVC.userLimit != 0 && userVC.userLimit >= userVC.members.size) {
                let notJoinableEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`I'm not able to join your voice channel because there are too many members!`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notJoinableEmbed], ephemeral: true })
            }


            // BOT UNABLE TO CONNECT TO VC
            if(!userVC.permissionsFor(interaction.guild.me).has('CONNECT')) {
                let notConnectEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`I do not have permission to connect to your voice channel. An admin should check the voice channel's permissions.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notConnectEmbed], ephemeral: true })
            }


            // BOT UNABLE TO SPEAK IN VC
            if(!userVC.permissionsFor(interaction.guild.me).has('SPEAK')) {
                let notConnectEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`I do not have permission to play music in your voice channel. An admin should check the voice channel's permissions.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notConnectEmbed], ephemeral: true })
            }


            var connection = getVoiceConnection(interaction.guild.id)

            // JOIN CONFIRMATION
            let joiningEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlue)
                .setTitle(`Here I Come!`)
                .setDescription(`Attempting to join you now!`)

            interaction.reply({ embeds: [joiningEmbed] });

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
                    .setColor(config.embedGreen)
                    .setDescription(`${config.emjGREENTICK} I've joined ${userVC}! Let's get some music playing!`)

                interaction.followUp({ embeds: [joiningEmbed] });
            }
            else{
                // JOIN CONFIRMATION
                let joiningEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Sorry!`)
                    .setDescription(`Seems I'm having a hard time joining you in ${userVC}... Try again in a little while.`)
                    .setFooter(`If this continues to happen, please create a ModMail ticket to inform MrMusicMan789.`)

                interaction.followUp({ embeds: [joiningEmbed] });
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
            

            interaction.channel.send('\`\`Establishing voice connection to destroy.\`\`');

            // LEAVING VC - DESTROY CONNECTIOn
            connection.destroy();

            interaction.channel.send('\`\`Voice connection destroyed.\`\`');

            // JOIN CONFIRMATION
            let leavingEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setDescription(`${config.emjREDTICK} I've left ${userVC}!`)

            return interaction.reply({ embeds: [leavingEmbed] });
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

            var connection = getVoiceConnection(interaction.guild.id)
            const player = createAudioPlayer();

            interaction.channel.send('\`\`[Voice connection made, audio player created.]\`\`');

            
            return interaction.reply({ content: `You asked HooterBot to play music in your current voice channel. (Sorry, don't know how to do that yet! It's complicated!)` });
        }



        /*******************/
        /* PAUSE            */
        /*******************/
        if(subCmdName == 'pause') {

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

            return interaction.reply({ content: `You asked HooterBot to stop the music in your current voice channel. (Sorry, don't know how to do that yet! It's complicated!)` });
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

            // const subscription = connection.subscribe(audioPlayer);

            return interaction.reply({ content: `You asked HooterBot to skip to the next song in the queue. (Sorry, don't know how to do that yet! It's complicated!)`});
        }



        /*******************/
        /* QUEUE           */
        /*******************/
        if(subCmdName == 'queue') {

            return interaction.reply({ content: `You asked HooterBot to pull up the current queue of music for this session. (Sorry, don't know how to do that yet! It's complicated!)`});
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
            
            return interaction.reply({ content: `You asked HooterBot to clear the current queue of music. (Sorry, don't know how to do that yet! It's complicated!)`});
        }
                


        /*******************/
        /* SEARCH          */
        /*******************/
        if(subCmdName == 'search') {

            // GETTING OPTIONS VALUES
            let searchTitle = interaction.options.getString('title');
            let searchArtist = interaction.options.getString('artist');


            if(!searchArtist) {
                // YOUTUBE SEARCH QUERY
                const result = await ytSearch(searchTitle)

                // DEFER INITIAL REPLY TO THINK
                interaction.deferReply()


                resultsArray = []
                const videos = result.videos.slice( 0 , 1 )
                videos.forEach( function (v) {
                    resultsArray.push( `**"${ v.title }"** (${ v.timestamp }) by *${ v.author.name }*` )
                })

                // SHARING RESULT
                interaction.channel.send({ content: `You asked HooterBot to search for music: *"${searchTitle}"*.\nResult: ${resultsArray.join(`\n`)}`})
            }
            else {
                // YOUTUBE SEARCH QUERY
                const result = await ytSearch(`${searchTitle} by ${searchArtist}`)

                // DEFER INITIAL REPLY TO THINK
                interaction.deferReply()


                resultsArray = []
                const videos = result.videos.slice( 0 , 1 )
                videos.forEach( function (v) {
                    resultsArray.push( `**"${ v.title }"** (${ v.timestamp }) by *${ v.author.name }*` )
                })

                // SHARING RESULT
                interaction.channel.send({ content: `You asked HooterBot to search for music: *"${searchTitle}"* by **${searchArtist}**.\nResult: ${resultsArray.join(`\n`)}`})
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

                let videoId

                // SPLIT OFF ID FROM URL
                if(videoURL.includes(`youtube.com/watch?v=`)) {
                    videoId = videoURL.split(`?v=`).pop()
                }

                // SPLIT OFF ID FROM URL
                if(videoURL.includes(`youtu.be/`)) {
                    videoId = videoURL.split(`.be/`).pop()
                }



                // SEARCHING USING EXACT VIDEO ID
                const result = await ytSearch({ videoId: videoId })

                



                let validLinkEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} YouTube Link Recognized`)
                    .setDescription(`You shared a YouTube link I can use!\n\n**Video ID:** ${videoId}\n**Video URL:** ${video.url}\n**Video Title:** ${video.title}\n**Video Duration:** ${video.timestamp}\n**Video Author:** ${video.author}\n**Video Date:** ${video.uploadDate} (${video.ago})`)
                    .setThumbnail(video.thumbnail)

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