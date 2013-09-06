
/**
 * StickIt by Virtually Ironic
 * Filename:		models/User.js
 * Date Last Mod:	6/9/13
 * Purpose:			User Sequelize model
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		id: { type: DataTypes.STRING(8), allowNull: false, primaryKey: true },
		username: { type: DataTypes.STRING, allowNull: false, unique: true },
		password: { type: DataTypes.STRING, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: false },
		firstName: { type: DataTypes.STRING, allowNull: true },
		middleName: { type: DataTypes.STRING, allowNull: true },
		lastName: { type: DataTypes.STRING, allowNull: true }
	});
};