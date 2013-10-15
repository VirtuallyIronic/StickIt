/* jshint indent: 2 */

/**
 * Tag Model
 * Model for SQL table.
 * id: Integer, Primary Key, Auto Increment
 * postId: Integer, Primary Key, References Id in Post Table
 * text: String; the tag text displayed on a post
 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tag', {
	id: {
	  type: DataTypes.INTEGER,
	  primaryKey: true,
	  autoIncrement: true,
	  unique: true,
	  allowNull: false
	},
    postId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: "Post",
      referencesKey: "id"
    },
    text: {
      type: DataTypes.STRING
    }
  });
};
