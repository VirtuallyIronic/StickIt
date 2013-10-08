define([ 'marionette', 'handlebars', 'json2','text!templates/page/wallPermissionTemplate.html', 'transit', 'settingsmenu'],
	function (Marionette, Handlebars, json2, template, permissionsItemTemplate,transit, settingsMenu){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			}
		});
	}
);