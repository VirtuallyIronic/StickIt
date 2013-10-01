define([ 'marionette', 'handlebars', 'text!templates/widget/widgetTemplate.html', 'models/CurrentUser'],
	function (Marionette, Handlebars, template, CurrentUser){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			}
		});
	}
);