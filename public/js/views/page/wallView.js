define([ 'backbone', 'text!templates/page/wallTemplate.html', 'vendor/jquery.gridster.with-extras', 'utils/ajaxController', 'utils/backbone_gridster_init', 'transit', 'settingsmenu'],
	function (Backbone, template, gridster, ajaxController, gridsterInit, Transit, SettingsMenu){  
		return Backbone.View.extend({
			el: $(".demo"),
			initialize: function(){
				this.listenTo(this.model, "change", this.render);
			},
			render: function(){
				this.$el.html(this.template);
			}
		});
	}
);