module.exports = function (sequelize, DataTypes) {
    return sequelize.define('playlist', {
        playlistName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        playlistOwner: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
    });
};