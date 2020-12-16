let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let PlaylistSong = sequelize.import('../models/playlistsong');

// Get All Songs endpoint
router.get('/', function (req, res) {
    let playlistId = req.body.playlistsong.playlistId;
    let songID = req.playlistsong.id;

    PlaylistSong
        .findAll({
            where: { playlistId: songID }
        })
        .then(
            function findAllSongs(data) {
                console.log(data)
                res.json(data);
            },
            function findAllError(err) {
                res.send(500, err.message);
                console.log('Error getting all songs in this playlist!')
            }
        );
});

// Add Song to Playlist endpoint
router.post('/create', (req, res) => {
    let song = req.body.playlistsong.song;
    let artist = req.body.playlistsong.artist;
    let album = req.body.playlistsong.album;
    let playlistId = req.body.playlistsong.playlistId;

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


//Update Playlist Song endpoint
router.put('/update/:id', function (req, res) {
    let song = req.body.playlistsong.song;
    let artist = req.body.playlistsong.artist;
    let album = req.body.playlistsong.album;
    let data = req.params.id;

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
    let data = req.params.id;
    let playlistId = req.body.playlistsong.playlistId;

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