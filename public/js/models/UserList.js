
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/models/UserList.js
 * Purpose:			Backbone Model for the User List Object recieved from server.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var UserList = Backbone.Model.extend({
			initialize:function () {
			},
            url: '/api/users'
        });
        return UserList;
    }
);