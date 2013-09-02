define([
        'jquery',
        'underscore',
        'backbone',
        ], function($, _, Bacbone){
	
	var AppRouter = Backbone.Router.extend({
		routes: {
			'test': 'testAction',
			'*actions': 'defaultAction'
		}
	});
	
	var initialize = function(){
	
		var appRouter = new AppRouter;
		
		appRouter.on('route:testAction', function(){
			console.log('Testing!');
		});
		
		appRouter.on('route:defaultAction', function(actions){
			if(!actions){
				console.log('home');
			} else {
				console.log('404 on route: ', actions);
			}
		});
		
		Backbone.history.start({pushState: true});
	};

	return {
		initialize: initialize
	};

});