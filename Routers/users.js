var express = require('express');
var router = express.Router();
var userController = require('../Controllers/userController');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var profileModel = require('../Schemas/profile');

router.get('/username', userController.get_username);
router.get('/email', userController.get_email);
router.get("/", async (req, res) => {
  if (req.headers.authorization) {
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, "nodeauthsecret");
    var email = payload.email;
    console.log(payload);
    await profileModel.findOne({email: email}, (err, result) => {
      if (err) {
        res.status(501).end();
        throw err;
      }
      res.json({
        username: result.username,
        email: result.email,
        picture: result.picture
      })
    })
  }
  else {
    res.json({});
  }
});

module.exports = router;
