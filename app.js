
/**
 * StickIt by Virtually Ironic
 * Filename:		app.js
 * Purpose:			Core application file called by node.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

// application modules
var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , sequelize = require('sequelize')
  , appVersion = "1.0.0";

// configuration
var config = require('config');

// express
var app = express();

/**
 * start middleware setup for express
 */
app.set('port', config.app.port); // app port
app.set('views', __dirname + '/views'); // view directory and engine
app.set('view engine', 'html');

// overwrite x-powered-by to show StickIt
app.use(function(req, res, next){
	app.disable('x-powered-by');
	res.set('X-Powered-By', 'StickIt/' + appVersion);
	next();
});
app.use(express.compress()); // compression middleware by express
app.use(express.methodOverride()); // method override middleware by express
app.use(express.bodyParser()); // allow express to see post/put/delete results
// xss
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(express.static(path.join(__dirname, 'public'))); // public folder
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico'))); // favicon
app.use(express.logger('dev')); // logger below public to ignore public folder
app.use(express.cookieParser()); // cookie parse by express
app.use(express.session({secret: config.app.cookieSecret})); // cookie sessions setup
app.use(passport.initialize()); // passport.js middleware
app.use(passport.session()); // passport session overload of express session
app.use(app.router); // express router middleware
/**
 * end middleware
 */


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// default route as branding 
app.get('/api', function(req, res) {
	res.send('StickIt v' + appVersion + ' by Virtually Ironic');
});

// authentication checker
function checkAuthentication(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.send(401, {"error" : "access denied"});
}

//direct all api routes to to login if not logged in 
app.all('/api/*', checkAuthentication);

// import the api
var api = require('./routes')(app, passport);

//redirects to backbone's hash route if express route doesn't exist
app.use(function(req, res){
	return res.redirect('#' + req.url);
});

// start http stack
http.createServer(app).listen(app.get('port'), function(){
	console.log('StickIt v' + appVersion + ' listening on port ' + app.get('port'));
});
