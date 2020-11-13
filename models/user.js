module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        favoriteArtist: DataTypes.STRING
    });
};