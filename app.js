var express = require('express')
var app = express();
app.listen(8080);

// Declare variables
var fs = require('fs');
var obj;
var objCol;
var notes;
var filePath = __dirname+'/public/database.json';
var colPath = __dirname+'/public/col.json';
// Read the file and send to the callback
fs.readFile(filePath, handleFile)

// Write the callback function
function handleFile(err, data) {
	//console.log(err);
	//console.log(data);
    if (err) throw err
	
	//console.log(data.note.totalCols);
    //obj = data;
	obj = JSON.parse(data);
	//console.log(obj);
	//setCol(obj.totalCols);
	setNotes(obj);
    // You can now play with your datas
}

fs.readFile(colPath, handleCol)

// Write the callback function
function handleCol(err, data) {
	//console.log(err);
	//console.log(data);
    if (err) throw err
	
	//console.log(data.note.totalCols);
    //obj = data;
	objCol = JSON.parse(data);
	//console.log(objCol);
	setCol(objCol.totalCols);
	//setNotes(obj.note);
    // You can now play with your datas
}
//console.log(obj);

app.configure(function(){
	app.use(express.compress());
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
});

function setNotes(newNotes){
	app.set('serverNotes', newNotes);
	notes = newNotes;
	console.log("notes: "+app.get('serverNotes'));
}

function setCol(length) {
	length = parseInt(length);
	app.set('col', length); 
	console.log("col: "+app.get('col'));
}
//app.set('col', 7);

app.post('/dataUpdate', express.bodyParser(), function (req, res){
	console.log('update occured');
	console.log(req.body);
	fs.writeFile(filePath, JSON.stringify(req.body), function(err) {
		if(err) {
		  console.log(err);
		} else {
		  console.log("JSON saved to ");
		}
	});
	fs.readFile(filePath, handleFile);
});

app.get('/get', function (req, res){
	console.log('Getting req received '+req.method);
	var totalData = {};
	totalData[0] = objCol.totalCols;
	//console.log('Getting req received '+req.method);
	totalData[1] = notes;
	//console.log('Getting req received '+req.method);
	//console.log(test);
	//res.send('test');
	res.json(totalData);//, outNotes:app.get("serverNotes")})
	//res.render('index');
});

app.post('/', express.bodyParser(), function (req, res){

	console.log("HEY!");
	console.log('Posting req received '+req.method);
	//app.set('col', req.body.newCol);
	console.log(req.body.newCol);
	//length = parseInt(length);
	var demoLane = parseInt(req.body.newCol);
	console.log(demoLane+' demoLane');
	//var demoLane = demoLane-1;
	objCol.totalCols = demoLane.toString();
	console.log(objCol.totalCols+" totalCols");
	
	//var tempObj = {"totalCols": obj.totalCols};
	//console.log(tempObj);
	fs.writeFile(colPath, JSON.stringify(objCol), function(err) {
		if(err) {
		  console.log(err);
		} else {
		  console.log("JSON saved to ");
		}
	});
	
	res.send(objCol.totalCols);
	//res.redirect('/');

});
/*
app.post('/decLane', express.bodyParser(), function (req, res){

	console.log("HEY!");
	console.log('Posting req received '+req.method);
	//app.set('col', req.body.newCol);
	//console.log(req.body.newCol);
	//length = parseInt(length);
	var demoLane = parseInt(objCol.totalCols);
	console.log(demoLane);
	var demoLane = demoLane-1;
	objCol.totalCols = demoLane.toString();
	console.log(objCol.totalCols);
	res.end();
	//res.redirect('/');

});

app.post('/ajax', express.bodyParser(), function (req, res){

	console.log("HEY!");
	console.log('Posting req received '+req.method);
	//app.set('col', req.body.newCol);
	//console.log(req.body.newCol);
	//length = parseInt(length);
	var demoLane = parseInt(objCol.totalCols);
	console.log(demoLane);
	var demoLane = demoLane+1;
	objCol.totalCols = demoLane.toString();
	console.log(objCol.totalCols);
	res.end();
	//res.redirect('/');

});*/
