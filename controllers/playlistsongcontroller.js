var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var PlaylistSong = require('../models/playlistsong')(sequelize, require('sequelize'));

// Add Song to Playlist endpoint
router.put('/create', (req, res) => {
    var song = req.body.playlistsong.song;
    var artist = req.body.playlistsong.artist;
    var album = req.body.playlistsong.album;

    Playlist.put({
        playlistName: playlistName,
        playlistOwner: playlistOwner,
        description: description
    }).then(
        function createSuccess(playlist) {
            res.json({
                playlist:playlist
            });
        },
        function createError(err) {
            res.send(500, err.message);
            console.log('Error creating playlist!')
        }
    );
});