
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
  , db = require('config').database
  , dbOptions = require('config').databaseOptions;

// setup a new sequelize instance
var sequelize = new Sequelize(
		db.name,
		db.username,
		db.password,
		{
			host: db.host,
			port: db.port,
			dialect: 'mysql',
			maxConcurrentQueries: dbOptions.maxConcurrentQueries,
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
			pool: {
				maxConnections: dbOptions.poolMaxConnections,
				maxIdleTime: dbOptions.poolMaxIdleTime 
			}
		}
	);


// load models
var models = ['User', 'Wall', 'WallUser', 'Post', 'ColName', 'Vote', 'Tag'];

models.forEach(function(model){
	module.exports[model] = sequelize.import(__dirname + '/' + model);
});


module.exports.User.hasMany(module.exports.Wall, {foreignKey: 'owner'});
module.exports.User.hasMany(module.exports.WallUser, {foreignKey: 'userId'});
module.exports.User.hasMany(module.exports.Vote, {foreignKey: 'userId'});

module.exports.Wall.hasMany(module.exports.Post, {foreignKey: 'wallId'});
module.exports.Wall.hasMany(module.exports.WallUser, {foreignKey: 'wallId'});
module.exports.Wall.hasMany(module.exports.ColName, {foreignKey: 'wallId'});

module.exports.Post.hasMany(module.exports.Vote, {foreignKey: 'postId'});
module.exports.Post.hasMany(module.exports.Tag, {foreignKey: 'postId'});

module.exports.WallUser.belongsTo(module.exports.User);

models.forEach(function(model){
	module.exports[model].sync();
});

// export connection
module.exports.sequelize = sequelize;