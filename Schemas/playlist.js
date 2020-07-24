const mongoose = require('mongoose')

var playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Music'
        }
    ],
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
})

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist