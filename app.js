require('dotenv').config();

var express = require('express');
var app = express();
var userController = require('./controllers/usercontroller');
var playlistController = require('./controllers/playlistcontroller');
// var songs = require('./controllers/')
var sequelize = require('./db');

sequelize.sync();

app.use(express.json());
app.use(require('./middleware/headers'));

app.use('/user', userController);
app.use(require('./middleware/validate-session'));
app.use('/playlist', playlistController);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});