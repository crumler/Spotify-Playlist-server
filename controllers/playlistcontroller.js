var express = require('express');
var router = express.Router();
var sequelize = require('../db');
// var Playlist = require('../models/playlist')(sequelize, require('sequelize'));
var Playlist = sequelize.import('../models/playlist');
var validateSession = require('../middleware/validate-session');
var User = sequelize.import('../models/user');

// Create Playlist endpoint
router.post('/create', validateSession, (req, res) => {
    var playlistName = req.body.playlist.playlistName;
    var playlistOwner = req.user.username;
    var description = req.body.playlist.description;
    var userId = req.user.id;

    Playlist.create({
        playlistName: playlistName,
        playlistOwner: playlistOwner,
        description: description,
        userId: userId
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

// !Add UPDATE and DELETE endpoints

// Update playlist endpoint
router.put('/update/:id', function (req, res) {
    var playlistName = req.body.playlist.playlistName;
    var description = req.body.playlist.description;
    var data = req.params.id;

    Playlist.update({
        playlistName: playlistName,
        description: description
    },
        { where: { id: data } }
    ).then(
        function updateSuccess(updatedPlaylist) {
            res.json({
                playlistName: playlistName,
                description: description
            });
        },
        function updateError(err) {
            res.send(500, err.message);
        }
    )
});

// Delete playlist endpoint
router.delete('/delete/:id', (req, res) => {
    var data = req.params.id;
    var playlistName = req.body.playlist.playlistName;
    var description = req.body.playlist.description;
    var playlistOwner = req.body.playlist.playlistOwner;

    Playlist.destroy({
        where: { id: data, userId: req.user.id }
    }).then(
        function deleteSuccess(data) {
            res.json({
                data: data,
                message: 'deleted'
            });
        },
        function createError(err) {
            res.send(404, err.message);
        }
    );
});

module.exports = router;