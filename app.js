
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , APPCONFIG = require('config').app;

var app = express();

// all environments
app.set('port', APPCONFIG.port);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(APPCONFIG.cookieSecret));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res){
	return res.redirect(req.protocol + '://' + req.get('Host') + '/#' + req.url);
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/api', function(req, res) {
	res.send('StickIt API');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
