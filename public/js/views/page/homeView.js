
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/page/homeView.js
 * Purpose:			Marionette View Page for the Main Region, Static View for the home route.
 * Notes:			Home View takes a model and displays items from that model. Handlebars template engine controls that functionality.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define([ 'marionette', 'handlebars', 'json2', 'text!templates/page/homeTemplate.html'],
	function (Marionette, Handlebars, json2, template){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			}
		});
	}
);