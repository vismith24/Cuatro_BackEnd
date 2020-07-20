const mongoose = require('mongoose');

var oauthSchema = new mongoose.Schema({
    picture: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    }
})

const Oauth = mongoose.model("Oauth", oauthSchema);
module.exports = Oauth;