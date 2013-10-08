define([ 'marionette', 'handlebars', 'json2','text!templates/page/wallTemplate.html', 'backbone-relational', 'vendor/jquery.gridster.with-extras', 'transit', 'settingsmenu'],
	function (Marionette, Handlebars, json2, template, backboneRelational, gridster, transit, settingsMenu){  
		return Marionette.ItemView.extend({
				template:Handlebars.compile(template)
		});
	}
);