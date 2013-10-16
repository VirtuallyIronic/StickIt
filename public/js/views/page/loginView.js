
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/page/loginView.js
 * Purpose:			Marionette View Page for the Main Region. Login page functionality.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define([ 'jquery', 'underscore', 'backbone', 'marionette', 'handlebars', 'text!templates/page/loginTemplate.html'],
	function ($, _, Backbone, Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			events: {
				"click #loginButton": "login"
			},
			login: function(event) {
				// login function posts the username and password to the /auth/login api route
				// successful return from the api call redirects the user to the /home route
				// unsuccessful alerts the user via a popup dialog 
				event.stopPropagation();
				event.preventDefault();
				var url = '/auth/login';
				var formValues = {
					username: $('#usernameLogin').val(),
					password: $('#passwordLogin').val()
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
			}
		});
	}
);