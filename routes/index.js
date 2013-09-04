
/**
 * StickIt by Virtually Ironic
 * Filename:		routes/index.js
 * Date Last Mod:	4/9/13
 * Purpose:			Routes 'controller'.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

/**
//OLD SCHOOL STUFF
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
**/

var fs = require('fs');

module.exports = function(app, passport){
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file == "index.js") return;
        var name = file.substr(0, file.indexOf('.'));
        require('./' + name)(app, passport);
    });
}