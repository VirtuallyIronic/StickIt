define([ 'marionette', 'handlebars', 'text!templates/nav/navLoggedInTemplate.html', 'text!templates/nav/navLoggedOutTemplate.html'],
	function (Marionette, Handlebars, loggedIn, loggedOut){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(loggedOut),
			modelEvents: {
				"change": "render"
			}
		});
	}
);