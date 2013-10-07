define([ 'marionette', 'handlebars', 'text!templates/page/errorTemplate.html'],
	function (Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template)
		});
	}
);