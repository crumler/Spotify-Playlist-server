const jwt = require('jsonwebtoken');
const sequelize = require('../db');
const User = sequelize.import('../models/user');

module.exports = function (req, res, next) {
    if (req.method == 'OPTIONS') {
        next()
    } else {
        const sessionToken = req.headers.authorization;
        if (!sessionToken) return res.status(403).send({ auth: false, message: 'No token provided.' });
        else {
            jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
                if (decoded) {
                    User.findOne({ where: { id: decoded.id } }).then(user => {
                        if (!user) throw 'err';
                        req.user = user;
                        next();
                    },
                        function () {
                            res.status(401).send({ error: '401: Not authorized' });
                        });
                } else {
                    res.status(400).send({ error: '400: Not authorized' });
                }
            });
        }
    }
}