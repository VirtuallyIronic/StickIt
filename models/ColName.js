/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ColName', {
	id: {
	  type: DataTypes.INTEGER,
	  unique: true,
	  allowNull: false,
	  primaryKey: true,
	  autoIncrement: true 
	},
	wallId: {
	  type: DataTypes.STRING(12),
	  primaryKey: true,
	  allowNull: false,
	  references: "Wall",
	  referencesKey: "id"
	},
	colNum: {
	  type: DataTypes.INTEGER,
	  allowNull: false
	},
	title: {
	  type: DataTypes.STRING,
	  allowNull: false,
	  defaultValue: 'Untitled'
	}
  });
};
