
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/nav/navView.js
 * Purpose:			Marionette View Page for the Navigation Region. Takes a model of the currently logged in user. Changes menu depending on the user been logged in or out.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */


define([ 'marionette', 'handlebars', 'text!templates/nav/navTemplate.html', 'bootstrap'],
	function (Marionette, Handlebars, template, Bootstrap){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents: {
				"change": "render"
			}
		});
	}
);