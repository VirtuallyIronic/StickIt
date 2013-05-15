var application_root = __dirname,
    express = require("express"),
    path = require("path");

var app = express();

var config = require('./appConfig');

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var mysql = require("mysql").createPool({
	host		: config.mysqlHost,
	port		: config.mysqlPort,
	user		: config.mysqlUser,
	password	: config.mysqlPassword,
	database	: config.mysqlDatabase
});

mysql.getConnection(function(err,connection) {
	if(err) {
		console.log('DB CONNECTION ERROR: ', err);
	}
	else {
		console.log('DB CONNECTION SUCCESSFUL');		
	}
});

app.listen(4242);