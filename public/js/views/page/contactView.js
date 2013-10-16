
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/page/contactView.js
 * Purpose:			Marionette View Page for the Main Region, Static View for the contact route.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */


define([ 'marionette', 'handlebars', 'text!templates/page/contactTemplate.html'],
	function (Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template)
		});
	}
);