define([ 'marionette', 'handlebars', 'json2','text!templates/page/wallPermissionTemplate.html', 'transit', 'settingsmenu', 'utils/permissionsPageController'],
	function (Marionette, Handlebars, json2, template, permissionsItemTemplate,transit, settingsMenu, permissionsPageController){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			},
			events: {
				"click #addPermission": "addPermission"
			},
			addPermission: function(event){
				var formValues = {
					wallId: $('#permissionWallId').val(),
					username: $('#permissionAddUsername').val(),
					permission: $('#permissionAddSelect').val(),
				}
				console.log(formValues);
			}
		});
	}
);