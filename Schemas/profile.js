const mongoose = require('mongoose');

var profileSchema = new mongoose.Schema({
    picture: {
        type: String,
        default: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
    },
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    }
})

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;