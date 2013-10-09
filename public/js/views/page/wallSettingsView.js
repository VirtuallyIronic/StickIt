define([ 'marionette', 'handlebars', 'json2','text!templates/page/wallSettingsTemplate.html', 'transit', 'settingsmenu', 'utils/permissionsPageController'],
	function (Marionette, Handlebars, json2, template, transit, settingsMenu, permissionsPageController){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			},
			events: {
				"click #updateButton": "updateSettings"
			},
			updateSettings: function(){
				var formValues = {
					title: $('#wallTitle').val(),
					isPrivate: $('#isPrivateCheckbox').is(":checked")
				}
				var url = '/api/wall/' + this.model.id;
				$.ajax({
					url: url,
					type: 'PUT',
					dataType: 'json',
					data: formValues,
					success: function(data){
						if(data.error){
							console.log("error: " + data.error.text);
						}
						else {
							window.location.reload();
						}
					},
					error: function(error) {
						console.log(error);
					}
				});
			}
		});
	}
);