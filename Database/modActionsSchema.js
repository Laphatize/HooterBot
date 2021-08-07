const mongoose = require ('mongoose')

module.exports = mongoose.model("modactions", new mongoose.Schema({
    USER_ID: {type: String},
    ACTION: {type: String},
    REASON: {type: String},
    CASE_NUM: {type: Number},
    MOD_ID: {type: String},
    MODACTIONS_MSGID: {type: String}
},{
    timestamps: true,
    versionKey: false,
}))