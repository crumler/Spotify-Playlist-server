module.exports = function (sequelize, DataTypes) {
    return sequelize.define('playlistsong', {
        song: DataTypes.STRING,
        artist: DataTypes.STRING,
        album: DataTypes.STRING,
        playlistId: DataTypes.NUMBER
    });
};