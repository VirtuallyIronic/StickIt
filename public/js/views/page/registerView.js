
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/page/registerView.js
 * Purpose:			Marionette View Page for the Main Region, Registration Page.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define([ 'marionette', 'handlebars', 'text!templates/page/registerTemplate.html'],
	function (Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			events: {
				"click #registerButton": "register"
			},
			register:function(event){
				// register function makes a post request to the api
				// takes form values and on success will redirect to the register/success page.
				// a failure to register will alert the user via popup.
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
						window.alert("Registration was unsuccessful. Please ensure all fields are filled, a valid email is used and passwords match.");
					}
				});
			}
		});
	}
);