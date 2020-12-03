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
    var playlistId = req.body.playlistsong.playlistId;

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

//Update Playlist Song endpoint
router.put('/update/:id', function (req, res) {
    var song = req.body.playlistsong.song;
    var artist = req.body.playlistsong.artist;
    var album = req.body.playlistsong.album;
    var data = req.params.id;

    PlaylistSong.update({
        song: song,
        artist: artist,
        album: album
    },
        { where: { id: data } }
    ).then(
        function updateSuccess(updatedPlaylistSong) {
            res.json({
                song: song,
                artist: artist,
                album: album
            });
        },
        function updateError(err) {
            res.send(500, err.message);
        }
    )
});

//Delete Playlist Song endpoint
router.delete('/delete/:id', (req, res) => {
    var data = req.params.id;
    var song = req.body.playlistsong.song;
    var artist = req.body.playlistsong.artist;
    var album = req.body.playlistsong.album;
    var playlistId = req.body.playlistsong.playlistId;

    PlaylistSong.destroy({
        where: { id: data, playlistId: playlistId }
    }).then(
        function deleteSuccess(data) {
            res.json({
                data: data,
                message: 'Playlist song deleted'
            });
        },
        function deleteError(err) {
            res.send(404, err.message);
        }
    );
});

module.exports = router;