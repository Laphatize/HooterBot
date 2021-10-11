const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {

        if (message.content === '$threadedChannelTestEmbed' && message.author.id === config.botAuthorId) {
            setTimeout(() => message.delete(), 0 );
            let testEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`Head's Up!`)
                .setDescription(`The Admins are cooking up some changes and updates to the server and it will affect this channel. This channel will be temporarily offline tomorrow to implement these changes. Once that happens, consider using <#829409161581821997> or <#829409161581822000> until we restore the channel.\n\nThanks for understanding! `)
            return message.channel.send({ embeds: [testEmbed ] })
        }
    }
}


module.exports = {
	name: 'threadCreate',
	async execute(thread, client) {

        // THREAD CHANNEL ARRAY
        if(
            thread.parent.id === 897145655145930842
        ){
            let threadChannelEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`This channel is using ${config.emjThread} threads to organize conversations!`)
                .addField(`Want to participate in a discussion?`, `Select a thread above and start talking! You can reopen archived threads at any time by sending a new message.`)
                .addField(`Want to follow a discussion?`, `Select a thread and click the "Join" button. You'll join the thread and get notifications for any new messages.`)
                .addField(`Want to talk about a new topic?`, `Create a new thread using the ${config.emjAttachment} button. Make sure your thread title is descriptive so others know what your thread is about.`)
                .setFooter(`Threads may be renamed or closed by the admins or mods per the <#829409161581821994>.`)

            return thread.parent.send({ embeds: [threadChannelEmbed ]})
        }
	},
};