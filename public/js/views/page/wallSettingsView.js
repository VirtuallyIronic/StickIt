
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/page/wallSettingsView.js
 * Purpose:			Marionette View Page for the Main Region, Wall Settings Page.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define([ 'marionette', 'handlebars', 'json2','text!templates/page/wallSettingsTemplate.html', 'transit', 'settingsmenu', 'utils/permissionsPageController'],
	function (Marionette, Handlebars, json2, template, transit, settingsMenu, permissionsPageController){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			},
			events: {
				"click #updateButton": "updateSettings",
				"click #deleteButton": "deleteWall"
			},
			updateSettings: function(){
				// updateSettings functions does a PUT request to the server to update a specific wall's settings
				// successful returns will refresh the page
				// unsuccessful alerts will redirect the user to an error page 
				event.stopPropagation();
				event.preventDefault();
				var formValues = {
					title: $('#wallTitle').val(),
					isPrivate: $('#isPrivateCheckbox').is(":checked")
				}
				var url = '/api/wall/' + this.model.id;
				$.ajax({
					url: url,
					type: 'PUT',
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
			},
			deleteWall: function(){
				// deleteWall function does a Delete request to the server
				// successful returns return the user to a home page
				// unsuccessful alerts will redirect the user to an error page 
				event.stopPropagation();
				event.preventDefault();
				var r=confirm("Deleting a Wall is Permanent!");
				if (r==true)
				{
					var url = '/api/wall/' + this.model.id;
					$.ajax({
						url: url,
						type: 'DELETE',
						dataType: 'json',
						success: function(data){
							if(data.error){
								console.log("error: " + data.error.text);
							}
							else {
								window.location.replace('/home');
							}
						},
						error: function(error) {
							window.location.replace('/error');
						}
					});
				} else {
					window.location.reload();
				}
			}
		});
	}
);