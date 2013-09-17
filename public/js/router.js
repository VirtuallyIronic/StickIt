define([
        'jquery',
        'underscore',
        'backbone',
        'views/login/loginView',
        'views/index/indexView',
        'views/home/homeView'
        ], function($, _, Bacbone, LoginView, IndexView, HomeView){
	
	var AppRouter = Backbone.Router.extend({
		routes: {
			'login': 'login',
			'home': 'home',
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
		
		appRouter.on('route:home', function(){
			var homeView = new HomeView();
			homeView.render();
		});
		
		appRouter.on('route:testAction', function(){
			console.log('Testing!');
		});
		
		appRouter.on('route:defaultAction', function(actions){
			if(!actions){
				var indexView = new IndexView();
				indexView.render();
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