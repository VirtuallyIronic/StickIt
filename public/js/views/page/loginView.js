define([ 'jquery', 'underscore', 'backbone', 'marionette', 'handlebars', 'text!templates/page/loginTemplate.html'],
	function ($, _, Backbone, Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			events: {
				"click #loginButton": "login"
			},
			login: function(event) {
				event.stopPropagation();
				event.preventDefault();
				var url = '/auth/login';
				var formValues = {
					username: $('#username').val(),
					password: $('#password').val()
				};
				
				console.log(formValues);
				/**
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
						console.log(error);
						//window.location.replace('/login');
					}
				});
				**/
			}
		});
	}
);