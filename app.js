
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
  , sequelize = require('sequelize')
  , serve = require('./middleware/serve')
  , cons = require('consolidate')
  , appVersion = "0.10.0";

// configuration
var config = require('config');

// express
var app = express();

// assign the underscore engine to .html files
app.engine('html', cons.underscore);

// environment variables
app.set('port', config.app.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(function(req, res, next){
	app.disable('x-powered-by');
	res.set('X-Powered-By', 'StickIt/' + appVersion);
	next();
});
app.use(express.favicon(path.join(__dirname, 'public/img/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(serve.router());
app.use(express.cookieParser());
app.use(express.session({secret: 'abc'}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);



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
	res.redirect('/#/login');
}

//direct all api routes to to login if not logged in 
app.all('/api/*', checkAuthentication);
app.all('/#/home', checkAuthentication);
app.all('/home', checkAuthentication);

// import the api
var api = require('./routes')(app, passport);

//redirects to backbone's hash route if express route doesn't exist
//app.use(function(req, res){
//	console.log(req.url);
//	return res.redirect('#' + req.url);
//});

http.createServer(app).listen(app.get('port'), function(){
	console.log('StickIt v' + appVersion + ' listening on port ' + app.get('port'));
});
