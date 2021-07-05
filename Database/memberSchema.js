const mongoose = require ('mongoose')

// NOT SURE THIS IS REALLY GOING TO BE NEEDED - PENDING DELETION

module.exports = mongoose.model("Member", new mongoose.Schema({
    
    MEMBER_ID: {type: String},

    GUILD_ID: {type: String},
},{
    timestamps: true,
    versionKey: false,
}))