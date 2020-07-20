const mongoose = require('mongoose');

var oauthSchema = new mongoose.Schema({
    provider: {
        type: String,
    },
    providerID: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    }
})

const Oauth = mongoose.model("Oauth", oauthSchema);
module.exports = Oauth;