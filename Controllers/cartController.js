var profileModel = require('../Schemas/profile');
const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.get_cart = async (req, res) => {
    if(req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, "nodeauthsecret");
        var email = payload.email;
        var user;
        var cart = [];
        await profileModel.findOne({email: email}).populate('cart.item').exec( (err, result) =>{
            if (err) {
                res.status(500).end();
                throw err;
            }
            user = result._id;
            if (result.cart)
                cart = result.cart;
            res.json({
                cart: cart
            });
        });
    }
    else {
        res.json({
            cart: []
        });
    }
}

exports.add_to_cart = async (req, res) => {
    if(req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, "nodeauthsecret");
        var email = payload.email;
        console.log(email);
        var itemID = req.body.itemID;
        var date;
        if (req.body.date) {
            date = new Date(req.body.date);
        }
        else {
            date = moment().format('YYYY-MM-DD');
        }
        console.log(itemID, date);
        var user;
        var cart = [];
        await profileModel.findOne({email: email}).populate('cart.item').exec( async (err, result) =>{
            if (err) {
                res.status(500).end();
                throw err;
            }
            user = result._id;
            if (result.cart){
                cart = result.cart;
            }
            console.log("Sed: ", user, cart);
            var item = {item: itemID, date: date};
            cart.push(item);
            console.log("Cart: ", cart);
            await profileModel.findByIdAndUpdate(user, {cart: cart}, (err, result) => {
                if (err) {
                    res.status(500).end();
                    throw err;
                }
            })
            res.json("Added to Cart");
        });
    }
    else {
        res.json({});
    }
}

exports.remove_from_cart = async (req, res) => {
    if(req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, "nodeauthsecret");
        var email = payload.email;
        var itemID = req.body.itemID;
        var date;
        if (req.body.date) {
            date = moment(new Date(req.body.date)).format('YYYY-MM-DD');
        }
        else {
            date = moment().format('YYYY-MM-DD');
        }
        var user;
        var cart = [];
        await profileModel.findOne({email: email}, async (err, result) =>{
            if (err) {
                res.status(500).end();
                throw err;
            }
            user = result._id;
            if (result.cart){
                cart = result.cart;
            }
            console.log(cart);
            var updatedCart = cart.filter( (value, index, err) => {
                var valDate = moment(value.date).format('YYYY-MM-DD');
                return (value.item != itemID) || (valDate != date);
            });
            console.log(updatedCart);
            await profileModel.findByIdAndUpdate(user, {cart: updatedCart}, (err, result) => {
                if (err) {
                    res.status(500).end();
                    throw err;
                }
            });
            res.json("Cart Updated");
        });
    }
    else {
        res.json("User not found");
    }
}