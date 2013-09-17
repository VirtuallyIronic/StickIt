define([
        'jquery',
        'underscore',
        'backbone',
        'utils/bootstrap.min',
        'text!templates/home/homeTemplate.html'
        ], function($, _, Backbone, Bootstrap, homeTemplate){
	var homeView = Backbone.View.extend({
		
		el: $('html'),
		
		
		initialize:function(){
			console.log('Initializing Home View')
		},
	
		render: function(){
			this.$el.html(homeTemplate);
		}
	});
	
	return homeView;
});