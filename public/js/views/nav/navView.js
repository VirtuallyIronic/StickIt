define([ 'marionette', 'handlebars', 'text!templates/nav/navLoggedInTemplate.html', 'text!templates/nav/navLoggedOutTemplate.html', 'bootstrap'],
	function (Marionette, Handlebars, loggedIn, loggedOut, Bootstrap){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(loggedOut),
			modelEvents: {
				"change": "render"
			}
		});
	}
);