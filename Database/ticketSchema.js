const mongoose = require ('mongoose')

module.exports = mongoose.model("Tickets", new mongoose.Schema({
    GUILD_ID:           {type: String},
    GUILD_NAME:         {type: String},
    CREATOR_NAME:       {type: String},   // USER WHO CREATED TICKET
    CREATOR_ID:         {type: String},   // USER WHO CREATED TICKET
    DM_INITIALMSG_ID:   {type: String},
    DM_2NDMSG_ID:       {type: String},
    STAFF_CH_ID:        {type: String},   // STAFF CHANNEL ID CREATED ON TICKET OPEN
    TICKET_CLOSE:       {type: String},   // DAY THE TICKET SHOULD BE CLOSED
    REMINDER1_MSG_ID:   {type: String},   // FIRST REMINDER (5D)
    REMINDER2_MSG_ID:   {type: String},   // CLOSE NOTICE (24H)
    TICKETCH1_MSG_ID:   {type: String},   // TICKET CHANNEL FIRST MESSAGE
},{
    timestamps: true,
    versionKey: false,
}))