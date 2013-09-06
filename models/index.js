
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
			sync: { force: true }
		}
	);


// load models
var models = [
              'User'
             ];

models.forEach(function(model){
	module.exports[model] = sequelize.import(__dirname + '/' + model);
});


// export connection
module.exports.sequelize = sequelize;