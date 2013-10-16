
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/widget/widgetView.js
 * Purpose:			Marionette View Page for the Widget Region. Controls the Widget's Login / Logout functionality.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define([ 'marionette', 'handlebars', 'text!templates/widget/widgetTemplate.html', 'models/CurrentUser', 'transit', 'settingsmenu'],
	function (Marionette, Handlebars, template, CurrentUser, Transit, SettingsMenu){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			},
			events: {
				"click #widgetLoginButton": "login",
				"click #widgetLogoutButton": "logout"
			},
			login: function(event) {
				// login function posts the username and password to the /auth/login api route
				// successful return from the api call redirects the user to the /home route
				// unsuccessful alerts the user via a popup dialog 
				event.stopPropagation();
				event.preventDefault();
				var url = '/auth/login';
				var formValues = {
					username: $('#usernameWidget').val(),
					password: $('#passwordWidget').val()
				};
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
						window.alert("Invalid Username or Password. Please try again.");
					}
				});
			},
			logout: function(event){
				// directs the user to the /auth/logout route
				event.stopPropagation();
				event.preventDefault();
				window.location.replace('/auth/logout');
			}
		});
	}
);