var musicModel = require('../Schemas/music');

exports.add_song = async (req, res) => {
    var { name, artists, img, audio, duration } = req.body;
    var Song = new musicModel({name, artists, img, audio, duration });
    await Song.save( (err) => {
        if (err) {
            res.status(500).end();
            throw err;
        }
        res.json({
            'status': 'Song Added to database'
        });
    })
}

exports.get_songs = async (req, res) => {
    await musicModel.find({}, (err, result) => {
        if (err) {
            res.status(500).end();
            throw err;
        }
        res.json({
            musicList: result
        });
    })
}