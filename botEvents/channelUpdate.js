const guildSchema = require('../Database/guildSchema');


module.exports = {
	name: 'channelUpdate',
	async execute(channel, client) {

        // CHECK IF DATABASE HAS AN ENTRY
        const dbGuildData = await guildSchema.findOne({
            GUILD_ID: channel.guild.id
        }).exec();


        // FETCH TICKET CATEGORY FROM DATABASE
        if(dbGuildData.TICKET_CAT_ID) {
            ticketCategory = dbGuildData.TICKET_CAT_ID;
        }


        // IGNORE CHANNELS NOT CREATED IN TICKET CATEGORY
        if(channel.parentId !== dbGuildData.TICKET_CAT_ID)     return;


        // EDITING CHANNEL COUNTS
        if(channel.parentId == dbGuildData.TICKET_CAT_ID) {

            // FETCHING THE GUILD FROM DATABASE
            guild = client.guilds.cache.get(dbGuildData.GUILD_ID)


            // GRAB TICKET CATEGORY USING ID
            let ticketCategory = guild.channels.cache.get(dbGuildData.TICKET_CAT_ID)


            // COUNT HOW MANY TEXT CHANNELS START WITH "verify-"
            let ticketCount = guild.channels.cache.filter(ch => ch.type === `GUILD_TEXT` && ch.name.startsWith(`verify-`) && ch.parent.name.startsWith(`VERIFICATION`)).size; 


            // COUNT HOW MANY TOTAL CHANNELS
            let catChCount = guild.channels.cache.filter(ch => ch.type === `GUILD_TEXT` && ch.parent.name.startsWith(`VERIFICATION`)).size;


            // UPDATING CATEGORY VALUES
            ticketCategory.setName(`VERIFICATION (OPEN: ${ticketCount}) [${catChCount}/50]`)

            console.log(`Ticket category should read:\nVERIFICATION (OPEN: ${ticketCount}) [${catChCount}/50]`)
        };
	},
};