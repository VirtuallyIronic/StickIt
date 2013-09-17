define([
        'jquery',
        'underscore',
        'backbone',
        'utils/bootstrap.min',
        'utils/settingsMenu',
        'text!templates/login/loginTemplate.html'
        ], function($, _, Backbone, Bootstrap, settingsMenu, loginTemplate){
	var loginView = Backbone.View.extend({
		
		el: $('html'),
		
		
		initialize:function(){
			console.log('Initializing Login View')
		},
	
		events: {
			"click #loginButton": "login",
			"click #registerButton": "register"
		},
		
		render: function(){
			this.$el.html(loginTemplate);
		},
		
		login:function(event){
			event.preventDefault();
			$('.alert-error').hide();
			var url = '/auth/login';
			console.log('Logging In...');
			var formValues = {
					username: $('#username').val(),
					password: $('#password').val()
			};
			
			$.ajax({
				url:url,
				type:'POST',
				dataType:"json",
				data: formValues,
				success:function(data){
					if(data.error){
						console.log("error: " + data.error.text);
						$('.alert-error').text(data.error.text).show();
					}
					else {
						window.location.replace('/home');
					}
				},
				error:function(error){
					window.location.replace('/login/failure');
				}
			});
		},
		
		register:function(event){
			event.preventDefault();
			$('.alert-error').hide();
			var url = '/auth/register';
			console.log('Registering...');
			var formValues = {
					username: $('#usernamesignup').val(),
					emailAddr: $('#emailsignup').val(),
					password: $('#passwordsignup').val(),
					passwordConfirm: $('#passwordsignup_confirm').val()
			};
			
			$.ajax({
				url: url,
				type: 'POST',
				dataType:"json",
				data: formValues,
				success:function(data){
					if(data.error){
						console.log("error: " + data.error.text);
						$('.alert-error').text(data.error.text).show();
					}
					else {
						window.location.replace('/#/login/success');
					}
				},
				error:function(error){
					window.location.replace('/#/register');
				}
			});
		}
	});
	
	return loginView;
});