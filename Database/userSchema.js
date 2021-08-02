const mongoose = require ('mongoose')

module.exports = mongoose.model("Birthday", new mongoose.Schema({
    USER_ID: {type: String, required:true},
    GUILD_ID: {type: String, required:true},
    XP_VALUE: {type: Number, default: 0},
    LEVEL: {type: Number, default: 1}
},{
    timestamps: false,
    versionKey: false,
}))