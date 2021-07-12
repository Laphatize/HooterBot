const mongoose = require ('mongoose')

module.exports = mongoose.model("Birthday", new mongoose.Schema({

    // GUILD ID:
    GUILD_ID: {type: String, required:true},

    // USER
    MONTH: {type: Number},

    // USER
    DAY: {type: Number}
},{
    timestamps: false,
    versionKey: false,
}))