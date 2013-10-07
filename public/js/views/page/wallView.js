define([ 'marionette', 'handlebars', 'text!templates/page/wallTemplate.html', 'models/Wall', 'transit', 'settingsmenu'],
	function (Marionette, Handlebars, template, CurrentWall, Transit, SettingsMenu){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			},
		});
	}
);