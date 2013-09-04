define([
        'jquery',
        'underscore',
        'backbone',
        'text!templates/login/loginTemplate.html'
        ], function($, _, Backbone, loginTemplate){
	var loginView = Backbone.View.extend({
		
		el: $("#page"),
		
		
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
					username: $('#inputUsername').val(),
					password: $('#inputPassword').val()
			};
			
			$.ajax({
				url:url,
				type:'POST',
				dataType:"json",
				data: formValues,
				success:function(data){
					console.log(["Login request details: ", data]);
					if(data.error){
						$('.alert-error').text(data.error.text).show();
					}
					else {
						windows.location.replace('/#login/success');
					}
				}
			});
		}
	});
	
	return loginView;
});