define([ 'marionette', 'handlebars', 'json2','text!templates/page/userListTemplate.html', 'transit', 'settingsmenu', 'utils/userListController'],
	function (Marionette, Handlebars, json2, template, transit, settingsMenu, userListController){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			},
		});
	}
);