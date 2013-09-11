define([
        'jquery',
        'underscore',
        'backbone',
        'utils/backbone.min',
        'utils/settingsMenu',
        'text!templates/login/loginTemplate.html'
        ], function($, _, Backbone, Bootstrap, settingsMenu, loginTemplate){
	var loginView = Backbone.View.extend({
		
		el: $('html'),
		
		
		initialize:function(){
			console.log('Initializing Login View')
		},
	
		events: {
			"click #loginButton": "login"
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
						window.location.replace('/#/login/success');
					}
				},
				error:function(error){
					window.location.replace('/#/login/failure');
				}
			});
		}
	});
	
	return loginView;
});