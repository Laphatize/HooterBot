const mongoose = require ('mongoose')

module.exports = mongoose.model("content-blacklist", new mongoose.Schema({
    WORDS:   {type: [String]}
},{
    timestamps: true,
    versionKey: false,
}))