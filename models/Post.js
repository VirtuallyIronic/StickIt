/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Post', { 
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true 
    },
    col: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    row: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    wallId: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      allowNull: false,
      references: "Wall",
      referencesKey: "id"
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING
    },
    colour: {
      type: DataTypes.STRING
    },
    fontSize: {
      type: DataTypes.INTEGER
    }
  });
};