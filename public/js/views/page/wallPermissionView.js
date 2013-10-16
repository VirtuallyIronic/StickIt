
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/page/wallPermissionView.js
 * Purpose:			Marionette View Page for the Main Region, Wall Permissions Page.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define([ 'marionette', 'handlebars', 'json2','text!templates/page/wallPermissionTemplate.html', 'transit', 'settingsmenu', 'utils/permissionsPageController'],
	function (Marionette, Handlebars, json2, template, transit, settingsMenu, permissionsPageController){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			},
			events: {
				"click #addPermission": "addPermission"
			},
			addPermission: function(event){
				// addPermission function does a POST request to the server to add a user.
				// successful returns will refresh the page showing the new user
				// unsuccessful alerts will redirect the user to an error page 
				event.stopPropagation();
				event.preventDefault();
				var formValues = {
					wallId: $('#permissionWallId').val(),
					username: $('#permissionAddUsername').val(),
					permission: $('#permissionAddSelect').val(),
				}
				$.ajax({
					url: '/api/wallpermissions',
					type: 'POST',
					dataType: 'json',
					data: formValues,
					success: function(data){
						if(data.error){
							console.log("error: " + data.error.text);
						}
						else {
							window.location.reload();
						}
					},
					error: function(error) {
						window.location.replace('/error');
					}
				});
			}
		});
	}
);