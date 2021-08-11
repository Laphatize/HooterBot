const mongoose = require ('mongoose')

module.exports = mongoose.model("Infractions", new mongoose.Schema({
    USER_ID: {type: String, required:true},
    ACTIONSARRAY: [],
},{
    timestamps: true,
    versionKey: false,
}))


// ACTIONSARRAY STRUCTURE:
// ACTION: {type: String, required:true},
// REASON: {type: String, required:true},
// STAFF_ID: {type: String, required:true},
// DATE: {type: String, required:true},
// CASE_NUM: {type: Number, required:true},