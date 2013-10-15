/* jshint indent: 2 */

/**
 * Column Model
 * Model for SQL table.
 * id: Integer, Primary Key, Auto Increment
 * wallId: String(12) / VarChar(12), Primary Key, References Id in Wall Table
 * colNum: Integer
 * title: String
 */

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
