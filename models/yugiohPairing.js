const mongoose = require("mongoose"); 

const pairingSchema = new mongoose.Schema({
    tableNum: Number,
    Player1: String,
    Player2: String,
    Round: Number
})

const yugiohPairing = mongoose.model('yugiohPairing',pairingSchema);
module.exports = yugiohPairing;