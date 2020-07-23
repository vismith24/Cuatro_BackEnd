const express = require('express');
var router = express.Router();
var cartController = require('../Controllers/cartController');

router.get('/', cartController.get_cart);
router.post('/add', cartController.add_to_cart);
router.post('/remove', cartController.remove_from_cart);

module.exports = router;