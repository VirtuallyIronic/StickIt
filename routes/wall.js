
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
  , Tag = models.Tag
  , WallUser = models.WallUser
  , shortId = require('shortid')
  , sanitize = require('validator').sanitize
  , Validator = require('validator').Validator;

var validator = new Validator();

module.exports = function(app, passport) {
	validator.error = function (err_msg) {
		return false;
	}
	
	function hasPermission(id, userId, fn) {
		Wall.find({ where: { id: id }, limit: 1 }).success(function(wall){
			if(wall) {
				if(wall.isPrivate == 0){
					fn(true);
				} else if(wall.owner == userId){
					fn(true);
				} else {
					WallUser.find({ where: { wallId: id, userId: userId }, limit: 1 }).success(function(wallUser){
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
	
	function textPermission(id, userId, fn) {
		Wall.find({ where: { id: id }, limit: 1 }).success(function(wall){
			if(wall) {
				if(wall.owner == userId){
					fn('admin');
				} else {
					WallUser.find({ where: { wallId: id, userId: userId }, limit: 1 }).success(function(wallUser){
						if(wallUser) {
							fn(wallUser.permission);
						} else if(wall.isPrivate == 1) {
							fn(false);
						} else {
							fn('view');
						}
					}).error(function(){
						if(wall.isPrivate){
							fn(false);
						} else {
							fn('view');
						}
					});
				}
			}
		}).error(function(){
			fn(false);
		});
	}
	
	app.get('/api/wall', function(req, res){
		models.sequelize.query('SELECT * FROM `Wall` WHERE `Wall`.`owner`=\'' + req.user.id + '\' OR `Wall`.`isPrivate`=\'0\' OR `Wall`.`id` IN (SELECT `WallUser`.`WallId` FROM `WallUser` WHERE `WallUser`.`UserId`=\'' + req.user.id + '\')', Wall).success(function(walls){
			User.find({ where: { id : req.user.id}, limit: 1}).success(function(user){
				var admin = false
				  , post = false
				  , view = false;
				
				if(user.permission == "admin") {
					admin = true;
					post = true;
					view = true;
				} else if (user.permission == "post") {
					post = true;
					view = true;
				} else {
					view = true;
				}
				res.json({
					admin: admin,
					post: post,
					view: view,
					walls: walls
				});
			}).error(function(){
				res.send(500, {"error" : "internal server error"});
			});
		}).error(function(error){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.get('/api/wall/:id', function(req, res){
		hasPermission(req.params.id, req.user.id, function(result){
			if(result){
				Wall.find({ where: { id: req.params.id }, limit: 1}).success(function(wall){
					if(wall) {
						textPermission(req.params.id, req.user.id, function(textResult){
							Post.findAll({ where: { wallId: req.params.id }, include: [Vote, Tag]}).success(function(posts){
								ColName.findAndCountAll({ where: { wallId: req.params.id}}).success(function(colnames){
									res.json({
										id: wall.id,
										title: wall.title,
										owner: wall.owner,
										isPrivate: wall.isPrivate,
										permission: textResult,
										totalCols: colnames.count,
										cols: colnames.rows,
										posts: posts
									});
								}).error(function(){
									res.send(500, {"error" : "internal server error"});
								});
							}).error(function(){
								res.send(500, {"error" : "internal server error"});
							});
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				}).error(function(){
					res.send(500, {"error" : "internal server error"});
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		});
	});
	
	app.get('/api/wallpermissions/:id', function(req, res){
		hasPermission(req.params.id, req.user.id, function(result){
			if(result){
				textPermission(req.params.id, req.user.id, function(textResult){
					if(textResult == "admin") {
						WallUser.findAll({ where: { wallId: req.params.id }, include: [User]}).success(function(wallUsers){
							res.json({
								wallId: req.params.id,
								permission: wallUsers
							});
						}).error(function(){
							res.send(500, {"error" : "internal server error"});
						})
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		});
	});
	
	app.post('/api/wallpermissions', function(req, res){
		var wallId = req.body.wallId
		  , username = req.body.username
		  , permission = req.body.permission;
		
		sanitize(wallId).xss();
		sanitize(wallId).escape();
		sanitize(username).xss();
		sanitize(username).escape();
		sanitize(permission).xss();
		sanitize(permission).escape();
		
		hasPermission(wallId, req.user.id, function(result){
			if(result){
				textPermission(wallId, req.user.id, function(textResult){
					if(textResult == "admin") {
						User.find({ where: { username: username }, limit: 1 }).success(function(user){
							if(user){
								WallUser.create({
									userId: user.id,
									wallId: wallId,
									permission: permission
								}).success(function(walluser){
									res.json(walluser);
								}).error(function(){
									res.send(500, {"error" : "internal server error"});
								});
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						}).error(function(){
							res.send(500, {"error" : "internal server error"});
						})
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		});
	});
	
	app.get('/api/post/:id', function(req, res){
		Post.find({ where: { id: req.params.id }, include: [Vote, Tag]}).success(function(post){
			if(post){
				hasPermission(post.wallId, req.user.id, function(result){
					if(result) {
						res.json(post);
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			} else {
				res.send(500, {"error" : "internal server error"});
			}
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.get('/api/colname/:id', function(req, res){
		ColName.find(req.param.id).success(function(colname){
			if(colname) {
				hasPermission(colname.wallId, req.user.id, function(result){
					if(result){
						res.json(colname);
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.get('/api/vote/:id', function(req, res){
		Vote.find(req.param.id).success(function(vote){
			if(vote) {
				Post.find(vote.postId).success(function(post){
					if(post){
						hasPermission(post.wallId, req.user.id, function(result){
							if(result) {
								res.json(vote);
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				}).error(function(){
					res.send(500, {"error" : "internal server error"});
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.get('/api/tag/:id', function(req, res){
		Tag.find(req.param.id).success(function(tag){
			if(tag) {
				Post.find(tag.postId).success(function(post){
					if(post){
						hasPermission(post.wallId, req.user.id, function(result){
							if(result) {
								res.json(tag);
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				}).error(function(){
					res.send(500, {"error" : "internal server error"});
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.get('/api/walluser/:id', function(req, res){
		WallUser.find(req.param.id).success(function(walluser){
			if(walluser) {
				hasPermission(walluser.wallId, req.user.id, function(result){
					if(result){
						res.json(walluser);
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.post('/api/wall', function(req, res){
		if(req.user.role == 'view'){
			res.send(401, {"error" : "unauthorized"});
		} else {
			var title = req.body.title
			  , isPrivate = req.body.isPrivate;
			
			var wallId = shortId.generate(12);
			
			sanitize(title).xss();
			sanitize(title).escape();
			sanitize(isPrivate).xss();
			sanitize(isPrivate).escape();
			
			Wall.create({ id: wallId, title: title, owner: req.user.id, isPrivate: isPrivate }).success(function(wall){
				res.json(wall);
			}).error(function(){
				res.send(500, {"error" : "internal server error"});
			});
		}
	});
	
	app.put('/api/wall/:id', function(req, res){
		var title = req.body.title
		  , isPrivate = req.body.isPrivate;
		
		sanitize(title).xss();
		sanitize(title).escape();
		sanitize(isPrivate).xss();
		sanitize(isPrivate).escape();
		
		hasPermission(req.params.id, req.user.id, function(result){
			if(result){
				Wall.find({ where: { id: req.params.id }, limit: 1}).success(function(wall){
					if(wall) {
						textPermission(req.params.id, req.user.id, function(textResult){
							if(textResult == "admin") {
								wall.updateAttributes({
									title: title,
									isPrivate: isPrivate
								}).success(function(wall){
									res.json(wall);
								}).error(function(){
									res.send(500, {"error" : "internal server error"});
								});
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				}).error(function(){
					res.send(500, {"error" : "internal server error"});
				})
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		});
	});
	
	app.delete('/api/wall/:id', function(req, res){
		hasPermission(req.params.id, req.user.id, function(result){
			if(result){
				Wall.find({ where: { id: req.params.id }, limit: 1}).success(function(wall){
					if(wall){
						textPermission(req.params.id, req.user.id, function(textResult){
							if(textResult == "admin") {
								wall.destroy().success(function(){
									res.send(200, {"data" : "success"});
								}).error(function(){
									res.send(500, {"error" : "internal server error"});
								});
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				}).error(function(){
					res.send(500, {"error" : "internal server error"});
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		});
	});
	
	app.post('/api/post', function(req, res){
		var col = req.body.col
		  , row = req.body.row
		  , wallId = req.body.wallId
		  , username = req.user.username
		  , text = req.body.text
		  , colour = req.body.colour
		  , fontSize = req.body.fontSize;
		
		sanitize(col).xss();
		sanitize(col).escape();
		sanitize(row).xss();
		sanitize(row).escape();
		sanitize(wallId).xss();
		sanitize(wallId).escape();
		sanitize(username).xss();
		sanitize(username).escape();
		sanitize(text).xss();
		sanitize(text).escape();
		sanitize(colour).xss();
		sanitize(colour).escape();
		sanitize(fontSize).xss();
		sanitize(fontSize).escape();
		
		console.log(wallId);
		
		hasPermission(wallId, req.user.id, function(result){
			if(result) {
				textPermission(wallId, req.user.id, function(textResult){
					if(textResult != "view"){
						Post.create({
							col: col,
							row: row,
							wallId: wallId,
							username: username,
							text: text,
							colour: colour,
							fontSize: fontSize
						}).success(function(post){
							res.json(post);
						}).error(function(){
							res.send(500, {"error" : "internal server error"});
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		});
	});
	
	app.put('/api/post/:id', function(req, res){
		var col = req.body.col
		  , row = req.body.row
		  , text = req.body.text
		  , colour = req.body.colour
		  , fontSize = req.body.fontSize;
		
		sanitize(col).xss();
		sanitize(col).escape();
		sanitize(row).xss();
		sanitize(row).escape();
		sanitize(text).xss();
		sanitize(text).escape();
		sanitize(colour).xss();
		sanitize(colour).escape();
		sanitize(fontSize).xss();
		sanitize(fontSize).escape();
		
		Post.find({ where: { id: req.params.id }, limit: 1}).success(function(post){
			hasPermission(post.wallId, req.user.id, function(result){
				if(result) {
					textPermission(post.wallId, req.user.id, function(textResult){
						if(textResult != "view"){
							post.updateAttributes({
								col: col,
								row: row,
								text: text,
								colour: colour,
								fontSize: fontSize
							}).success(function(post){
								res.json(post);
							}).error(function(){
								res.send(500, {"error" : "internal server error"});
							});
						} else {
							res.send(401, {"error" : "unauthorized"});
						}
					});
				} else {
					res.send(401, {"error" : "unauthorized"});
				}
			});
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.delete('/api/post/:id', function(req, res){
		Post.find({ where: { id: req.params.id }, limit: 1}).success(function(post){
			hasPermission(post.wallId, req.user.id, function(result){
				if(result) {
					textPermission(post.wallId, req.user.id, function(textResult){
						if(textResult != "view"){
							post.destroy().success(function(){
								res.send(200, {"data" : "success"});
							}).error(function(){
								res.send(500, {"error" : "internal server error"});
							});
						} else {
							res.send(401, {"error" : "unauthorized"});
						}
					});
				} else {
					res.send(401, {"error" : "unauthorized"});
				}
			});
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.post('/api/colname', function(req, res){
		var wallId = req.body.wallId
		  , colNum = req.body.colNum
		  , title = req.body.title;
		
		sanitize(wallId).xss();
		sanitize(wallId).escape();
		sanitize(colNum).xss();
		sanitize(colNum).escape();
		sanitize(title).xss();
		sanitize(title).escape();
		
		hasPermission(wallId, req.user.id, function(result){
			if(result) {
				textPermission(wallId, req.user.id, function(textResult){
					if(textResult != "view"){
						ColName.create({
							wallId: wallId,
							colNum: colNum,
							title: title
						}).success(function(colname){
							res.json(colname);
						}).error(function(){
							res.send(500, {"error" : "internal server error"});
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		});
	});
	
	app.put('/api/colname/:id', function(req, res){
		var colNum = req.body.colNum
		  , title = req.body.title;
		
		sanitize(colNum).xss();
		sanitize(colNum).escape();
		sanitize(title).xss();
		sanitize(title).escape();
		
		ColName.find({ where: { id: req.params.id }, limit: 1}).success(function(colName){
			hasPermission(colName.wallId, req.user.id, function(result){
				if(result) {
					textPermission(colName.wallId, req.user.id, function(textResult){
						if(textResult != "view"){
							colName.updateAttributes({
								colNum: colNum,
								title: title
							}).success(function(colName){
								res.json(colName);
							}).error(function(){
								res.send(500, {"error" : "internal server error"});
							});
						} else {
							res.send(401, {"error" : "unauthorized"});
						}
					});
				} else {
					res.send(401, {"error" : "unauthorized"});
				}
			});
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.delete('/api/colname/:id', function(req, res){
		ColName.find({ where: { id: req.params.id }, limit: 1}).success(function(colName){
			hasPermission(colName.wallId, req.user.id, function(result){
				if(result) {
					textPermission(colName.wallId, req.user.id, function(textResult){
						if(textResult != "view"){
							colName.destroy().success(function(){
								res.send(200, {"data" : "success"});
							}).error(function(){
								res.send(500, {"error" : "internal server error"});
							});
						} else {
							res.send(401, {"error" : "unauthorized"});
						}
					});
				} else {
					res.send(401, {"error" : "unauthorized"});
				}
			});
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.post('/api/vote', function(req, res){
		var postId = req.body.postId;
		
		sanitize(postId).xss();
		sanitize(postId).escape();

		Post.find({ where: { id: postId }, limit: 1}).success(function(post){
			hasPermission(post.wallId, req.user.id, function(result){
				if(result) {
					textPermission(post.wallId, req.user.id, function(textResult){
						if(textResult != "view"){
							Vote.create({
								postId: postId,
								userId: req.user.id
							}).success(function(vote){
								res.json(vote);
							}).error(function(){
								res.send(500, {"error" : "internal server error"});
							});
						} else {
							res.send(401, {"error" : "unauthorized"});
						}
					});
				} else {
					res.send(401, {"error" : "unauthorized"});
				}
			});
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
		
	});
		
	app.delete('/api/vote/:id', function(req, res){
		Vote.find({ where: { id: req.params.id }, limit: 1 }).success(function(vote){
			Post.find({ where: { id: vote.postId }, limit: 1 }).success(function(post){
				hasPermission(post.wallId, req.user.id, function(result){
					if(result) {
						textPermission(post.wallId, req.user.id, function(textResult){
							if(textResult != "view"){
								vote.destroy().success(function(){
									res.send(200, {"data" : "success"});
								}).error(function(){
									res.send(500, {"error" : "internal server error"});
								});
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			}).error(function(){
				res.send(500, {"error" : "internal server error"});
			});
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.post('/api/tag', function(req, res){
		var postId = req.body.postId
		  , text = req.body.text;
		
		sanitize(postId).xss();
		sanitize(postId).escape();
		sanitize(text).xss();
		sanitize(text).escape();
		Post.find({ where: { id: postId }, limit: 1}).success(function(post){
			if(post) {
				hasPermission(post.wallId, req.user.id, function(result){
					if(result) {
						textPermission(post.wallId, req.user.id, function(textResult){
							if(textResult != "view"){
								Tag.create({
									postId: postId,
									text: text
								}).success(function(tag){
									res.json(tag);
								}).error(function(){
									res.send(500, {"error" : "internal server error"});
								});
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.put('/api/tag/:id', function(req, res){
		var title = req.body.title;
		
		sanitize(title).xss();
		sanitize(title).escape();
		
		Tag.find({ where: { id: req.params.id }, limit: 1}).success(function(tag){
			Post.find({ where: { id: tag.postId }, limit: 1}).success(function(post){
				hasPermission(post.wallId, req.user.id, function(result){
					if(result){
						textPermission(post.wallId, req.user.id, function(textResult){
							if(textResult != "view"){
								tag.updateAttributes({
									text: text
								}).success(function(tag){
									res.json(tag);
								}).error(function(){
									res.send(500, {"error" : "internal server error"});
								});
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			}).error(function(){
				res.send(500, {"error" : "internal server error"});
			});
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.delete('/api/tag/:id', function(req, res){
		Tag.find({ where: { id: req.params.id }, limit: 1}).success(function(tag){
			Post.find({ where: { id: tag.postId }, limit: 1}).success(function(post){
				hasPermission(post.wallId, req.user.id, function(result){
					if(result){
						textPermission(post.wallId, req.user.id, function(textResult){
							if(textResult != "view"){
								tag.destroy().success(function(){
									res.send(200, {"data" : "success"});
								}).error(function(){
									res.send(500, {"error" : "internal server error"});
								});
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			}).error(function(){
				res.send(500, {"error" : "internal server error"});
			});
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.post('/api/walluser', function(req, res){
		var userId = req.body.userId
		  , wallId = req.body.wallId
		  , permission = req.body.permission;
		
		sanitize(userId).xss();
		sanitize(userId).escape();
		sanitize(wallId).xss();
		sanitize(wallId).escape();
		sanitize(permission).xss();
		sanitize(permission).escape();
		
		hasPermission(wallId, req.user.id, function(result){
			if(result) {
				textPermission(wallId, req.user.id, function(textResult){
					if(textResult != "view"){
						WallUser.create({
							userId: userId,
							wallId: wallId,
							permission: permission
						}).success(function(colname){
							res.json(colname);
						}).error(function(){
							res.send(500, {"error" : "internal server error"});
						});
					} else {
						res.send(401, {"error" : "unauthorized"});
					}
				});
			} else {
				res.send(401, {"error" : "unauthorized"});
			}
		});
	});
	
	app.put('/api/walluser/:id', function(req, res){
		var permission = req.body.permission
		
		sanitize(permission).xss();
		sanitize(permission).escape();
		
		WallUser.find({ where: { id: req.params.id }, limit: 1}).success(function(wallUser){
			hasPermission(wallUser.wallId, req.user.id, function(result){
				if(result) {
					textPermission(wallUser.wallId, req.user.id, function(textResult){
						if(textResult != "view"){
							wallUser.updateAttributes({
								permission: permission
							}).success(function(wallUser){
								res.json(wallUser);
							}).error(function(){
								res.send(500, {"error" : "internal server error"});
							});
						} else {
							res.send(401, {"error" : "unauthorized"});
						}
					});
				} else {
					res.send(401, {"error" : "unauthorized"});
				}
			});
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.delete('/api/walluser/:id', function(req, res){
		WallUser.find({ where: { id: req.params.id }, limit: 1}).success(function(wallUser){
			hasPermission(wallUser.wallId, req.user.id, function(result){
				if(result) {
					textPermission(wallUser.wallId, req.user.id, function(textResult){
						if(textResult != "view"){
							wallUser.destroy().success(function(){
								res.send(200, {"data" : "success"});
							}).error(function(){
								res.send(500, {"error" : "internal server error"});
							});
						} else {
							res.send(401, {"error" : "unauthorized"});
						}
					});
				} else {
					res.send(401, {"error" : "unauthorized"});
				}
			});
		}).error(function(){
			res.send(500, {"error" : "internal server error"});
		});
	});
};