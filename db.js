const Sequelize = require('sequelize');

const sequelize = new Sequelize('spotifyplaylistserver', 'postgres', 'LetAlexaIn', {
    host: 'localhost',
    dialect: 'postgres'
});

sequelize.authenticate().then(
    function() {
        console.log('Connected to Spotify Playlist Server database');
    },
    function(err){
        console.log(err);
    }
);

module.exports = sequelize;