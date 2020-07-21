const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    id: {
        type: String
    },
    entity: {
        type: String
    },
    amount: {
        type: Number
    },
    currency: {
        type: String
    },
    status: {
        type: String
    },
    orderId: {
        type: String
    },
    email: {
        type: String
    },
    contact: {
        type: String
    },
    createdAt: {
        type: Number
    }
})

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;