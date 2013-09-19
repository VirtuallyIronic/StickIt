var _ = require('underscore');

function skip(req) {
	return _.any(['/api', '/auth', '/css', '/images', '/js', '/logo', '/templates'], function(url){
		return req.url.substr(0, url.length) === url;
	});
}

function handler() {
	return function (req, res, next) {
		if(skip(req)) {
			return next();
		}	
		res.render('index');
	};
}

module.exports = {
	router: function () {
		return handler();
	}
};