const fetch = require("node-fetch");
var request = require("request");
const jwt = require("jsonwebtoken");
const passport = require("passport");
var bcrypt = require("bcryptjs");
const config = require('../config')
const Razorpay = require('razorpay')

var orderModel = require('../Schemas/order')

const instance = new Razorpay({
    key_id: config.RAZOR_PAY_KEY_ID,
    key_secret: config.RAZOR_PAY_KEY_SECRET,
});

exports.createOrder = (req, res) => {
    try {
        var { amount } = req.body;
        const options = {      
            amount: amount * 100, // amount == Rs 10
            currency: "INR",
            receipt: "receipt#1",
            payment_capture: 0,
        // 1 for automatic capture
        // 0 for manual capture
        };
        instance.orders.create(options, async function (err, order) {
            if (err) {
                return res.status(500).json({
                message: "Something Went Wrong",
                });
            }
            return res.status(200).json(order);
        });
    }
    catch (err) {
        return res.status(500).json({
          message: "Something Went Wrong",
        });
    }
}

exports.capturePayment = (req, res) => {
    try {
        var amount = req.body.amount;    
        return request(
        {
            method: "POST",
            url: `https://${config.RAZOR_PAY_KEY_ID}:${config.RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
            form: {
            amount: amount * 100, // amount == Rs 10 // Same As Order amount
            currency: "INR",
            },
        },
        
        async function (err, response, body) {
            if (err) {
                return res.status(500).json({
                    message: "Something Went Wrong",
                }); 
            }      
            
            console.log("Status:", response.statusCode);
            console.log("Headers:", JSON.stringify(response.headers));
            // console.log("Response:", body);
            var orderDetails = JSON.parse(body);
            orderDetails.amount /= 100;
            console.log("Response", orderDetails)
            var order = new orderModel(orderDetails)
            await order.save( error => {
                if (error) {
                    console.log(error)
                    res.status(500).json({
                        message: "Error saving data. Contact administrator"
                    })
                }
                else {
                    console.log('saved to database')
                    return res.status(200).json(body);
                }
            })
            });
        }

        catch (err) {
            return res.status(500).json({
                message: "Something Went Wrong",
        });  
    }
}