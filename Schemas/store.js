const mongoose = require('mongoose');
var Profile = require('./profile');

var storeSchema = new mongoose.Schema({
    product: {
        type: String
    },
    type: {
        type: String,
        enum: ["Studio", "Instrument"]
    },
    description: {
        type: String
    },
    bookings: [{
        date: {
            type: Date
        },
        renter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        } 
    }],
    picture: {
        type: String
    },
    price: {
        type: Number
    },
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    onStore: {
        type: Boolean,
        default: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    }
})

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;