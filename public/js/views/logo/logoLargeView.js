define([ 'marionette', 'handlebars', 'text!templates/logo/logoLargeTemplate.html'],
	function (Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template)
		});
	}
);