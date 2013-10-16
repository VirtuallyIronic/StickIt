
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/models/WallPermissions.js
 * Purpose:			Backbone Model for the Wall Permissions Object recieved from server.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var WallPermission = Backbone.Model.extend({
			urlRoot: '/api/wallpermissions',
            idAttribute: 'id'
        });
        return WallPermission;
    }
);