var playlistModel = require('../Schemas/playlist')
var musicModel = require('../Schemas/music');
var profileModel = require('../Schemas/profile');
const jwt = require('jsonwebtoken')

exports.createPlaylist = async (req, res) => {
    if (req.headers.authorization) {
        console.log('auth', req.headers.authorization)
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, "nodeauthsecret");
        var email = payload.email;
        var user, newPlayist;
        await profileModel.findOne({email: email}, (err, result) => {
            if (err) {
                res.status(500).end();
                throw err;
            }
            user = result;
            var { name } = req.body
            newPlayist = new playlistModel({name: name, profile: user._id});
        });
        console.log(user)
        console.log(req.body)
        await newPlayist.save((err) => {
            if (err) {
                res.status(500).end()
                throw err;
            }
        })
        res.send("Playlist added")
    }
    else {
        res.json({})
    }
    
}

exports.getAll = async (req, res) => {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, "nodeauthsecret");
        var email = payload.email;
        var user;
        await profileModel.findOne({email: email}, (err, result) => {
            if (err) {
                res.status(500).end();
                throw err;
            }
            user = result;
        });
        console.log(req.body)
        await playlistModel.find({}, 'name', (err, results) => {
            if (err) {
                res.status(500).end();
                throw err;
            }
            res.send(results)
        })
        // res.send("Playlist added")
    }
    else {
        res.json({})
    }
}

exports.addSongToPlaylist = async (req, res) => {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, "nodeauthsecret");
        var email = payload.email;
        var user;
        await profileModel.findOne({email: email}, (err, result) => {
            if (err) {
                res.status(500).end();
                throw err;
            }
            user = result;
        });
        console.log(req.body, user)
        const { name, music } = req.body
        var songs;
        await musicModel.findById(music._id, (err, results) =>{
            if (err) {
                res.status(500).end();
                throw err;
            }
            if (res == null) {
                res.status(400).end()
            }
        })
        await playlistModel.findOne({ name: name, profile: user._id }, (err, results) => {
            if (err) {
                res.status(500).end();
                throw err;
            }
            console.log('jfklasdf', results)
            songs = results.songs
            if (songs){
                if (songs.includes(music._id))
                    res.send("Already in playlist")
                else
                    songs.push(music._id)
            }
            else {
                songs = [music._id]
            }
        })
        
        await playlistModel.findOneAndUpdate({ name: name, profile: user}, { songs: songs }, (err, results) =>{
            if (err) {
                res.status(500).end();
                throw err;
            }
            // console.log(res)
            res.send("Added to playlist")
        })
        // res.send("Playlist added")
    }
    else {
        res.json({})
    }
}