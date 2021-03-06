const fetch = require("node-fetch");
var request = require("request");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require('../config');
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: config.CUATRO_MAIL_ID,
    pass: config.CUATRO_MAIL_PASSWORD,
  },
});
var oauthModel = require('../Schemas/oauth');
var profileModel = require('../Schemas/profile');

exports.index = (req, res, next) => {
    res.send("Respond with a resource");
}

exports.verify = async (req, res) => {
    const { id } = req.query;
    const { email } = jwt.verify(id, "nodeauthsecret");
    await profileModel.findOneAndUpdate({email: email}, {isVerified: true}, (err, result) => {
        if (err) {
            res.status(500).end();
            throw err;
        }
        var token = jwt.sign(
            JSON.parse(
                JSON.stringify({ email })), 
            "nodeauthsecret", 
            { 
                expiresIn: 365 * 24 * 60 * 60 * 1000
            }
        );
        res.render("verified", {title: "Email verified", email });
    });
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    await profileModel.findOne({username: username, isVerified: true}, (err, result) => {
        if (err) {
            res.status(500).end();
            throw err;
        }
        if (result !== null) {
            if (bcrypt.compareSync(password, result.password)) {
                var token = jwt.sign(
                    JSON.parse(
                        JSON.stringify({ email: result.email })),
                    "nodeauthsecret",
                    {
                        expiresIn: 365 * 24 * 60 * 60 * 1000
                    }
                );
                res.json({
                    JWT: "JWT " + token,
                });
            }
            else {
                console.log("password");
                res.status(401).end();
            }
        }
        else {
            console.log("not exist");
            res.status(401).end();
        }
    });
}

exports.register = async (req, res) => {
    var { email, username, password } = req.body;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    await profileModel.findOne({email: email}, async (err, result) => {
        if (err) {
            res.status(500).end();
            throw err;
        }
        if (result !== null) {
            var token = jwt.sign(
                JSON.parse(
                    JSON.stringify({ email })),
                "nodeauthsecret",
                {
                    expiresIn: 365 * 24 * 60 * 60 * 1000
                }
            );
            res.json({
                JWT: "JWT " + token
            });
        }
        else {
            var Profile = new profileModel({email: email, password: hash, username: username, isVerified: false});
            //var User = new authModel({email: email, password: hash, username: username});
            await Profile.save( (err) => {
                if (err) {
                    res.status(500).end();
                    throw err;
                }
            /*
            })
            await User.save( (err) => {
                if (err) {
                    res.status(500).end();
                    throw err;
                }*/
                var token = jwt.sign(
                    JSON.parse(
                        JSON.stringify({ email })),
                    "nodeauthsecret",
                    {
                        expiresIn: 365 * 24 * 60 * 60 * 1000
                    }
                );
                link = "http://" + req.get("host") + "/auth/verify?id=" + token;
                mailOptions = {
                    to: email,
                    subject: "Please confirm your Email account for Cuatro",
                    html:
                    "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
                    link +
                    ">Click here to verify</a>",
                };
                console.log(mailOptions);
                smtpTransport.sendMail(mailOptions, (error, response) => {
                    if (error) {
                        console.log(error);
                        res.end("error");
                    } 
                    else {
                        console.log("Message sent: " + response.message);
                        res.end("Email Sent");
                    }
                });
            })

        }
    })
}

exports.google = async (req, res, next) => {
    fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.tokenId}`
    )
    .then( (res) => res.json())
    .then(async (json) => {
      var { email, picture } = json;
      var id = json.sub;
      var username = email.split('@')[0];
      var password = "G00gle@uth";
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      console.log({
        email,
        id,
        picture,
        username
      });
      await profileModel.findOne({email: email}, async (err, result) => {
          if (err) {
              res.status(500).end();
              throw err;
          }
          if (result !== null) {
              var token = jwt.sign(
                  JSON.parse(
                      JSON.stringify({ email })),
                    "nodeauthsecret",
                    {
                        expiresIn: 365 * 24 * 60 * 60 * 1000
                    }
              );
              res.json({
                  JWT: "JWT " + token
              });
          }
          else {
              var Oauth = new oauthModel({provider: "Google", providerID: id, email: email});
              await Oauth.save( (error) => {
                  if (error) {
                      res.status(500).end();
                      throw err;
                  } 
              })
              var Profile = new profileModel({picture: picture, email: email, username: username, password: hash});
              await Profile.save( (error) => {
                  if (error) {
                      res.status(500).end();
                      throw err;
                  }
                  var token = jwt.sign(
                            JSON.parse(
                        JSON.stringify({ email })),
                        "nodeauthsecret",
                        {
                            expiresIn: 365 * 24 * 60 * 60 * 1000
                        }
                );
                res.json({
                    JWT: "JWT " + token
                });
              })
          }
      })
    })
}