var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = require('../models/user')(sequelize, require('sequelize'));
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// User register endpoint
router.post('/register', (req, res) => {
    console.log(req.body)
    var firstName = req.body.user.firstName;
    var lastName = req.body.user.lastName;
    var username = req.body.user.username;
    var password = req.body.user.password;
    var favoriteArtist = req.body.user.favoriteArtist;

    User.create({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: bcrypt.hashSync(password, 10),
        favoriteArtist: favoriteArtist
    }).then(
        function createSuccess(user) {
            var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
            res.json({
                user: user,
                message: 'created',
                sessionToken: token
            });
        },
        function createError(err) {
            res.send(500, err.message);
        }
    )
});

// User Login endpoint
router.post('/login', function(req, res) {
    User.findOne( { where: { username: req.body.user.username } } ).then(
        function(user) {
            if(user) {
                bcrypt.compare(req.body.user.password, user.password, function (err, matches) {
                    if (matches) {
                        var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24 });
                        res.json({
                            user: user,
                            message: "Successfully authenticated",
                            sessionToken: token
                        });
                    } else {
                        res.status(502).send({ error: "502: Login credentials are incorrect"});
                    }
                });
            } else {
                res.status(500).send({ error: "500: Failed to authenticate" });
            }
        },
        function (err) {
            res.status(501).send({ error: "501: User does not exist" });
        }
    );
});

module.exports = router;