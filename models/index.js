
/**
 * StickIt by Virtually Ironic
 * Filename:		models/index.js
 * Date Last Mod:	6/9/13
 * Purpose:			Imports defined Sequelize models
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

// node modules
var fs = require('fs')
  , mysql = require('mysql')
  , Sequelize = require('sequelize')
  , db = require('config').database;

// setup a new sequelize instance
var sequelize = new Sequelize(
		db.name,
		db.username,
		db.password,
		{
			host: db.host,
			port: db.port,
			dialect: 'mysql',
			maxConcurrentQueries: 100,
			define: {
			    charset: 'utf8',
			    collate: 'utf8_general_ci',
				timestamps: false,
				freezeTableName: true
			},
			sync: {
				force: false
			},
			syncOnAssociation: false,
			pool: { maxConnections: 10, maxIdleTime: 30}
		}
	);


// load models
var models = [
              'User',
              'Wall',
              'WallUsers'
             ];

models.forEach(function(model){
	module.exports[model] = sequelize.import(__dirname + '/' + model);
});

module.exports.Wall.hasMany(module.exports.WallUsers);
module.exports.User.hasMany(module.exports.WallUsers);
module.exports.WallUsers.belongsTo(module.exports.Wall);
module.exports.WallUsers.belongsTo(module.exports.User);


models.forEach(function(model){
	module.exports[model].sync();
});


// export connection
module.exports.sequelize = sequelize;