const mongoose = require ('mongoose')

module.exports = mongoose.model("Infractions", new mongoose.Schema({
    USER_ID: {type: String, required:true},
    USER_NAME: {type: String, required:true},
    ACTION: {type: String, required:true},
    REASON: {type: String, required:true},
    STAFF_ID: {type: String, required:true},
    INFRACTION_DATE: {type: String, required:true},
},{
    timestamps: true,
    versionKey: false,
}))