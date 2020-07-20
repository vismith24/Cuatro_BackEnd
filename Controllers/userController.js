var authModel = require('../Schemas/auth');

exports.get_username = async (req, res) => {
    if (
        !(
          req.query.username &&
          req.query.username.length > 3 &&
          /^[a-zA-Z]+$/.test(req.query.username)
        )
      ) {
        res.json({
          isAvailable: false
        });
        return;
      }
      await authModel.findOne({username: req.query.username}, (err, result) => {
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
      await authModel.findOne({ email: req.query.email }, (err, result) => {
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