
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/page/newWallView.js
 * Purpose:			Marionette View Page for the Main Region, New Wall Page.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define([ 'marionette', 'handlebars', 'json2','text!templates/page/wallNewTemplate.html', 'transit', 'settingsmenu', 'utils/permissionsPageController'],
	function (Marionette, Handlebars, json2, template, transit, settingsMenu, permissionsPageController){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			},
			events: {
				"click #createButton": "createWall",
			},
			createWall: function(){
				// createWall function will take form values and submit a post request to the api
				// successful will redirect to the home route where the user will see their new wall  
				// failure will redirect the user to the error page
				event.stopPropagation();
				event.preventDefault();
				var formValues = {
					title: $('#wallTitle').val(),
					isPrivate: $('#isPrivateCheckbox').is(":checked")
				}
				var url = '/api/wall/';
				$.ajax({
					url: url,
					type: 'POST',
					dataType: 'json',
					data: formValues,
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
			}
		});
	}
);