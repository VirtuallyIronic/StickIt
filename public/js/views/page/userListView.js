
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/page/userListView.js
 * Purpose:			Marionette View Page for the Main Region, User Management Page.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define([ 'marionette', 'handlebars', 'json2','text!templates/page/userListTemplate.html', 'transit', 'settingsmenu', 'utils/userListController'],
	function (Marionette, Handlebars, json2, template, transit, settingsMenu, userListController){  
		return Marionette.ItemView.extend({
			template:Handlebars.compile(template),
			modelEvents:{
				"change": "render"
			}
		});
	}
);