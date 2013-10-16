
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/footer/footerView.js
 * Purpose:			Marionette View Page for the Footer Region.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define([ 'marionette', 'handlebars', 'text!templates/footer/footerTemplate.html'],
	function (Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template)
		});
	}
);