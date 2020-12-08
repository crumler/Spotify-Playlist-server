let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let Playlist = sequelize.import('../models/playlist');
let User = sequelize.import('../models/user');

// Create Playlist endpoint
router.post('/create', (req, res) => {
    let playlistName = req.body.playlist.playlistName;
    let playlistOwner = req.user.username;
    let description = req.body.playlist.description;
    let userId = req.user.id;

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
router.get('/', function (req, res) {
    let playlistOwner = req.user.id;
    console.log(req.user.id)
    console.log('Made it!')

    Playlist
        .findAll({
            where: { userId: playlistOwner }
        })
        .then(
            function findAllPlaylists(data) {
                console.log(data)
                res.json(data);
            },
            function findAllError(err) {
                res.send(500, err.message);
                console.log('Error getting all playlists!')
            }
        );
});

// Update playlist endpoint
router.put('/update/:id', function (req, res) {
    let playlistName = req.body.playlist.playlistName;
    let description = req.body.playlist.description;
    let data = req.params.id;

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
    let data = req.params.id;

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