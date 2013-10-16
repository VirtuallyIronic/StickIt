
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/page/successfulRegistrationView.js
 * Purpose:			Marionette View Page for the Main Region, Static View if a registration was successful.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define([ 'marionette', 'handlebars', 'text!templates/page/successfulRegistrationTemplate.html'],
	function (Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template)
		});
	}
);