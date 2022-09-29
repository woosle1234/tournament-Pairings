const mongoose = require("mongoose"); 

const standingSchema = new mongoose.Schema({
    rank: Number,
    Player: String,
    Points: Number
})

const yugiohStanding = mongoose.model('weissStanding',standingSchema);
module.exports = yugiohStanding;