const mongoose = require('mongoose');

var musicSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    artists: {
        type: String
    },
    img: {
        type: String
    },
    audio: {
        type: String
    },
    duration: {
        type: String
    }
})

const Music = mongoose.model("Music", musicSchema);
module.exports = Music;