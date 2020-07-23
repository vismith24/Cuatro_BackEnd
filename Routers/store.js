var express = require('express');
var router = express.Router();
var storeController = require('../Controllers/storeController');

router.get('/', storeController.get_store);
router.post('/add_item', storeController.add_item);
router.post('/buy_instrument', storeController.buy_instrument);
router.post('/rent_studio', storeController.rent_studio);

module.exports = router;