define([ 'marionette', 'handlebars', 'text!templates/page/registerTemplate.html'],
	function (Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			events: {
				"click #registerButton": "register"
			},
			register:function(event){
				event.stopPropagation();
				event.preventDefault();
				var url = '/auth/register';
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
						}
						else {
							window.location.replace('/register/success');
						}
					},
					error:function(error){
						window.location.replace('/register');
					}
				});
			}
		});
	}
);