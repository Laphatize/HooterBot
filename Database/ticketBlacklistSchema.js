const mongoose = require ('mongoose')

module.exports = mongoose.model("Ticket Blacklist", new mongoose.Schema({

    // GUILD ID
    GUILD_ID: {type: String},

    // GUILD NAME
    GUILD_NAME: {type: String},

    // USER
    USER_ID: {type: String},
    USER_NAME: {type: String},
},{
    timestamps: true,
    versionKey: false,
}))