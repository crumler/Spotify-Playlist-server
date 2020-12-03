var express = require('express');
var router = express.Router();
var sequelize = require('../db');
// var PlaylistSong = require('../models/playlistsong')(sequelize, require('sequelize'));
var PlaylistSong = sequelize.import('../models/playlistsong');
var validateSession = require('../middleware/validate-session');
var Playlist = sequelize.import('../models/playlist');
// Add Song to Playlist endpoint
router.post('/create', validateSession, (req, res) => {
    var song = req.body.playlistsong.song;
    var artist = req.body.playlistsong.artist;
    var album = req.body.playlistsong.album;
    var playlistId = req.playlist.id;

    PlaylistSong.create({
        playlistId: playlistId,
        song: song,
        artist: artist,
        album: album
    }).then(
        function createSuccess(playlist) {
            res.json({
                playlist: playlist
            });
        },
        function createError(err) {
            res.send(500, err.message);
            console.log('Error creating playlist!')
        }
    );
});

// !Create GET UPDATE and DELETE
module.exports = router;