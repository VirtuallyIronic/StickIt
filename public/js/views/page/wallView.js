define([ 'marionette', 'handlebars', 'text!templates/page/wallTemplate.html', 'backbone-relational', 'vendor/jquery.gridster.with-extras', 'utils/ajaxController', 'utils/backbone_gridster_init', 'transit', 'settingsmenu'],
	function (Marionette, Handlebars, template, backboneRelational, gridster, ajaxController, gridsterInit, transit, settingsMenu){  
		return Marionette.ItemView.extend({
				template:Handlebars.compile(template)
		});
	}
);