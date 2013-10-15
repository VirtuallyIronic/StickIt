
/**
 * StickIt by Virtually Ironic
 * Filename:		routes/index.js
 * Purpose:			Routes 'controller'.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

// node modules
var fs = require('fs');

module.exports = function(app, passport){
	// check in specific directory for files
    fs.readdirSync(__dirname).forEach(function(file) {
    	// do not return the index files
        if (file == "index.js") return;
        // return the module
        var name = file.substr(0, file.indexOf('.'));
        require('./' + name)(app, passport);
    });
}