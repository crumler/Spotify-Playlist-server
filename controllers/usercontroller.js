let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let User = sequelize.import('../models/user');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

// User register endpoint
router.post('/register', (req, res) => {
    console.log(req.body)
    let firstName = req.body.user.firstName;
    let lastName = req.body.user.lastName;
    let username = req.body.user.username;
    let password = req.body.user.password;
    let favoriteArtist = req.body.user.favoriteArtist;

    User.create({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: bcrypt.hashSync(password, 10),
        favoriteArtist: favoriteArtist
    }).then(
        function createSuccess(user) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
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
router.post('/login', function (req, res) {
    User.findOne({ where: { username: req.body.user.username } }).then(
        function (user) {
            if (user) {
                bcrypt.compare(req.body.user.password, user.password, function (err, matches) {
                    if (matches) {
                        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                        res.json({
                            user: user,
                            message: "Successfully authenticated",
                            sessionToken: token
                        });
                    } else {
                        res.status(502).send({ error: "502: Login credentials are incorrect" });
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


// Update user endpoint
router.put('/update/:id', function (req, res) {
    let data = req.params.id;
    let firstName = req.body.user.firstName;
    let lastName = req.body.user.lastName;
    let username = req.body.user.username;
    let favoriteArtist = req.body.user.favoriteArtist;

    User.update({
        firstName: firstName,
        lastName: lastName,
        username: username,
        favoriteArtist: favoriteArtist
    },
        { where: { id: data } }
    ).then(
        function updateSuccess(updatedUser) {
            res.json({
                firstName: firstName,
                lastName: lastName,
                username: username,
                favoriteArtist: favoriteArtist
            });
        },
        function updateError(err) {
            res.send(500, err.message);
        }
    )
});

// Delete user endpoing
router.delete('/delete/:id', function (req, res) {
    let data = req.params.id;
    let userid = req.user.id;

    User.destroy({
        where: { id: data, owner: userid }
    }).then(
        function deleteUserSuccess(data) {
            res.send('User has been removed');
        },
        function deleteUserError(err) {
            res.send(500, err.message);
        }
    );
});

module.exports = router;