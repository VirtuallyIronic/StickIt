/**
 * API CONTROLLER INDEX
 */

var fs = require('fs');

module.exports = function(app, mysql){
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file == "index.js") return;
        var name = file.substr(0, file.indexOf('.'));
        require('./' + name)(app, mysql);
    });
}