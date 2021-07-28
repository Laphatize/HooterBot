const mongoose = require ('mongoose')

module.exports = mongoose.model("blacklist", new mongoose.Schema({
    USER_ID: {type: String}
},{
    timestamps: true,
    versionKey: false,
}))