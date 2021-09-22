const mongoose = require ('mongoose')

module.exports = mongoose.model("content-blacklist", new mongoose.Schema({
    WORDS:   {type: [String]},
    GUILD_ID:   {type: String}
},{
    timestamps: true,
    versionKey: false,
}))