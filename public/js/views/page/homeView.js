define([ 'marionette', 'handlebars', 'json2', 'text!templates/page/homeTemplate.html'],
	function (Marionette, Handlebars, json2, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			}
		});
	}
);