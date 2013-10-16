/* jshint indent: 2 */

/**
 * Post Model
 * Model for SQL table.
 * id: Integer, Primary Key, Auto Increment
 * wallId: String(12) / VarChar(12), Primary Key, References Id in Wall Table
 * col: Integer; the column a post is displayed in on the wall
 * row: Integer; the row a post is displayed in on the wall
 * username: String; original creator of the post
 * text: String; the text displayed on a post
 * colour: String; Colour value displayed on a post
 * fontSize: Integer; The size of a font displayed on the post
 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Post', { 
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true 
    },
    col: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    row: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    wallId: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      allowNull: false,
      references: "Wall",
      referencesKey: "id"
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING
    },
    colour: {
      type: DataTypes.STRING
    },
    fontSize: {
      type: DataTypes.INTEGER
    },
<<<<<<< HEAD
    stringtag: {
=======
    tags: {
>>>>>>> 01b6ce1d32e6f0112c13bc1394b484d1962823cc
      type: DataTypes.STRING
    }
  });
};