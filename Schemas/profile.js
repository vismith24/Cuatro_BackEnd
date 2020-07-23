const mongoose = require('mongoose');
var Store = require('./store');

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
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    password: {
        type: String
    },
    itemsPosted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    }],
    studiosRented: [{
        studio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store'
        },
        date: {
            type: Date
        }
    }],
    instrumentsBought: [{
        instrument: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    cart: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store'
        },
        date: {
            type: Date,
        }
    }]
})

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;