
/**
 * StickIt by Virtually Ironic
 * Filename:		routes/auth.js
 * Date Last Mod:	3/9/13
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
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , dbConfig = require('config').db;

// temporary users
var users = [
	{ id: 1, username: 'evan', password: 'Qwerty1!', email: 'ev@test.com'}
  , { id: 2, username: 'bob', password: 'Qwerty2!', email: 'bob@test.com'}
  ];

function findById(id, fn) {
	var idx = id - 1;
	if(users[idx]) {
		fn(null, users[idx]);
	}
	else {
		fn(new Error('User ' + id + ' does not exist'));
	}
}

function findByUsername(username, fn) {
	for (var i = 0; i < users.length; i++) {
		var user = users[i];
		if(user.username === username) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}
// end temp users

// passport session setup
passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	findById(id, function(err, user){
		done(err, user);
	});
});

// passport local strategy setup
passport.use(new LocalStrategy(
	function(username, password, done){
		process.nextTick(function(){
			findByUsername(username, function(err, user){
				if(err) { return done(err); }
				if(!user) { return done(null, false, { message: 'Unknown user ' + username }); }
				if(user.password != password) { return done(null, false, { message: 'Invalid password' }); }
				return done(null, user);
			})
		});
	}
));

// authentication checker
function checkAuthentication(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/#login');
}

