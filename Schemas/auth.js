const mongoose = require('mongoose');

var authSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: true
    }
})

const Auth = mongoose.model("Auth", authSchema);
module.exports = Auth;