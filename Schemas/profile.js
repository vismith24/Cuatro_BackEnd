const mongoose = require('mongoose');

var profileSchema = new mongoose.Schema({
    picture: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    }
})

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;