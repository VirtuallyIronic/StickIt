define([ 'marionette', 'handlebars', 'json2','text!templates/page/wallPermissionTemplate.html', 'transit', 'settingsmenu', 'utils/permissionsPageController'],
	function (Marionette, Handlebars, json2, template, transit, settingsMenu, permissionsPageController){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			},
			events: {
				"click #updateButton": "updatePermissions"
			},
			updatePermissions: function(event){
				event.stopPropagation();
				event.preventDefault();
				var checkbox = $('isPrivateCheckbox').val();
				console.log(checkbox);
			}
		});
	}
);