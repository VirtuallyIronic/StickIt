
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

var models = require('../models')
  , ColName = models.ColName
  , Post = models.Post
  , User = models.User
  , Vote = models.Vote
  , Wall = models.Wall
  , WallUser = models.WallUser
  , shortId = require('shortid')
  , sanitize = require('validator').sanitize
  , Validator = require('validator').Validator;

var validator = new Validator();

module.exports = function(app, passport) {
	validator.error = function (err_msg) {
		return false;
	}
	
	function hasPermission(id, fn) {
		Wall.find(id).success(function(wall){
			if(wall.owner === req.user.id) {
				fn(true);
			} else {
				WallUser.find({ where: {wallId: id, userId: req.user.id}}).success(function(wallPermission){
					fn(true);
				}).error(function(error){
					fn(false);
				});
			}
		}).error(function(error){
			fn(false);
		});
	}
	
	app.get('/api/wall', function(req, res){
		models.sequelize.query('SELECT * FROM `Wall` WHERE `Wall`.`owner`=\'' + req.user.id + '\' OR `Wall`.`isPrivate`=\'0\' OR `Wall`.`id` IN (SELECT `WallUser`.`WallId` FROM `WallUser` WHERE `WallUser`.`UserId`=\'' + req.user.id + '\')', Wall).success(function(walls){
			res.json(walls);
		}).error(function(error){
			console.log(error);
		});
	});
	app.post('/api/wall', function(req, res){
		if(req.user.role === 'view') {
			res.send({'error' : 'access denied'}, 401);
		} else {
			var title = req.body.title
			  , isPrivate = req.body.isPrivate
			  , columns = req.body.colums;
			
			var wid = shortId.generate(12);
			
			sanitize(title).xss();
			sanitize(title).escape();
			sanitize(isPrivate).xss();
			sanitize(isPrivate).escape();
			sanitize(columns).xss();
			sanitize(columns).escape();
			
			Wall.create({ id: wid, title: title, owner: req.user.id, isPrivate: isPrivate, columns: columns}).success(function(wall){
				res.json(wall);
			}).error(function(error){
				res.send(error, 500);
			});
		}
	});
	app.get('/api/wall/:id', function(req, res){
		hasPermission(req.params.id, function(result){
			if(result) {
				Wall.find({ where: { id : req.params.id}, include: [ Post ]}).success(function(wall){
					res.json(wall);
				}).error(function(error){
					res.send(error, 500);
				});
			}
			else {
				res.send(401);
			}
		});
	});
};