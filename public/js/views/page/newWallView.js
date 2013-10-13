define([ 'marionette', 'handlebars', 'json2','text!templates/page/wallNewTemplate.html', 'transit', 'settingsmenu', 'utils/permissionsPageController'],
	function (Marionette, Handlebars, json2, template, transit, settingsMenu, permissionsPageController){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			},
			events: {
				"click #createButton": "createWall",
			},
			createWall: function(){
				event.stopPropagation();
				event.preventDefault();
				var formValues = {
					title: $('#wallTitle').val(),
					isPrivate: $('#isPrivateCheckbox').is(":checked")
				}
				var url = '/api/wall/';
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
					}
				});
			}
		});
	}
);