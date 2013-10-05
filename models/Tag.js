/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tag', {
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
