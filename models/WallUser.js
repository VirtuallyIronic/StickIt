/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WallUser', {
	id: {
	  type: DataTypes.INTEGER,
	  primaryKey: true,
	  autoIncrement: true,
	  allowNull: false,
	  unique: true
	},
	userId: {
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
	permission: {
	  type: DataTypes.ENUM,
	  values: ['view', 'post', 'admin'],
	  allowNull: false,
	  defaultValue: 'view'
	}
  });
};
