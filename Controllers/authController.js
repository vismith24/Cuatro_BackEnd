var authService = require('../Services/authService');

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