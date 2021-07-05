const mongoose = require ('mongoose')

module.exports = mongoose.model("Tickets", new mongoose.Schema({

    // GUILD ID
    GUILD_ID: {type: String},

    // GUILD NAME
    GUILD_NAME: {type: String},

    // USER WHO CREATED TICKET
    CREATOR_NAME: {type: String},
    CREATOR_ID: {type: String},

    // USER'S VERIFICATION STATUS
    VERIFICATION_STATUS: {type: String, default: 'NO'}
},{
    timestamps: true,
    versionKey: false,
}))