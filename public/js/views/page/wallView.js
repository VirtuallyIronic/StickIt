define([ 'marionette', 'handlebars', 'text!templates/page/wallTemplate.html', 'models/Wall', 'transit', 'settingsmenu'],
	function (Marionette, Handlebars, template, CurrentWall, Transit, SettingsMenu){  
		return Marionette.ItemView.extend({
			tag: 'div',
			template: template,
			modelEvents:{
				"change": "render"
			},
			onRender: function(){
				console.log(this.model.posts);
			}
		});
	}
);