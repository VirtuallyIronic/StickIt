define([ 'marionette', 'handlebars', 'text!templates/footer/footerTemplate.html'],
	function (Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template)
		});
	}
);