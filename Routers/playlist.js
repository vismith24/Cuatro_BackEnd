var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
var playlistController = require("../Controllers/playlistController");

router.post('/getall', playlistController.getAll);
router.post('/new', playlistController.createPlaylist);
router.post('/add', playlistController.addSongToPlaylist)

module.exports = router