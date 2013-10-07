/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Wall', { 
    id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    owner: {
	  type: DataTypes.STRING(8),
	  primaryKey: true,
	  allowNull: false,
	  references: "User",
	  referencesKey: "id"
	},
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });
};
