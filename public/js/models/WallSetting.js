
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/models/WallSettings.js
 * Purpose:			Backbone Model for the Wall Object recieved from server.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var WallUpdate = Backbone.Model.extend({
			urlRoot: '/api/wall',
            idAttribute: 'id'
        });
        return WallUpdate;
    }
);