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
				var privacy;
				console.log($('#isPrivateCheckbox').val());
				if ($('#isPrivateCheckbox').is(":checked")){
					privacy = 1;
				} else {
					privacy = 0;
				}
				var formValues = {
					title: $('#wallTitle').val(),
					isPrivate: privacy
				}
				var url = '/api/wall/' + $('#settingsWallId').val();
				console.log(url);
				console.log(formValues);
			}
		});
	}
);