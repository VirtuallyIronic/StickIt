define([ 'marionette', 'handlebars', 'text!templates/page/aboutTemplate.html'],
	function (Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template)
		});
	}
);