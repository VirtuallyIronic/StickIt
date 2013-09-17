/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WallUsers', {
	UserId: {
	  type: DataTypes.STRING(8),
	  primaryKey: true,
	  allowNull: false,
	  references: "User",
	  referencesKey: "id",
	  onDelete: 'cascade',
      onUpdate: 'cascade'
	},
	WallId: {
	  type: DataTypes.STRING(12),
	  primaryKey: true,
	  allowNull: false,
	  references: "Wall",
	  referencesKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
	},
	Permission: {
	  type: DataTypes.ENUM,
	  values: ['view', 'post', 'admin'],
	  allowNull: false,
	  defaultValue: 'view'
	}
  });
};
