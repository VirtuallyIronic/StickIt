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
						console.log(error);
					}
			}
		});
	}
);