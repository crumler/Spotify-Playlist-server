module.exports = function (sequelize, DataTypes) {
    return sequelize.define('playlistsong', {
        song: {
            type: DataTypes.STRING,
            allowNull: false
        },
        artist: {
            type: DataTypes.STRING,
            allowNull: false
        },
        album: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};