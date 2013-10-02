define([ 'marionette', 'handlebars', 'text!templates/widget/widgetTemplate.html', 'models/CurrentUser', 'transit', 'settingsmenu'],
	function (Marionette, Handlebars, template, CurrentUser, Transit, SettingsMenu){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			}
		});
	}
);