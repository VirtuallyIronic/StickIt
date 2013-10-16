
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/page/indexView.js
 * Purpose:			Marionette View Page for the Main Region, Static View for the index route.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define([ 'marionette', 'handlebars', 'text!templates/page/indexTemplate.html'],
	function (Marionette, Handlebars, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template)
		});
	}
);