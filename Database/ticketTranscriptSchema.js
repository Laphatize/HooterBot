const mongoose = require ('mongoose')

module.exports = mongoose.model("Transcripts", new mongoose.Schema({


},{
    timestamps: true,
    versionKey: false,
}))