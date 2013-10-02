/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Post', { 
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
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
    color: {
      type: DataTypes.STRING
    },
    colorBar: {
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
    }
  });
};