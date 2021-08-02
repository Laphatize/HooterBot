const userSchema = require('../Database/userSchema');
const config = require('../config.json');

module.exports = (client) => {
    client.on('messageCreate', message => {
        const { guild, member } = message
        const { cooldowns } = client
        const timestamps = cooldowns.member.id
        cooldowns.set(member.id, new discord.Collection())
        const cooldownTime = 60000          // ONCE A MINUTE


        // XP COOLDOWN
        if (timestamps.has(member.id)) {
            const expireTime = timestamps.get(member.id) + cooldownTime
    
            if (now < expireTime) {
                // USER HAS SENT MESSAGE IN THE PAST 60 SECONDS
                // IGNORE THIS MESSAGE, DON'T GRANT ANY XP
                console.log(`XP message cooldown in effect for ${member.username}.`)

                return
            }
        }
        timestamps.set(member.id, now);
        setTimeout(() => timestamps.delete(member.id), cooldownTime);


        // IGNORE BOT CHANNEL MESSAGES
        let botChannel = message.guild.channels.cache.find(ch => ch.name === `🤖｜bot-spam`)
        if(message.channel = botChannel) return;

        
        // RANDOMLY CALCULATE XP TO ADD - RANGE BETWEEN 15 AND 25 WITH AVG=20
        xpToAdd = Math.floor(Math.random()*11) + 15;

        incrementXp(guild.id, member.id, xpToAdd, message);

        console.log(`${xpToAdd}XP added for ${member.username}.`)
    })
}

// LEVEL CALCULATOR
const levelXpValues = level => Math.round(5 * (level^2) + (50 * level) + 100);

const incrementXp = async (guildId, userId, xpAdded, message) => {
    
    // GRABBING USER FROM DB
    const dbUserData = await userSchema.findOneAndUpdate({
        USER_ID: userId,
        GUILD_ID: guildId
    },{
        USER_ID: userId,
        GUILD_ID: guildId,
        $inc: {
            // INCREMENTING THE XP VALUE
            XP_VALUE: xpAdded
        }
    },{
        upsert: true
    }).exec();


    let { xp, level } = dbUserData.XP_VALUE;
    const neededXp = levelXpValues(level)

    // 
    if(xp > neededXp) {
        // INCREMENT
        ++level
        xp -= neededXp


        // FETCH GUILD MEMBER BY ID
        const levelUpUser = await guild.members.fetch(dbUserData.CREATOR_ID)


        // INFORM USER OF LEVEL UP IN BOT CHANNEL
        message.guild.channels.cache.find(ch => ch.name === `🤖｜bot-spam`).send({ content: `*Look hoot's talking!* ${config.emjOwl} Congrats **${levelUpUser.username}**, you've reached Level ${level}!` })


        // UPDATE USER'S DB ENTRY
        await userSchema.updateOne({
            USER_ID: userId,
            GUILD_ID: guildId
        },{
            XP_VALUE: xp,
            LEVEL: level
        })
    }
}

module.exports.incrementXp = incrementXp