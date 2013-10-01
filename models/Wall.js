/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Wall', { 
    id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    columns: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  });
};
