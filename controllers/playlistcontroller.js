var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var Playlist = require('../models/playlist')(sequelize, require('sequelize'));

router.post('/create', (req, res) => {
    var playlistName = req.body.playlist.playlistName;
    var playlistOwner = req.body.playlist.playlistOwner;
    var description = req.body.playlist.description;

    Playlist.create({
        playlistName: playlistName,
        playlistOwner: playlistOwner,
        description: description
    })
})