define([ 'marionette', 'handlebars', 'json2','text!templates/page/userListTemplate.html', 'transit', 'settingsmenu', 'utils/userListController'],
	function (Marionette, Handlebars, json2, template, transit, settingsMenu, userListController){  
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
				});
			}
		});
	}
);