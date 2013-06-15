/**
 * API WALLS
 */

var MODULE_NAME = "Walls"
  , MODULE_MAJOR_VERSION = "0"
  , MODULE_MINOR_VERSION = "4"
  , MODULE_PATCH_VERSION = "0";
  
var shortid = require('shortid');

console.log("[API] LOADING " + MODULE_NAME + " " + MODULE_MAJOR_VERSION + "." + MODULE_MINOR_VERSION + "." + MODULE_PATCH_VERSION + " [SUCCESSFUL]");

module.exports = function(app, mysql){
	app.get('/walls', function(req, res){
		mysql.getConnection(function(err, connection){
			connection.query('SELECT * FROM walls', function(err, rows){
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
	
	app.get('/walls/:id', function(req, res){
		mysql.getConnection(function(err, connection){
			connection.query('SELECT * FROM walls WHERE id = ' + req.params.id, function(err, rows){
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
	
	app.post('/walls', function(req,res){
		var wallTitle = req.body.formTitle
		  , wallOwner = "1"
		  , wallId = shortid.generate()
		  , sqlQuery = "INSERT INTO walls(uwid, title, owner) VALUES('" + wallId + "','" + wallTitle + "','" + wallOwner + "')";
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
};