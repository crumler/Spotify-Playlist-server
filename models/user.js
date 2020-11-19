module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        favoriteArtist: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};