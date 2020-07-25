var storeModel = require('../Schemas/store');
var profileModel = require('../Schemas/profile');
const jwt = require('jsonwebtoken');

exports.get_store = async (req, res) => {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, "nodeauthsecret");
        var email = payload.email;
        var user;
        await profileModel.findOne({email: email}, (err, result) => {
            if (err) {
                res.status(500).end();
                throw err;
            }
            user = result;
        });
        await storeModel.find({'poster': {"$ne": user }, onStore: true }).populate(['poster', 'buyer', 'bookings.renter']).exec( (err, result) => {
            if (err) {
                res.status(500).end();
                throw err;
            }
            if (!result.length) {
                res.json({studios: [], instruments: []});
            }
            else {
                var studios = [];
                var instruments = [];
                for (var item of result) {
                    if (item.type === 'Studio') {
                        studios.push(item);
                    }
                    else {
                        instruments.push(item);
                    }
                }
                res.json({
                    studios: studios,
                    instruments: instruments
                });
                console.log(studios, instruments);
            }
        })
    }
    else {
        res.json({studios: [], instruments: []});
    }
}

exports.add_item = async (req, res) => {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, "nodeauthsecret");
        var email = payload.email;
        console.log(token, payload, email);
        var userID;
        var items;
        var { product, type, description, picture, price } = req.body;
        await profileModel.findOne({email: email}, async (err, result) => {
            if (err) {
                res.status(500).end();
                throw err;
            }
            userID = result._id;
            items = result.itemsPosted;
            var Item = new storeModel({product, type, description, picture, price, poster: userID});
            await Item.save((err) => {
                if (err) {
                    res.status(500).end();
                    throw err;
                }
            });
            var itemID = Item._id;
            items.push(itemID);
            await profileModel.findOneAndUpdate({email: email}, {itemsPosted: items}, (err, result) => {
                if (err) {
                    res.status(500).end();
                    throw err;
                }
            })
            res.send("Item Added");
        });
    }
    else {
        res.json({});
    }
}

exports.buy_instrument = async (req, res) => {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, "nodeauthsecret");
        var email = payload.email;
        console.log(token, payload, email);
        var userID;
        var { itemID } = req.body;
        var items, cart= [];
        await profileModel.findOne({email: email}, async(err, result) => {
            if (err) {
                res.status(500).end();
                throw err;
            }
            userID = result._id;
            items = result.instrumentsBought;
            cart = result.cart;
        
            var item;
            await storeModel.findByIdAndUpdate(itemID, {buyer: userID, onStore: false}, async(err, result) => {
                if (err) {
                    res.status(500).end();
                    throw err;
                }
                item = {instrument: result._id};
                items.push(item);
                var updatedCart = cart.filter( (value, index, err) => {
                    return (value.item != itemID);
                });
                await profileModel.findOneAndUpdate({email: email}, {instrumentsBought: items, cart: updatedCart}, (err, result) => {
                    if (err) {
                        res.status(500).end();
                        throw err;
                    }
                });
                });
                res.send("Instrument Purchased");
            });
        }
    else {
        res.json({});
    }    
}

exports.rent_studio = async (req, res) => {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, "nodeauthsecret");
        var email = payload.email;
        var userID;
        var { itemID, date } = req.body;
        var dop = new Date(date);
        var items, cart = [];
        await profileModel.findOne({email: email}, async(err, result) => {
            if (err) {
                res.status(500).end();
                throw err;
            }
            console.log(result);
            userID = result._id;
            items = result.studiosRented;
            cart = result.cart
            var item;
            var bookings;
            await storeModel.findById(itemID, async (err, result) => {
                if (err) {
                    res.status(500).end();
                    throw err;
                }
                bookings = result.bookings;
                item = {studio: result._id, date: dop};
                var studio = {date: dop, renter: userID};
                bookings.push(studio);
                await storeModel.findByIdAndUpdate(itemID, {bookings: bookings}, async (err, result) => {
                    if (err) {
                        res.status(500).end();
                        throw err;
                    }
                items.push(item);
                var updatedCart = cart.filter( (value, index, err) => {
                    var valDate = moment(value.date).format('YYYY-MM-DD');
                    console.log(value.item, itemID, valDate, date);
                    return (value.item != itemID) || (valDate != date);
                });
                await profileModel.findOneAndUpdate({email: email}, {studiosRented: items, cart: updatedCart}, (err, result) => {
                    if (err) {
                        res.status(500).end();
                        throw err;
                    }
                });
                res.send("Instrument Purchased");
            });
        });
        });
    }
    else {
        res.json({});
    }    
}