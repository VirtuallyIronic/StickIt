
/**
 * StickIt by Virtually Ironic
 * Filename:		routes/auth.js
 * Date Last Mod:	4/9/13
 * Purpose:			User authentication routes.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */


// route version numbers
var MODULE_NAME = 'AUTH'
  , MODULE_MAJOR_VERSION = '0'
  , MODULE_MINOR_VERSION = '11'
  , MODULE_PATCH_VERSION = '9'
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

var models = require('../models');
var User = models.User;
var validator = new Validator();

module.exports = function(app, passport) {
	
	validator.error = function (err_msg) {
		return false;
	}
	
	function findById(id, fn) {
		User.find(id).success(function(user){
			return fn(null, user);
		}).error(function(error){
			return fn(error, null);
		});
	}

	function findByUsername(username, fn) {
		User.find({ where: {username: username} }).success(function(user){
			fn(null, user);
		}).error(function(error){
			fn(error, null);
		});
	}

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
						console.log('Invalid password ' + password)
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
	
	function currentUser(req, res) {
		if(!req.user) {
			res.send({'error': 'not logged in'}, 401);
		}
		else {
			res.json(req.user);
		}
	}
	
	function createUser(username, emailAddr, password, done) {
		var uid = shortId.generate(8);
		var passwordHash = bcrypt.hashSync(password, 12);
		User.create({id: uid, username: username, password: passwordHash, email: emailAddr}).success(function(user){
			return done(null, user);
		}).error(function(error){
			return done(error, null);
		});
	}
	
	app.post('/auth/login', passport.authenticate('local'), function(req, res){
		res.json(req.user);
	});
	
	app.get('/auth/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
	
	app.post('/auth/register', function(req, res){
		var username = req.body.username
		  , emailAddr = req.body.emailAddr
		  , password = req.body.password
		  , passwordConfirm = req.body.passwordConfirm;
		
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
	
	app.get('/auth/current', currentUser);
};
