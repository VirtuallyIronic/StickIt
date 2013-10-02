
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
var models = ['User', 'Wall', 'WallUser', 'Post', 'ColName', 'Vote'];

models.forEach(function(model){
	module.exports[model] = sequelize.import(__dirname + '/' + model);
});

/**
module.exports.User.hasMany(module.exports.Wall);
module.exports.User.hasMany(module.exports.Post);
module.exports.User.hasMany(module.exports.WallUser);
module.exports.User.hasMany(module.exports.Wall);
module.exports.User.hasMany(module.exports.Vote);

module.exports.Wall.hasMany(module.exports.Post);
module.exports.Wall.hasMany(module.exports.WallUser);
module.exports.Wall.hasMany(module.exports.ColName);

module.exports.WallUser.hasOne(module.exports.User);
module.exports.WallUser.hasOne(module.exports.Wall);

module.exports.Post.hasOne(module.exports.User);
module.exports.Post.hasMany(module.exports.Vote);

module.exports.ColName.hasOne(module.exports.Wall);

module.exports.Vote.hasOne(module.exports.Post);
module.exports.Vote.hasOne(module.exports.User);
**/

models.forEach(function(model){
	module.exports[model].sync();
});

// export connection
module.exports.sequelize = sequelize;