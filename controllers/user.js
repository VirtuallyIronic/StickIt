/**
 * API WALLS
 */
var MODULE_NAME = "User"
  , MODULE_MAJOR_VERSION = "0"
  , MODULE_MINOR_VERSION = "1"
  , MODULE_PATCH_VERSION = "1";

console.log("[API] LOADING " + MODULE_NAME + " " + MODULE_MAJOR_VERSION + "." + MODULE_MINOR_VERSION + "." + MODULE_PATCH_VERSION + " [SUCCESSFUL]");

var uuid = require('node-uuid')
  , shortid = require('shortid')
  , crypto = require('crypto');

module.exports = function(app, mysql){
	//app.get('/test/user', function(req, res){
	//		var oldPassword = "Qwerty1!"
	//		  , timeStamp = uuid.v1()
	//		  , newPassword = crypto.pbkdf2Sync(oldPassword, timeStamp, 25000, 512).toString('base64');
	//		  
	//		res.send(newPassword);
	//		console.log(newPassword);
	//});
	
	app.post('/register', function(req,res){
		var rawPassword = req.body.formPassword
		  , username = req.body.formUsername
		  , emailAddr = req.body.formEmailAddr
		  , userId = shortid.generate()
		  , timeStamp = uuid.v1()
		  , encodedPassword = crypto.pbkdf2Sync(rawPassword, timeStamp, 25000, 512).toString('base64')
		  , sqlQuery = "INSERT INTO users(uuid, email,username,password) VALUES('" + userId + "','" + emailAddr + "','" + username + "','" + encodedPassword + "')"
		  , sqlQueryTwo = "INSERT INTO ustamps(uuid, timestamp) VALUES('" + userId + "','" + timeStamp + "')";
		  
		  mysql.getConnection(function(err, connection){
		  	connection.query(sqlQuery, function(err, rows){
		  		if(err) {
		  			console.log(err);
		  		}
		  		else {
		  			res.send(rows);
		  		}
		  	});
		  	connection.query(sqlQueryTwo,function(err,rows){
		  		if(err){
		  			console.log(err);
		  		}
		  		else {
		  			res.send(rows)
		  		}
		  	});
		  	connection.end();
		  });
	});
};