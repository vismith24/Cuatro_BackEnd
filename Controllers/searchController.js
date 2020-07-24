var storeModel = require('../Schemas/store');
var profileModel = require('../Schemas/profile');
const jwt = require('jsonwebtoken');

exports.search_store = async (req, res) => {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, "nodeauthsecret");
        var email = payload.email;
        var user;
        const { searchText } = req.body;
        await profileModel.findOne({email: email}, async (err, result) => {
            if (err) {
                res.status(500).end();
                throw err;
            }
            user = result._id;
            await storeModel.find({$or: [{product: new RegExp(searchText, 'i')} , {description: new RegExp(searchText, 'i')}, {type: new RegExp('^' + searchText, 'i')}] , onStore: true}, (err, result) => {
                if (err) {
                    res.status(500).end();
                    throw err;
                }
                res.json({
                    result: result
                });
            })
        })
    }
    else {
        res.json({
            result: []
        })
    }
}