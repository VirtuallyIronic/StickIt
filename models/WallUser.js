/* jshint indent: 2 */

/**
 * User Model
 * Model for SQL table.
 * id: Integer, Primary Key, Auto Increment
 * userId: String(8) / VarChar(8), Primary Key; References the id field in the User Model
 * wallId: String(12) / VarChar(12), Primary Key; References the id field in the Wall Model
 * permission: 3 options: 'view', 'post', 'admin';
 *  ** Roles are Global, all users can be assigned wall permissions
 *  ** ** View: Can only see the wall in it's condition
 *  ** ** Post: Can Create, Update, Delete posts, columns
 *  ** ** Admin: Modify Wall Settings & Manage Users
 *  ** Wall Permissions are independed from User Permissions
 *  ** IE: A User can be a Wall's Admin but a Application Viewer
 */

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
