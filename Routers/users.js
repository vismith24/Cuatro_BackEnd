var express = require('express');
var router = express.Router();
var userController = require('../Controllers/userController');
const passport = require('passport');

router.get('/username', userController.get_username);
router.get('/email', userController.get_email);
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
      username: req.user.username,
      email: req.user.email,
      picture: req.user.picture,
    });
});

module.exports = router;
