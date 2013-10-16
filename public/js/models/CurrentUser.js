
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/models/CurrentUser.js
 * Purpose:			Backbone Model for the Current User Object recieved from server.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var CurrentUser = Backbone.Model.extend({
			initialize:function () {
			},
            url: '/auth/current'
        });
        return CurrentUser;
    }
);