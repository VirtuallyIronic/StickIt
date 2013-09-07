
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
  , MODULE_MINOR_VERSION = '1'
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
  , dbConfig = require('config').db;

var models = require('../models');
var User = models.User;

/*
// temporary users
var users = [
	{ id: 1, username: 'evan', password: '$2a$12$Bp0tWdg7OagSs0DzQsBz1ulPcCshYZz/UNXIhSDSR1qHak3ol7vc.', email: 'ev@test.com'}
  , { id: 2, username: 'bob', password: '$2a$12$lYbFwynvoyLTxHRzvMlYmOw3DykppDLguFlUszrXbPK0Ku.N0gReG', email: 'bob@test.com'}
  ];
*/

module.exports = function(app, passport) {
	function findById(id, fn) {
		User.find(id).success(function(user){
			return fn(null, user);
		}).error(function(error){
			return fn(err, null);
		});
	}

	function findByUsername(username, fn) {
		User.find({ where: {username: username} }).success(function(user){
			fn(null, user);
		}).error(function(error){
			console.log(error);
			fn(null, null);
		});
	}
	// end temp users

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
	));

	// authentication checker
	function checkAuthentication(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		res.redirect('/#/login');
	}
	
	/**
	app.post('/auth/login', function(req, res, next){
		passport.authenticate('local', function(err, user, info){
			if(err) {
				return next(err);
			}
			if(!user) {
				return res.send(401);
			}
			req.login(user, function(err){
				if(err) { return next(err); }
				console.log('here');
				return res.send(200);
			});
		})(req, res, next);
	});
	**/
	
	app.post('/auth/login', passport.authenticate('local'), function(req, res){
		res.json(req.user);
	});
	
	app.get('/auth/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
	
	app.get('/auth/me', function(req, res){
		res.json(req.user);
	});
};