const express = require('express');
var router = express.Router();
var searchController = require('../Controllers/searchController');

router.post('/store', searchController.search_store);

module.exports = router;