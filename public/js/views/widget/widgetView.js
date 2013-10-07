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
						window.location.replace('/login');
					}
				});
			},
			logout: function(event){
				event.stopPropagation();
				event.preventDefault();
				window.location.replace('/auth/logout');
			}
		});
	}
);