var musicController = require('../Controllers/musicController');
const express = require('express');
var router = express.Router();

router.post('/add', musicController.add_song);
router.get('/songs', musicController.get_songs);

module.exports = router;
