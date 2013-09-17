define([
        'jquery',
        'underscore',
        'backbone',
        'utils/bootstrap.min',
        'text!templates/index/indexTemplate.html'
        ], function($, _, Backbone, Bootstrap, indexTemplate){
	var indexView = Backbone.View.extend({
		
		el: $('html'),
		
		
		initialize:function(){
			console.log('Initializing Index View')
		},
	
		render: function(){
			this.$el.html(indexTemplate);
		}
	});
	
	return indexView;
});