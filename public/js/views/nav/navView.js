define([ 'marionette', 'handlebars', 'text!templates/nav/navTemplate.html', 'bootstrap'],
	function (Marionette, Handlebars, template, Bootstrap){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents: {
				"change": "render"
			}
		});
	}
);