
/**
 * StickIt by Virtually Ironic
 * Filename:		app.js
 * Date Last Mod:	3/9/13
 * Purpose:			Core application file called by node.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

// application modules
var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport');

// configuration
var appConfig = require('config').app;

// express
var app = express();

// environment variables
app.set('port', appConfig.port);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'abc'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// redirects to backbone's hash route if express route doesn't exist
app.use(function(req, res){
	return res.redirect('/#' + req.url);
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// default route as branding 
app.get('/api', function(req, res) {
	res.send('StickIt by Virtually Ironic');
});

var auth = require('./routes/auth');

http.createServer(app).listen(app.get('port'), function(){
	console.log('StickIt listening on port ' + app.get('port'));
});
