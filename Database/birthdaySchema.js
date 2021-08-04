const mongoose = require ('mongoose')

module.exports = mongoose.model("Birthday", new mongoose.Schema({
    USER_ID: {type: String, required:true},
    MONTH: {type: Number},
    DAY: {type: Number}
},{
    timestamps: false,
    versionKey: false,
}))