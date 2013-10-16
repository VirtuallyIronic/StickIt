/**
 * StickIt by Virtually Ironic
 * Filename:		routes/auth.js
 * Purpose:			User authentication routes.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */


// route version numbers
var MODULE_NAME = 'AUTH'
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

// route modules
var LocalStrategy = require('passport-local').Strategy
  , bcrypt = require('bcrypt')
  , shortId = require('shortid')
  , sanitize = require('validator').sanitize
  , Validator = require('validator').Validator
  , dbConfig = require('config').db;

// model modules
var models = require('../models');
var User = models.User;

// validator
var validator = new Validator();

module.exports = function(app, passport) {
	
	// overload validator error to just return a false on error
	validator.error = function (err_msg) {
		return false;
	}
	
	/**
	 * finds user by ID
	 * returns async callback function(error, user)
	 * returns either an error with null user
	 * or null error and user object
	 */
	function findById(id, fn) {
		User.find(id).success(function(user){
			return fn(null, user);
		}).error(function(error){
			return fn(error, null);
		});
	}

	/**
	 * finds user by Username
	 * returns async callback function(error, user)
	 * returns either an error with null user
	 * or null error and user object
	 */
	function findByUsername(username, fn) {
		User.find({ where: {username: username} }).success(function(user){
			fn(null, user);
		}).error(function(error){
			fn(error, null);
		});
	}

	/**
	 * finds user by email
	 * returns async callback function(error, user)
	 * returns either an error with null user
	 * or null error and user object
	 */
	function findByEmail(email, fn) {
		User.find({ where: {email: email} }).success(function(user){
			fn(null, user);
		}).error(function(error){
			fn(error, null);
		});
	}
	
	// passport session setup
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	// more passport sessionals
	passport.deserializeUser(function(id, done){
		findById(id, function(err, user){
			if(err) {
				return done(err, null);
			}
			return done(null, user);
		});
	});

	// passport local strategy setup
	passport.use(new LocalStrategy(
		function(username, password, done){
			sanitize(username).xss();
			sanitize(username).escape();
			if(validator.check(username).isEmail()){
				findByEmail(username, function(err, user){
					if(err) {
						console.log('error');
						console.log(err);
						return done(err);
					}
					if(!user) {
						console.log('Unknown user ' + username);
						return done(null, false, { message: 'Unknown user ' + username });
					}
					if(!bcrypt.compareSync(password, user.password)) {
						return done(null, false, { message: 'Invalid password' });
					}
					console.log(user);
					return done(null, user);
				});
			}
			else {
				findByUsername(username, function(err, user){
					if(err) {
						console.log('error');
						console.log(err);
						return done(err);
					}
					if(!user) {
						console.log('Unknown user ' + username);
						return done(null, false, { message: 'Unknown user ' + username });
					}
					if(!bcrypt.compareSync(password, user.password)) {
						console.log('Invalid password ' + password)
						return done(null, false, { message: 'Invalid password' });
					}
					return done(null, user);
				});
			}
		}
	));

	// authentication checker
	function checkAuthentication(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		res.redirect('/#/login');
	}
	
	// returns json object of the current logged in user or an error
	function currentUser(req, res) {
		if(!req.user) {
			res.send({'error': 'not logged in'}, 401);
		}
		else {
			res.json(req.user);
		}
	}
	
	// creates a user, requires a username, email and password.
	// returns a callback function(error, user)
	function createUser(username, emailAddr, password, done) {
		var uid = shortId.generate(8);
		var passwordHash = bcrypt.hashSync(password, 12);
		User.create({id: uid, username: username, password: passwordHash, email: emailAddr}).success(function(user){
			return done(null, user);
		}).error(function(error){
			return done(error, null);
		});
	}
	
	// login route
	app.post('/auth/login', passport.authenticate('local'), function(req, res){
		res.json(req.user);
	});
	
	// logout route
	// redirects to '/' route
	app.get('/auth/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
	
	// registration route
	app.post('/auth/register', function(req, res){
		// accept values from form
		var username = req.body.username
		  , emailAddr = req.body.emailAddr
		  , password = req.body.password
		  , passwordConfirm = req.body.passwordConfirm;
		
		// sanitize and escape
		sanitize(username).xss();
		sanitize(username).escape();
		sanitize(emailAddr).xss();
		sanitize(emailAddr).escape();
		sanitize(password).xss();
		sanitize(password).escape();
		sanitize(passwordConfirm).xss();
		sanitize(passwordConfirm).escape();
		
		if(password == passwordConfirm){
			if(validator.check(emailAddr).isEmail()){
				createUser(username, emailAddr,password, function(error, user){
					if(error){
						res.send(401);
					}
					else {
						res.json(user);
					}
				});
			} else {
				res.send(401);
			}
		}
		else {
			res.send(401);
		}
	});
	
	// current user route
	app.get('/auth/current', currentUser);
	
	// user list route, returns all users if you are an administrator
	app.get('/api/users', function(req, res){
		// check if there is a current user
		if(req.user){
			// find that user in db
			User.find({ where: { id: req.user.id }, limit: 1}).success(function(user){
				if(user.role == "admin") {
					// if the user is an admin
					User.findAll().success(function(users){
						// return all users
						if(users){
							res.json({
								user: users
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
			})
		} else {
			res.send(401, {"error" : "unauthorized"});
		}
	});
	
	// makes the user a viewer
	app.put('/api/user/view/:id', function(req, res){
		// check if logged in
		if(req.user){
			// find current user
			User.find({ where: { id: req.user.id }, limit: 1}).success(function(currentUser){
				// check for current users role
				if(currentUser.role == "admin") {
					// find specific user
					User.find({ where: { id: req.params.id }, limit: 1 }).success(function(user){
						// update to viewer
						user.updateAttributes({
							role: "view"
						}).success(function(user){
							// reutrn user if successful
							if(user){
								res.json(user);
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						}).error(function(){
							// error as cannot update user
							res.send(500, {"error" : "internal server error"});
						});
					}).error(function(){
						// error as connot find user
						res.send(500, {"error" : "internal server error"});
					});
				} else {
					// error you are not an admin
					res.send(401, {"error" : "unauthorized"});
				}
			}).error(function(){
				// error current user doesn't exist
				res.send(500, {"error" : "internal server error"});
			})
		} else {
			// error you are not logged in
			res.send(401, {"error" : "unauthorized"});
		}	
	});
	
	// updates the user to be a poster
	app.put('/api/user/post/:id', function(req, res){
		// check if logged in
		if(req.user){
			// find current user
			User.find({ where: { id: req.user.id }, limit: 1}).success(function(currentUser){
				// check for current users role
				if(currentUser.role == "admin") {
					// find specific user
					User.find({ where: { id: req.params.id }, limit: 1 }).success(function(user){
						// update to poster
						user.updateAttributes({
							role: "post"
						}).success(function(user){
							// reutrn user if successful
							if(user){
								res.json(user);
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						}).error(function(){
							// error as cannot update user
							res.send(500, {"error" : "internal server error"});
						});
					}).error(function(){
						// error as cannot find user
						res.send(500, {"error" : "internal server error"});
					});
				} else {
					// error you are not an admin
					res.send(401, {"error" : "unauthorized"});
				}
			}).error(function(){
				// error current user doesn't exist
				res.send(500, {"error" : "internal server error"});
			})
		} else {
			// error you are not logged in
			res.send(401, {"error" : "unauthorized"});
		}	
	});
	
	// makes a user an admin
	app.put('/api/user/admin/:id', function(req, res){
		// check if logged in
		if(req.user){
			// find current user
			User.find({ where: { id: req.user.id }, limit: 1}).success(function(currentUser){
				// check for current users role
				if(currentUser.role == "admin") {
					// find specific user
					User.find({ where: { id: req.params.id }, limit: 1 }).success(function(user){
						// update to admin
						user.updateAttributes({
							role: "admin"
						}).success(function(user){
							// reutrn user if successful
							if(user){
								res.json(user);
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						}).error(function(){
							// error as cannot update user
							res.send(500, {"error" : "internal server error"});
						});
					}).error(function(){
						// error as cannot find user
						res.send(500, {"error" : "internal server error"});
					});
				} else {
					// error you are not an admin
					res.send(401, {"error" : "unauthorized"});
				}
			}).error(function(){
				// error current user doesn't exist
				res.send(500, {"error" : "internal server error"});
			})
		} else {
			// error you are not logged in
			res.send(401, {"error" : "unauthorized"});
		}
	});
	
	// deletes a user
	app.delete('/api/user/:id', function(req, res){
		// check if logged in
		if(req.user){
			// find current user
			User.find({ where: { id: req.user.id }, limit: 1}).success(function(currentUser){
				// check for current users role
				if(currentUser.role == "admin") {
					// finds specific user
					User.find({ where: { id: req.params.id }, limit: 1 }).success(function(user){
						// destroys that object, database deletes for
						user.destroy().success(function(user){
							if(user){
								res.json(200, {"data" : "success"});
							} else {
								res.send(401, {"error" : "unauthorized"});
							}
						}).error(function(){
							res.send(500, {"error" : "internal server error"});
						});
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
};
