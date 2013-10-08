define([ 'backbone', 'text!templates/page/wallTemplate.html', 'models/Wall', 'transit', 'settingsmenu'],
	function (Backbone, template, CurrentWall, Transit, SettingsMenu){  
		return Backbone.View.extend({
			tag: 'div',
			template: template,
			modelEvents:{
				"change": "render"
			},
			onRender: function(){
				console.log(this.model);
			}
		});
	}
);