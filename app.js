
/**
 * StickIt by Virtually Ironic
 * Filename:		app.js
 * Date Last Mod:	4/9/13
 * Purpose:			Core application file called by node.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

// application modules
var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , bcrypt = require('bcrypt')
  , shortId = require('shortid')
  , appVersion = "0.9.0";

// configuration
var appConfig = require('config').app;

// express
var app = express();

// environment variables
app.set('port', appConfig.port);
app.set('view engine', 'html');
app.use(function(req, res, next){
	// eye candy for a new X-Powered-By header
	app.disable('x-powered-by');
	res.set('X-Powered-By', 'StickIt/' + appVersion);
	next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'abc'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// default route as branding 
app.get('/api', function(req, res) {
	res.send('StickIt v' + appVersion + ' by Virtually Ironic');
});

// import the api
var api = require('./routes')(app, passport);

//redirects to backbone's hash route if express route doesn't exist
app.use(function(req, res){
	return res.redirect('/#' + req.url);
});


http.createServer(app).listen(app.get('port'), function(){
	console.log('StickIt v' + appVersion + ' listening on port ' + app.get('port'));
});
