/**
 * API WALLS
 */
var MODULE_NAME = "User"
  , MODULE_MAJOR_VERSION = "0"
  , MODULE_MINOR_VERSION = "4"
  , MODULE_PATCH_VERSION = "0";

console.log("[API] LOADING " + MODULE_NAME + " " + MODULE_MAJOR_VERSION + "." + MODULE_MINOR_VERSION + "." + MODULE_PATCH_VERSION + " [SUCCESSFUL]");

var uuid = require('node-uuid')
  , shortid = require('shortid')
  , crypto = require('crypto');

module.exports = function(app, mysql){
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
	
	app.put('/user/:id', function(req,res){
		var emailAddr = req.body.formEmailAddr
		  , firstName = req.body.formFirstName
		  , lastName = req.body.formLastName
		  , sqlQuery = "UPDATE users SET firstName='" + firstName + "', lastName='" + lastName + "', email='" + emailAddr + "' WHERE id='" + req.params.id + "';";
		
		mysql.getConnection(function(err, connection){
			connection.query(sqlQuery, function(err, rows){
				if(err){
					console.log(err);
				}
				else {
					res.send(rows);
				}
			});
			connection.end();
		});
	});
	
	app.delete('/user/:id', function(req, res){
		//var sqlQuery = "DELETE u, ut FROM users JOIN ustamps ua ON ua.uuid = u.uuid WHERE u.id = '" + req.params.id + "';";
		//var sqlQuery = "DELETE FROM ustamps, users USING ustamps INNER JOIN users WHERE ustamps.uuid = users.uuid AND users.id = '" + req.params.id + "';";
		var sqlQuery = "DELETE FROM users, ustamps USING users INNER JOIN ustamps WHERE users.id = '" + req.params.id + "' AND ustamps.uuid = users.uuid;";
		mysql.getConnection(function(err, connection){
			connection.query(sqlQuery, function(err, rows){
				if(err){
					console.log(err);
				}
				else {
					res.send(rows);
				}
			});
			connection.end();
		});
	});
	
	//app.put('/user', function(req,res){
	//	var rawPassword = req.body.formPassword
	//	  , username = req.body.formUsername
	//	  , emailAddr = req.body.formEmailAddr
	//	  , userId = req.body.userId
	//	  , timeStamp
	//	  , encodedPassword = crypto.pbkdf2Sync(rawPassword, timeStamp, 25000, 512).toString('base64')
	//	  , sqlQuery = "INSERT INTO users(uuid, email,username,password) VALUES('" + userId + "','" + emailAddr + "','" + username + "','" + encodedPassword + "')"
	//	  , sqlQueryTwo = "INSERT INTO ustamps(uuid, timestamp) VALUES('" + userId + "','" + timeStamp + "')"
	//	  , sqlTimeStampQuery = "SELECT timestamp FROM ustamps WHERE uuid = " + connection.escape(userId);
	//	  
	//	  mysql.getConnection(function(err, connection){
	//		 return connection.query(sqlTimeStampQuery, function(err, rows){
	//			if(err) throw err;
	//			
	//			timeStamp = rows.timestamp;
	//		 });
	//	  });
	//	  
	//	  mysql.getConnection(function(err, connection){
	//	  	connection.query(sqlQuery, function(err, rows){
	//	  		if(err) {
	//	  			console.log(err);
	//	  		}
	//	  		else {
	//	  			res.send(rows);
	//	  		}
	//	  	});
	//	  	connection.query(sqlQueryTwo,function(err,rows){
	//	  		if(err){
	//	  			console.log(err);
	//	  		}
	//	  		else {
	//	  			res.send(rows)
	//	  		}
	//	  	});
	//	  	connection.end();
	//	  });
	//});
};