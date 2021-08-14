const discord = require('discord.js')
const config = require ('../../config.json')
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');


module.exports = {
    name: 'music',
    description: 'Commands regarding music playing in voice channels',
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
            description: `Skips the current song for the next song in the queue`,
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
            description: `Have HooterBot find and add a song to the queue using the title`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `title`,
                    description: `Search using the title`,
                    type: `STRING`,
                    required: true
                },{
                    name: `artist`,
                    description: `Specify the artist of the song`,
                    type: `STRING`,
                    required: false
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
            
            connection.on(VoiceConnectionStatus.Ready, () => {
                interaction.channel.send('The connection has entered the Ready state - ready to play audio!');
            });
        }



        /*******************/
        /* LEAVE           */
        /*******************/
        if(subCmdName == 'leave') {

            // USER NOT IN VC
            if(!userVC) {
                let notInVcEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`You need to be in a voice channel for me to leave a voice channel, silly!`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notInVcEmbed], ephemeral: true })
            }


            return interaction.reply({ content: 'You asked HooterBot to leave your current voice channel.' });
        }
        


        /*******************/
        /* PLAY            */
        /*******************/
        if(subCmdName == 'play') {

            // USER NOT IN VC
            if(!userVC) {
                let notInVcEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`You need to be in a voice channel before we can start jamming! Hop into a voice channel and make sure I'm there too with \`\`/music join\`\`!`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [notInVcEmbed], ephemeral: true })
            }

            return interaction.reply({ content: 'You asked HooterBot to play music in your current voice channel.' });
        }



        /*******************/
        /* STOP            */
        /*******************/
        if(subCmdName == 'stop') {

            return interaction.reply({ content: 'You asked HooterBot to stop the music in your current voice channel.' });
        }



        /*******************/
        /* SKIP            */
        /*******************/
        if(subCmdName == 'skip') {

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

            return interaction.reply({ content: 'You asked HooterBot to clear the current queue of music.' });
        }
                


        /*******************/
        /* SEARCH          */
        /*******************/
        if(subCmdName == 'search') {

            // GETTING OPTIONS VALUES
            let searchTitle = interaction.options.getString('title');
            let searchArtist = interaction.options.getString('artist');

            return interaction.reply({ content: `You asked HooterBot to search for music: *"${searchTitle}"* by ${searchArtist}.` });
        }
    }
}