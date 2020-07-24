var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
var orderController = require("../Controllers/orderController");

router.post('/', orderController.createOrder);
router.post('/capture/:paymentId', orderController.capturePayment);

module.exports = router;