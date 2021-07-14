const mongoose = require ('mongoose')

module.exports = mongoose.model("Tickets", new mongoose.Schema({

    // GUILD ID
    GUILD_ID: {type: String},

    // GUILD NAME
    GUILD_NAME: {type: String},

    // USER WHO CREATED TICKET
    CREATOR_NAME: {type: String},
    CREATOR_ID: {type: String},

    // INITIAL PROMPT DM MSG ID
    DM_INITIALMSG_ID: {type: String},

    // THE 2ND DM MSG ID
    DM_2NDMSG_ID: {type: String},

    // STAFF CHANNEL ID CREATED ON TICKET OPEN
    STAFF_CH_ID: {type: String},

    TICKET_CLOSE: {type: String}

},{
    timestamps: true,
    versionKey: false,
}))