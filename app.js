
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

var config = require('./appConfig')
  , appVer = require('./appStatic');

// all environments
app.set('port', config.appPort);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookieSecret));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// mysql setup
var mysql = require('mysql').createPool({
	  host: config.mysqlHost
	, port: config.mysqlPort
	, user: config.mysqlUser
	, password: config.mysqlPassword
	, database: config.mysqlDatabase
});

mysql.getConnection(function(err,connection){
	if(err) {
		console.log('[MYSQL] Connection Pool Failure: ' + err);
	}
	else {
		console.log('[MYSQL] Connection Pool Established');
	}
	connection.end();
});

//app.get('/', routes.index);
//app.get('/users', user.list);

app.get('/api', function(req, res) {
	res.send('StickIt API v' + appVer.apiVersion);
});

console.log('StickIt API v' + appVer.apiVersion);

var api = require('./controllers')(app, mysql);

http.createServer(app).listen(app.get('port'), function(){
  console.log('StickIt Server listening on port ' + app.get('port'));
});
