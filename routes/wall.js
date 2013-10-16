
/**
 * StickIt by Virtually Ironic
 * Filename:		routes/wall.js
 * Purpose:			Wall and related functions routes.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */


// route version numbers
var MODULE_NAME = 'WALL'
  , MODULE_MAJOR_VERSION = '1'
  , MODULE_MINOR_VERSION = '0'
  , MODULE_PATCH_VERSION = '0'
  , MODULE_VERSION_APPEND = null;

// print route version for debugging and logging 
if(!MODULE_VERSION_APPEND) {
	console.log('API ' + MODULE_NAME + ' (' + MODULE_MAJOR_VERSION + '.' + MODULE_MINOR_VERSION + '.' + MODULE_PATCH_VERSION + ')');
} else {
	console.log('API ' + MODULE_NAME + ' (' + MODULE_MAJOR_VERSION + '.' + MODULE_MINOR_VERSION + '.' + MODULE_PATCH_VERSION + MODULE_VERSION_APPEND + ')');
}

// import all models and required node modules
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

// import validator
var validator = new Validator();

module.exports = function(app, passport) {
	// overload validator to return false on failure
	validator.error = function (err_msg) {
		return false;
	}
	
	// checks if a user can view the wall
	// checks the wall of id, id against user of id, userId
	// returns callback function of true or false
	function hasPermission(id, userId, fn) {
		// find wall
		Wall.find({ where: { id: id }, limit: 1 }).success(function(wall){
			// if there is a wall
			if(wall) {
				// public walls always visable
				if(wall.isPrivate == 0){
					fn(true);
				// wall owners can always view
				} else if(wall.owner == userId){
					fn(true);
				// users with wall permissions can view
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
	
	// checks if a user can view the wall
	// checks the wall of id, id against user of id, userId
	// returns callback function of 'view', 'post', 'admin', 'false'
	function textPermission(id, userId, fn) {
		// find wall
		Wall.find({ where: { id: id }, limit: 1 }).success(function(wall){
			// wall exists
			if(wall) {
				// owner is admin
				if(wall.owner == userId){
					fn('admin');
				} else {
					// has permission via WallUser table?
					WallUser.find({ where: { wallId: id, userId: userId }, limit: 1 }).success(function(wallUser){
						if(wallUser) {
							fn(wallUser.permission);
						// fail if not given permission and private
						} else if(wall.isPrivate == 1) {
							fn(false);
						// return view if not permission but public wall
						} else {
							fn('view');
						}
					}).error(function(){
						// error finding wall user 
						if(wall.isPrivate){
							fn(false);
						// public walls can be viewed by all
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
		// raw query to find walls where...
		// user is either an owner
		// walls are public
		// user exists in walluser table for wall
		models.sequelize.query('SELECT * FROM `Wall` WHERE `Wall`.`owner`=\'' + req.user.id + '\' OR `Wall`.`isPrivate`=\'0\' OR `Wall`.`id` IN (SELECT `WallUser`.`WallId` FROM `WallUser` WHERE `WallUser`.`UserId`=\'' + req.user.id + '\')', Wall).success(function(walls){
			// finds current user
			User.find({ where: { id : req.user.id}, limit: 1}).success(function(user){
				// wall permissions
				var admin = false
				  , post = false
				  , view = false;
				
				// user is admin
				if(user.role == "admin") {
					admin = true;
					post = true;
					view = true;
				// user is poster
				} else if (user.role == "post") {
					post = true;
					view = true;
				// user is viewer
				} else {
					view = true;
				}
				
				// return json for global permissions and walls
				res.json({
					admin: admin,
					post: post,
					view: view,
					wall: walls
				});
			}).error(function(){
				// error finding user
				res.send(500, {"error" : "internal server error"});
			});
		}).error(function(error){
			// error finding walls
			res.send(500, {"error" : "internal server error"});
		});
	});
	
	app.get('/api/wall/:id', function(req, res){
		// checks for permissions
		hasPermission(req.params.id, req.user.id, function(result){
			// has permission
			if(result){
				// find wall
				Wall.find({ where: { id: req.params.id }, limit: 1}).success(function(wall){
					// wall exists
					if(wall) {
						// find view, post or admin
						textPermission(req.params.id, req.user.id, function(textResult){
							// find all posts
							Post.findAll({ where: { wallId: req.params.id }, include: [Vote, Tag]}).success(function(posts){
								// find all colnames
								ColName.findAndCountAll({ where: { wallId: req.params.id}}).success(function(colnames){
									// return json object of wall with posts and columns
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
	
	// checks all users who can view a wall via wall users table
	app.get('/api/wallpermissions/:id', function(req, res){
		// check current user can view wall
		hasPermission(req.params.id, req.user.id, function(result){
			// if has permission
			if(result){
				// check user is admin
				textPermission(req.params.id, req.user.id, function(textResult){
					if(textResult == "admin") {
						// find all users in walluser table for specific wall, reutrn as json objects
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
	
	// add user user to wall
	app.post('/api/wallpermissions', function(req, res){
		// request wall id, username of user, permission required
		var wallId = req.body.wallId
		  , username = req.body.username
		  , permission = req.body.permission;
		
		// sanitize and escape values
		sanitize(wallId).xss();
		sanitize(wallId).escape();
		sanitize(username).xss();
		sanitize(username).escape();
		sanitize(permission).xss();
		sanitize(permission).escape();
		
		// check current user has permission to see wall
		hasPermission(wallId, req.user.id, function(result){
			if(result){
				// check current user is an admin
				textPermission(wallId, req.user.id, function(textResult){
					if(textResult == "admin") {
						// find user based on username
						User.find({ where: { username: username }, limit: 1 }).success(function(user){
							// if user exists
							if(user){
								// add entry to WallUser table
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
	
	// find specific post
	app.get('/api/post/:id', function(req, res){
		Post.find({ where: { id: req.params.id }, include: [Vote, Tag]}).success(function(post){
			if(post){
				// check the user has permission to view wall
				hasPermission(post.wallId, req.user.id, function(result){
					if(result) {
						// has permission on wall and post exists
						// return post as json object
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
	
	// find specific column
	app.get('/api/colname/:id', function(req, res){
		ColName.find(req.param.id).success(function(colname){
			if(colname) {
				// check user has permission to view wall
				hasPermission(colname.wallId, req.user.id, function(result){
					if(result){
						// has permission on wall and column exists
						// return column as json object
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
	
	// find specific vote
	app.get('/api/vote/:id', function(req, res){
		Vote.find(req.param.id).success(function(vote){
			if(vote) {
				Post.find(vote.postId).success(function(post){
					if(post){
						// check user has permission to view wall
						hasPermission(post.wallId, req.user.id, function(result){
							if(result) {
								// has permission on wall and vote exists
								// return vote as json object
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
	
	// find specific tag
	app.get('/api/tag/:id', function(req, res){
		Tag.find(req.param.id).success(function(tag){
			if(tag) {
				// find associated post
				Post.find(tag.postId).success(function(post){
					if(post){
						// check user can see the wall
						hasPermission(post.wallId, req.user.id, function(result){
							if(result) {
								// has permission on wall and tag exists
								// return tag as json object
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
	
	// returns a specific walluser entry
	app.get('/api/walluser/:id', function(req, res){
		WallUser.find(req.param.id).success(function(walluser){
			if(walluser) {
				// checks user can view current wall
				hasPermission(walluser.wallId, req.user.id, function(result){
					// has permission on wall and entry exists
					// return entry as json object
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
	
	// create new wall route
	app.post('/api/wall', function(req, res){
		// viewers cannot make walls
		if(req.user.role == 'view'){
			res.send(401, {"error" : "unauthorized"});
		} else {
			// require viewer and privacy option
			var title = req.body.title
			  , isPrivate = req.body.isPrivate;
			
			// make wall id
			var wallId = shortId.generate(12);
			
			// sanitize and escape submitted values
			sanitize(title).xss();
			sanitize(title).escape();
			sanitize(isPrivate).xss();
			sanitize(isPrivate).escape();
			
			// create wall, if successful return wall as json object
			Wall.create({ id: wallId, title: title, owner: req.user.id, isPrivate: isPrivate }).success(function(wall){
				res.json(wall);
			}).error(function(){
				res.send(500, {"error" : "internal server error"});
			});
		}
	});
	
	// update a wall of specific id
	app.put('/api/wall/:id', function(req, res){
		// require wall title and privacy option
		var title = req.body.title
		  , isPrivate = req.body.isPrivate;
		
		// sanitize and escape submitted values
		sanitize(title).xss();
		sanitize(title).escape();
		sanitize(isPrivate).xss();
		sanitize(isPrivate).escape();
		
		// check the user access wall
		hasPermission(req.params.id, req.user.id, function(result){
			if(result){
				// find the wall as object
				Wall.find({ where: { id: req.params.id }, limit: 1}).success(function(wall){
					if(wall) {
						// heck the user has permissions
						textPermission(req.params.id, req.user.id, function(textResult){
							// if is an admin allow update
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
	
	// remove specific wall
	app.delete('/api/wall/:id', function(req, res){
		// check the user has permission to access wall
		hasPermission(req.params.id, req.user.id, function(result){
			if(result){
				// find wall
				Wall.find({ where: { id: req.params.id }, limit: 1}).success(function(wall){
					if(wall){
						// check the user is an admin
						textPermission(req.params.id, req.user.id, function(textResult){
							if(textResult == "admin") {
								// if admin, destroy the wall
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
	
	// make a new post
	app.post('/api/post', function(req, res){
		// required values
		var col = req.body.col
		  , row = req.body.row
		  , wallId = req.body.wallId
		  , username = req.user.username
		  , text = req.body.text
		  , colour = req.body.colour
		  , fontSize = req.body.fontSize
<<<<<<< HEAD
		  , stringtag = req.body.stringtag;
=======
		  , tags = req.body.tags;
>>>>>>> 01b6ce1d32e6f0112c13bc1394b484d1962823cc
		
		// sanitise and escape
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
<<<<<<< HEAD
		sanitize(stringtag).xss();
		sanitize(stringtag).escape();
=======
		sanitize(tags).xss();
		sanitize(tags).escape();
>>>>>>> 01b6ce1d32e6f0112c13bc1394b484d1962823cc
		
		// check user has permission
		hasPermission(wallId, req.user.id, function(result){
			if(result) {
				// user has permission check for permission type
				textPermission(wallId, req.user.id, function(textResult){
					// if not a viewer
					if(textResult != "view"){
						// create post object
						Post.create({
							col: col,
							row: row,
							wallId: wallId,
							username: username,
							text: text,
							colour: colour,
							fontSize: fontSize,
<<<<<<< HEAD
							stringtag: stringtag
=======
							tags: tags
>>>>>>> 01b6ce1d32e6f0112c13bc1394b484d1962823cc
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
	
	// updates a specific post
	app.put('/api/post/:id', function(req, res){
		// required values
		var col = req.body.col
		  , row = req.body.row
		  , text = req.body.text
		  , colour = req.body.colour
		  , fontSize = req.body.fontSize
<<<<<<< HEAD
		  , stringtag = req.body.stringtag;
=======
		  , tags = req.body.tags;
>>>>>>> 01b6ce1d32e6f0112c13bc1394b484d1962823cc
		
		// sanitize and escape
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
<<<<<<< HEAD
		sanitize(stringtag).xss();
		sanitize(stringtag).escape();
=======
		sanitize(tags).xss();
		sanitize(tags).escape();
>>>>>>> 01b6ce1d32e6f0112c13bc1394b484d1962823cc
		
		// find post object
		Post.find({ where: { id: req.params.id }, limit: 1}).success(function(post){
			// check user can view wall
			hasPermission(post.wallId, req.user.id, function(result){
				if(result) {
					// check the users permission if they can view wall
					textPermission(post.wallId, req.user.id, function(textResult){
						// is the user is not a viewer
						if(textResult != "view"){
							// update post
							post.updateAttributes({
								col: col,
								row: row,
								text: text,
								colour: colour,
								fontSize: fontSize,
<<<<<<< HEAD
								stringtag: stringtag
=======
								tags: tags
>>>>>>> 01b6ce1d32e6f0112c13bc1394b484d1962823cc
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
	
	// deletes a specific post
	app.delete('/api/post/:id', function(req, res){
		// find post object
		Post.find({ where: { id: req.params.id }, limit: 1}).success(function(post){
			// check user can view wall
			hasPermission(post.wallId, req.user.id, function(result){
				if(result) {
					// if the user can view wall, check their permission type
					textPermission(post.wallId, req.user.id, function(textResult){
						if(textResult != "view"){
							// if the user is not a viewer, destroy the post
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
	
	// add a new column
	app.post('/api/colname', function(req, res){
		// required values
		var wallId = req.body.wallId
		  , colNum = req.body.colNum
		  , title = req.body.title;
		
		// sanitize and escape values
		sanitize(wallId).xss();
		sanitize(wallId).escape();
		sanitize(colNum).xss();
		sanitize(colNum).escape();
		sanitize(title).xss();
		sanitize(title).escape();
		
		// check user can view accociated wall
		hasPermission(wallId, req.user.id, function(result){
			if(result) {
				textPermission(wallId, req.user.id, function(textResult){
					// if the user is not a view on wall
					if(textResult != "view"){
						// create new wall and return json object
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
	
	// updates a specific column
	app.put('/api/colname/:id', function(req, res){
		//required values
		var colNum = req.body.colNum
		  , title = req.body.title;
		
		// santize and escape values
		sanitize(colNum).xss();
		sanitize(colNum).escape();
		sanitize(title).xss();
		sanitize(title).escape();
		
		// find column object
		ColName.find({ where: { id: req.params.id }, limit: 1}).success(function(colName){
			// check user can view wall
			hasPermission(colName.wallId, req.user.id, function(result){
				if(result) {
					textPermission(colName.wallId, req.user.id, function(textResult){
						// user can view wall and is not just a viewer
						if(textResult != "view"){
							// update column object
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
	
	// delete a specific column
	app.delete('/api/colname/:id', function(req, res){
		// find column object
		ColName.find({ where: { id: req.params.id }, limit: 1}).success(function(colName){
			// check if user has permission on the wall
			hasPermission(colName.wallId, req.user.id, function(result){
				if(result) {
					textPermission(colName.wallId, req.user.id, function(textResult){
						// if the user it not a viewer delete column
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
	
	// makes a new vote
	app.post('/api/vote', function(req, res){
		// requires the post id
		var postId = req.body.postId;
		
		// stanitise and escape
		sanitize(postId).xss();
		sanitize(postId).escape();

		// find accociated post
		Post.find({ where: { id: postId }, limit: 1}).success(function(post){
			// check wall permission
			hasPermission(post.wallId, req.user.id, function(result){
				if(result) {
					textPermission(post.wallId, req.user.id, function(textResult){
						// if not a viewer create vote and return as json object
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
	
	// remove a vote
	app.delete('/api/vote/:id', function(req, res){
		// find vote
		Vote.find({ where: { id: req.params.id }, limit: 1 }).success(function(vote){
			// find accociated post
			Post.find({ where: { id: vote.postId }, limit: 1 }).success(function(post){
				hasPermission(post.wallId, req.user.id, function(result){
					if(result) {
						textPermission(post.wallId, req.user.id, function(textResult){
							// if has permission and is not a viewer destroy vote
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
	
	// make a new tag
	app.post('/api/tag', function(req, res){
		// required data
		var postId = req.body.postId
		  , text = req.body.text;
		
		// sanitize and escape
		sanitize(postId).xss();
		sanitize(postId).escape();
		sanitize(text).xss();
		sanitize(text).escape();
		
		// find accociated post
		Post.find({ where: { id: postId }, limit: 1}).success(function(post){
			if(post) {
				hasPermission(post.wallId, req.user.id, function(result){
					if(result) {
						textPermission(post.wallId, req.user.id, function(textResult){
							// if has permission and is not a viewer
							// create tag object and return as json
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
	
	// update a tag
	app.put('/api/tag/:id', function(req, res){
		// required data
		var title = req.body.title;
		
		// sanitize and escape
		sanitize(title).xss();
		sanitize(title).escape();
		
		// find specific tag
		Tag.find({ where: { id: req.params.id }, limit: 1}).success(function(tag){
			// find accociated post
			Post.find({ where: { id: tag.postId }, limit: 1}).success(function(post){
				hasPermission(post.wallId, req.user.id, function(result){
					if(result){
						textPermission(post.wallId, req.user.id, function(textResult){
							if(textResult != "view"){
								// if has permission and is not a wall viewer
								// update tag and return as json object
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
	
	// delete a tag
	app.delete('/api/tag/:id', function(req, res){
		// find tag
		Tag.find({ where: { id: req.params.id }, limit: 1}).success(function(tag){
			// find accoociated post
			Post.find({ where: { id: tag.postId }, limit: 1}).success(function(post){
				hasPermission(post.wallId, req.user.id, function(result){
					if(result){
						textPermission(post.wallId, req.user.id, function(textResult){
							// if has permission on wall and is not a viewer
							// destroy tag object
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
	
	// add a new user to a wall
	app.post('/api/walluser', function(req, res){
		// required data
		var userId = req.body.userId
		  , wallId = req.body.wallId
		  , permission = req.body.permission;
		
		// sanitise and escape
		sanitize(userId).xss();
		sanitize(userId).escape();
		sanitize(wallId).xss();
		sanitize(wallId).escape();
		sanitize(permission).xss();
		sanitize(permission).escape();
		
		// check for wall permission
		hasPermission(wallId, req.user.id, function(result){
			if(result) {
				textPermission(wallId, req.user.id, function(textResult){
					// check is not a wall viewer only
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
	
	// update a wall user
	app.put('/api/walluser/:id', function(req, res){
		var permission = req.body.permission
		
		sanitize(permission).xss();
		sanitize(permission).escape();
		
		// find specific wall user
		WallUser.find({ where: { id: req.params.id }, limit: 1}).success(function(wallUser){
			hasPermission(wallUser.wallId, req.user.id, function(result){
				if(result) {
					textPermission(wallUser.wallId, req.user.id, function(textResult){
						// is has permission on wall and is not a viewer
						// update walluser entry and return json object
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
	
	// remove walluser object
	app.delete('/api/walluser/:id', function(req, res){
		// find specific object
		WallUser.find({ where: { id: req.params.id }, limit: 1}).success(function(wallUser){
			hasPermission(wallUser.wallId, req.user.id, function(result){
				if(result) {
					textPermission(wallUser.wallId, req.user.id, function(textResult){
						// if is not a wall viewer and has permission
						// destroy walluser object
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
	
	// clear a wall of posts
	// takes ID of wall
	app.delete('/api/clearwall/:id', function(req, res){
		hasPermission(req.params.id, req.user.id, function(result){
			if(result){
				textPermission(req.params.id, req.user.id, function(textResult){
					// if the user has permission on the wall and is an admin
					if(textResult == "admin"){
						// destroy all posts on wall
						Post.destroy({ wallId: req.params.id }).success(function(){
							res.send(200, {"data" : "success"});
						}).error(function(){
							res.send(500, {"error" : "internal server error"});
						});
						// destroy all columns on wall
						ColName.destroy({ wallId: req.params.id}).success(function(){
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
	});
};