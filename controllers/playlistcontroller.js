var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var Playlist = require('../models/playlist')(sequelize, require('sequelize'));

// Create Playlist endpoint
router.post('/create', (req, res) => {
    var playlistName = req.body.playlist.playlistName;
    var playlistOwner = req.body.playlist.playlistOwner;
    var description = req.body.playlist.description;

    Playlist.create({
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

// Get All Playlists endpoint
router.get('/:id', function (req, res) {
    var playlistOwner = playlistOwner;

    Playlist
        .findAll({
            where: { playlistOwner: playlistOwner }
        })
        .then(
            function findAllPlaylists(data) {
                res.json(data);
            },
            function findAllError(err) {
                res.send(500, err.message);
                console.log('Error getting all playlists!')
            }
        );
});

module.exports = router;