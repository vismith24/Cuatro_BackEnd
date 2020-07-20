var authService = require('../Services/authService');
const fetch = require("node-fetch");
var request = require("request");
const jwt = require("jsonwebtoken");
const passport = require("passport");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "cuatrotechinc@gmail.com",
    pass: "cuatroinc123",
  },
});

exports.index = (req, res, next) => {
    res.send("Respond with a resource");
}

exports.verify = async (req, res) => {
    const { id } = req.query;
    const { email } = jwt.verify(id, "nodeauthsecret");
    await authModel.findOneAndUpdate({email: email}, {isVerified: true}, (err, result) => {
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
    await authModel.findOne({username: username, isVerified: true}, (err, result) => {
        if (err) {
            res.status(500).end();
            throw err;
        }
        if (results.length > 0) {
            if (bcrypt.compareSync(password, results.password)) {
                var token = jwt.sign(
                    JSON.parse(
                        JSON.stringify({ email: result.email })),
                    "nodeauthsecret",
                    {
                        expiresIn: 365 * 24 * 60 * 60 * 1000
                    }
                );
                res.jso({
                    JWT: "JWT " + token,
                });
            }
            else {
                res.status(401).end();
            }
        }
        else {
            results.status(401).end();
        }
    });
}

exports.register = async (req, res) => {
    var { email, username, password } = req.body;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    await auth.findOne({email: email}, async (err, result) => {
        if (err) {
            res.status(500).end();
            throw err;
        }
        if (result.length > 0) {
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
            var User = new authModel({email: email, password: hash, username: username});
            await User.save( (err) => {
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
      console.log({
        email,
        id,
        picture,
      });
      await authModel.findOne({email: email}, async (err, result) => {
          if (err) {
              res.status(500).end();
              throw err;
          }
          if (result.length > 0) {
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
              await OAuth.save( (error) => {
                  if (error) {
                      res.status(500).end();
                      throw err;
                  } 
              })
              var Profile = new profileModel({picture: picture, email: email});
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