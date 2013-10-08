define([ 'backbone', 'text!templates/page/wallTemplate.html', 'models/Wall', 'transit', 'settingsmenu'],
	function (Backbone, template, CurrentWall, Transit, SettingsMenu){  
		return Backbone.View.extend({
			el: $("#wall"),
			initialize: function(){
				this.listenTo(this.model, "change", this.render);
			},
			render: function(){
				this.$el.html(this.template);
			}
		});
	}
);