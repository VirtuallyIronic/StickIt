
/**
 * StickIt by Virtually Ironic
 * Filename:		routes/auth.js
 * Date Last Mod:	4/9/13
 * Purpose:			User authentication routes.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */


// route version numbers
var MODULE_NAME = 'WALL'
  , MODULE_MAJOR_VERSION = '0'
  , MODULE_MINOR_VERSION = '0'
  , MODULE_PATCH_VERSION = '0'
  , MODULE_VERSION_APPEND = null;

// print route version for debugging and logging 
if(!MODULE_VERSION_APPEND) {
	console.log('API ' + MODULE_NAME + ' (' + MODULE_MAJOR_VERSION + '.' + MODULE_MINOR_VERSION + '.' + MODULE_PATCH_VERSION + ')');
} else {
	console.log('API ' + MODULE_NAME + ' (' + MODULE_MAJOR_VERSION + '.' + MODULE_MINOR_VERSION + '.' + MODULE_PATCH_VERSION + MODULE_VERSION_APPEND + ')');
}

var models = require('../models');
var User = models.User;
var Wall = models.Wall;
var WallUsers = models.WallUsers;

module.exports = function(app, passport) {
	app.get('/api/wall', function(req, res){
		models.sequelize.query('SELECT * FROM `Wall` WHERE `Wall`.`author`=\'' + req.user.id + '\' OR `Wall`.`isPrivate`=\'0\' OR `Wall`.`id` IN (SELECT `WallUsers`.`WallId` FROM `WallUsers` WHERE `WallUsers`.`UserId`=\'' + req.user.id + '\')', Wall).success(function(walls){
			res.json(walls);
		}).error(function(error){
			console.log(error);
		});
	});
	app.post('/api/wall', function(req, res){
		
	});
};