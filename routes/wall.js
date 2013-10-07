
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
	
	function hasPermission(id, user, fn) {
		Wall.find(id).success(function(wall){
			if(wall) {
				if(wall.isPrivate == 0){
					fn(true);
				} else if(wall.owner == user.id){
					fn(true);
				} else {
					WallUser.find({ where: { wallId: id, userId: user.id }, limit: 1 }).success(function(wallUser){
						if(wallUser){
							fn(true);
						} else {
							fn(false);
						}
					}).error(function(){
						fn(false);
					});
				}				
			} else {
				fn(false);
			}
		}).error(function(){
			fn(false);
		});
	}
	
	function textPermission(id, user, fn) {
		Wall.find(id).success(function(wall){
			if(wall) {
				if(wall.owner == user.id){
					fn('admin');
				} else {
					WallUser.find({ where: { wallId: id, userId: user.id }, limit: 1 }).success(function(wallUser){
						if(wallUser) {
							fn(wallUser.permission);
						} else if(wall.isPrivate == 1) {
							fn(false);
						} else {
							fn('read');
						}
					}).error(function(){
						if(wall.isPrivate){
							fn(false);
						} else {
							fn('read');
						}
					});
				}
			}
		}).error(function(){
			fn(false);
		});
	}
	
/**	function hasPermission(id, fn) {
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
**/
	
	function hasAdmin(id, fn) {
		Wall.find(id).success(function(wall){
			if(wall.owner === req.user.id) {
				fn(true);
			} else {
				WallUser.find({ where: {wallId: id, userId: req.user.id}}).success(function(wallPermission){
					if(wallPermission.permission === 'admin') {
						fn(true);
					}
					else {
						fn(false);
					}
				}).error(function(error){
					fn(false);
				});
			}
		}).error(function(error){
			fn(false);
		});
	}
	
	function isNotReaderOnly(id, fn) {
		Wall.find(id).success(function(wall){
			if(wall.owner === req.user.id) {
				fn(true);
			} else {
				WallUser.find({ where: {wallId: id, userId: req.user.id}}).success(function(wallPermission){
					if(wallPermission.permission != 'read'){
						fn(true);
					}
					else {
						fn(false);
					}
				}).error(function(){
					fn(false);
				});
			}
		}).error(function(){
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
			res.send(401);
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
		hasPermission(req.params.id, req.user, function(result){
			if(result){
				textPermission(req.params.id, req.user, function(textResult){
					res.json(textResult);
				});
			} else {
				res.send(401);
			}
/**			if(result) {
				//Wall.find({ where: { id : req.params.id}, include: [ Post ]}).success(function(wall){
				//	res.json(wall);
				//}).error(function(error){
				//	res.send(500);
				//});
				Wall.find({ where: { id : req.params.id }}).success(function(wall){
					Post.findAll({ where: { wallId: req.params.id}, include: [ Vote ]}).success(function(posts){
						res.json({
							id: wall.id,
							title: wall.title,
							owner: wall.owner,
							isPrivate: wall.isPrivate,
							columns: wall.columns,
							posts: posts
						});
					}).error(function(){
						res.send(500);
					});
				}).error(function(){
					res.send(500);
				});
			}
			else {
				res.send(401);
			}
**/
		});
	});
	
	app.put('/api/wall/:id', function(req, res){
		hasAdmin(req.params.id, function(result){
			if(result) {
				Wall.find(req.params.id).success(function(wall){
					var title = req.body.title
					  , isPrivate = req.body.isPrivate
					  , columns = req.body.colums;
					
					sanitize(title).xss();
					sanitize(title).escape();
					sanitize(isPrivate).xss();
					sanitize(isPrivate).escape();
					sanitize(columns).xss();
					sanitize(columns).escape();
					
					wall.updateAttributes({
						title: title,
						isPrivate: isPrivate,
						columns: columns
					}).success(function(){
						res.send(200);
					}).error(function(error){
						res.send(500);
					});
				}).error(function(error){
					res.send(500);
				})
			}
			else {
				res.send(401);
			}
		})
	});
	
	app.delete('/api/wall/:id', function(req, res){
		hasAdmin(req.params.id, function(result){
			if(result) {
				Wall.find(req.params.id).success(function(wall){
					wall.destroy().success(function(){
						res.send(200);
					}).error(function(){
						res.send(500);
					});
				}).error(function(){
					res.send(500);
				});
			}
			else {
				res.send(401);
			}
		});
	});
	
	app.post('/api/post', function(req, res){
		var col = req.body.col
		  , row = req.body.row
		  , wallId = req.body.wallId
		  , colour = req.body.colour
		  , fontSize = req.body.fontSize
		  , text = req.body.text
		
		sanitize(col).xss();
		sanitize(col).escape();
		sanitize(row).xss();
		sanitize(row).escape();
		sanitize(wallId).xss();
		sanitize(wallId).escape();
		sanitize(colour).xss();
		sanitize(colour).escape();
		sanitize(fontSize).xss();
		sanitize(fontSize).escape();
		sanitize(text).xss();
		sanitize(text).escape();
		
		isNotReaderOnly(wallId, function(result){
			if(result) {
				Post.create({ col: col, row: row, wallId: wallId, colour: colour, colourBar: colourBar, font: font, fontSize: fontSize, text: text}).success(function(){
					res.send(200);
				}).error(function(){
					res.send(500);
				});
			}
			else {
				res.send(401);
			}
		});
	});
	
	app.get('/api/post/:id', function(req, res){
		Post.find(req.params.id).success(function(post){
			hasPermission(post.wallId, function(result){
				if(result){
					res.json(post);
				}
				else {
					res.send(401);
				}
			}).error(function(){
				res.send(500);
			});
		}).error(function(){
			res.send(500);
		});
	});
	
	app.put('/api/post/:id', function(req, res){
		Post.find(req.params.id).success(function(post){
			isNotReaderOnly(post.wallId, function(result){
				if(result){
					var col = req.body.col
					  , row = req.body.row
					  , colour = req.body.colour
					  , colourBar = req.body.colourBar
					  , font = req.body.font
					  , fontSize = req.body.fontSize
					  , text = req.body.text
					  , tags = req.body.tags;
					
					sanitize(col).xss();
					sanitize(col).escape();
					sanitize(row).xss();
					sanitize(row).escape();
					sanitize(colour).xss();
					sanitize(colour).escape();
					sanitize(colourBar).xss();
					sanitize(colourBar).escape();
					sanitize(font).xss();
					sanitize(font).escape();
					sanitize(fontSize).xss();
					sanitize(fontSize).escape();
					sanitize(text).xss();
					sanitize(text).escape();
					sanitize(tags).xss();
					sanitize(tags).escape();
					
					post.updateAttributes({
						col: col,
						row: row,
						colour: colour,
						colourBar: colourBar,
						font: font,
						fontSize: fontSize,
						text: text,
						tags: tags
					}).success(function(){
						res.send(200);
					}).error(function(){
						res.send(500);
					});
				}
				else {
					res.send(401);
				}
			}).error(function(){
				res.send(500);
			});
		}).error(function(){
			res.send(500);
		});
	});
	
	app.delete('/api/post/:id', function(req, res){
		Post.find(req.params.id).success(function(post){
			isNotReaderOnly(post.wallId, function(result){
				if(result){
					post.destroy().success(function(){
						res.send(200);
					}).error(function(){
						res.send(500);
					});
				}
				else {
					res.send(401);
				}
			}).error(function(){
				res.send(500);
			});
		}).error(function(){
			res.send(500);
		});
	});
};