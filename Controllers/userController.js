var profileModel = require('../Schemas/profile');
const jwt = require('jsonwebtoken');

exports.get_username = async (req, res) => {
    if (
        !(
          req.query.username &&
          req.query.username.length > 3 &&
          /^[a-zA-Z0-9._]+$/.test(req.query.username)
        )
      ) {
        res.json({
          isAvailable: false
        });
        return;
      }
      await profileModel.findOne({username: req.query.username}, (err, result) => {
          if (err) {
              console.log(err);
              res.status(500).end();
              throw err;
          }
          if (result === null){
            res.json({
                isAvailable: true
            })
          }
          else  {
              res.json({
                  isAvailable: false
              });
          }
      })
}

exports.get_email = async (req, res) => {
    console.log(req.query);
    if (
        !(
          req.query.email &&
          /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
            req.query.email
          )
        )
      ) {
        console.log(req.query);
        res.json({
          isAvailable: false
        });
        return;
      }
      await profileModel.findOne({ email: req.query.email }, (err, result) => {
          if (err) {
              res.status(500).end();
              throw err;
          }
          if (result === null){
              res.json({
                  isAvailable: true
              });
          }
          else {
              res.json({
                  isAvailable: false
              })
          }
      })
}

exports.get_profile = async (req, res) => {
  if (req.headers.authorization) {
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, "nodeauthsecret");
    var email = payload.email;
    console.log(payload);
    await profileModel.findOne({email: email}).populate(['itemsPosted', 'studiosRented.studio', 'instrumentsBought.instrument']).exec( (err, result) => {
      if (err) {
        res.status(501).end();
        throw err;
      }
      res.json(result);
      console.log(result);
    })
  }
  else {
    res.json({});
  }
}