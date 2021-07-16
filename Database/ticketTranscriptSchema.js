const mongoose = require ('mongoose')

module.exports = mongoose.model("Tickets", new mongoose.Schema({


},{
    timestamps: true,
    versionKey: false,
}))