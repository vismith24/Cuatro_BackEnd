var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
var authController = require("../Controllers/authController");

router.get('/', authController.index);
router.get('/verify', authController.verify);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/google', authController.google);
router.post('/test', passport.authenticate("jwt", { session: false}), (req, res) => {
  res.status(200).end();
});

module.exports = router;
