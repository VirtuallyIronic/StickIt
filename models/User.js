/* jshint indent: 2 */

/**
 * User Model
 * Model for SQL table.
 * id: String(8) / VarChar(8), Primary Key
 * username: String; the Display Name of a user
 * password: String; hashed with BCrypt
 * email: String
 * firstName, middleName, lastName: Strings; Real Name of a User
 * role: 3 options: 'view', 'post', 'admin';
 *  ** Roles are Global, all users can be assigned wall permissions
 *  ** ** View: Cannot Create a Wall
 *  ** ** Post: Can Create a Wall
 *  ** ** Admin: Create Wall and Manage Users
 *  ** Wall Permissions are controlled by the WallUser Model.
 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', { 
    id: {
      type: DataTypes.STRING(8),
      allowNull: false,
      primaryKey: true,
      unique: true
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
    },
    role: {
  	  type: DataTypes.ENUM,
	  values: ['view', 'post', 'admin'],
	  allowNull: false,
	  defaultValue: 'post'
    }
  });
};
