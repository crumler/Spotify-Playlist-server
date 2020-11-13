require('dotenv').config();

var express = require('express');
var app = express();
var userController = require('./controllers/usercontroller');
var sequelize = require('./db');

sequelize.sync();

app.use(express.json());
app.use(require('./middleware/headers'));

app.use('/user', userController);

app.listen(5040, function(){
    console.log('Server is listening on port # 5040!');
});