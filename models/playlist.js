module.exports = function (sequelize, DataTypes) {
    return sequelize.define('playlist', {
        playlistName: DataTypes.STRING,
        playlistOwner: DataTypes.STRING,
        description: DataTypes.STRING
    });
};