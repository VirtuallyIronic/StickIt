/* jshint indent: 2 */

/**
 * Vote Model
 * Model for SQL table.
 * id: Integer, Primary Key, Auto Increment
 * userId: String(8) / VarChar(8), Primary Key; References the id in the User Model
 * postId: Integer, Primary Key; References the id in the Post Model
 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Vote', {
	id: {
	  type: DataTypes.INTEGER,
	  primaryKey: true,
	  autoIncrement: true,
	  unique: true,
	  allowNull: false
	},
    userId: {
      type: DataTypes.STRING(8),
	  primaryKey: true,
	  allowNull: false,
	  references: "User",
	  referencesKey: "id"
    },
    postId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: "Post",
      referencesKey: "id"
    }
  });
};
