/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', { 
    id: {
      type: DataTypes.STRING(8),
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  });
};
