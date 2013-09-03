var express = require('express')
var app = express();
app.listen(8080);

app.configure(function(){
	app.use(express.compress());
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
});

app.set('col', 7);
console.log(app.get('col'));

app.get('/get', function (req, res){
	console.log('req received '+req.method);
	var test = 7;
	//console.log(test);
	//res.send('test');
	res.json({newCol:app.get("col")})
	//res.render('index');
});

app.post('/ajax', express.bodyParser(), function (req, res){

	console.log("HEY!");
	console.log('req received '+req.method);
	app.set('col', req.body.newCol);
	console.log(req.body.newCol);
	res.end();
	//res.redirect('/');

});