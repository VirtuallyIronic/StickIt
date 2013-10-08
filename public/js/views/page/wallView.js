define([ 'backbone', 'text!templates/page/wallTemplate.html', 'models/Wall', 'transit', 'settingsmenu'],
	function (Backbone, template, CurrentWall, Transit, SettingsMenu){  
		return Backbone.View.extend({
			tag: 'div',
			template: template,
			initialize: function(){
				this.listenTo(this.model, "change", this.render);
			},
			render: function(){
			    this.$el.html(this.template(this.model.attributes));
			    return this;
			}
		});
	}
);