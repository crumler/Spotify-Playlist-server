const Sequelize = require('sequelize');

//BELOW IS THE HEROKU DEPLOYMENT CODE
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    host: 'localhost',
    dialect: 'postgres'
});

// const sequelize = new Sequelize('redbadgeproject', 'postgres', 'LetAlexaIn', {
//     host: 'localhost',
//     dialect: 'postgres'
// });

sequelize.authenticate().then(
    function () {
        console.log('Connected to Spotify Playlist Server database');
    },
    function (err) {
        console.log(err);
    }
);

User = sequelize.import('./models/user')
Playlists = sequelize.import('./models/playlist');
Songs = sequelize.import('./models/playlistsong');

// Playlists.hasMany(Songs)
// Songs.belongsToMany(Playlists)
// User.hasMany(Playlists)
// Playlists.belongsTo(User)

User.hasMany(Playlists);
Playlists.belongsTo(User);
Playlists.hasMany(Songs);


Songs.belongsToMany(Playlists, { through: 'playlistsongsjoiner' });
// Playlists.belongsToMany(Songs, { through: 'playlistsongsjoiner' });


module.exports = sequelize;