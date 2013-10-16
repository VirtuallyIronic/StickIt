
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/logo/logoSmallView.js
 * Purpose:			Marionette View Page for the Logo Region. Static View. Legacy name from when app had a larger and a smaller logo.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */


define([ 'marionette', 'handlebars', 'text!templates/logo/logoSmallTemplate.html'],
	function (Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template)
		});
	}
);