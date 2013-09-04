define([
        'jquery',
        'underscore',
        'backbone',
        'views/login/loginView'
        ], function($, _, Bacbone, LoginView){
	
	$.ajaxSetup({
	    statusCode: {
	        401: function(){
	            // Redirec the to the login page.
	            window.location.replace('#login');
	         
	        },
	        403: function() {
	            // 403 -- Access denied
	            window.location.replace('#denied');
	        }
	    }
	});
	
	var AppRouter = Backbone.Router.extend({
		routes: {
			'login': 'login',
			'test': 'testAction',
			'*actions': 'defaultAction'
		}
	});
	
	var initialize = function(){
	
		var appRouter = new AppRouter;
		
		appRouter.on('route:login', function(){
			var loginView = new LoginView();
			loginView.render();
		});
		
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