/* jshint indent: 2 */

/**
 * Wall Model
 * Model for SQL table.
 * id: String(12) / VarChar(12), Primary Key
 * title: String; the title of the wall
 * owner: String(8) / VarChar(8); References the id of the User Model. Overall Wall Admin
 * isPrivate: BOOLEAN; True or False, is the Wall Private?
 * ** Private Walls can only be seen by the Owner or via WallUser Model
 */

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
