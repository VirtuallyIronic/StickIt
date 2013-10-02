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
    owner: {
  	  type: DataTypes.STRING(8),
  	  primaryKey: true,
  	  allowNull: false,
  	  references: "User",
  	  referencesKey: "id"
  	},
    wallId: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      allowNull: false,
      references: "Wall",
      referencesKey: "id"
    },
    text: {
      type: DataTypes.STRING
    }
    colour: {
      type: DataTypes.STRING
    },
    colourBar: {
      type: DataTypes.STRING
    },
    font: {
      type: DataTypes.STRING
    },
    fontSize: {
      type: DataTypes.INTEGER
    },
    totalVotes: {
      type: DataTypes.INTEGER
    },
    tags: {
      type: DataTypes.STRING
    }
  });
};