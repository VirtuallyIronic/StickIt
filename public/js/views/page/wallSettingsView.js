define([ 'marionette', 'handlebars', 'json2','text!templates/page/wallSettingsTemplate.html', 'transit', 'settingsmenu', 'utils/permissionsPageController'],
	function (Marionette, Handlebars, json2, template, transit, settingsMenu, permissionsPageController){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			},
			events: {
				"click #updateButton": "updateSettings"
			},
			updateSettings: function(){
				event.stopPropagation();
				event.preventDefault();
				console.log($('#isPrivateCheckbox').val());
			}
		});
	}
);