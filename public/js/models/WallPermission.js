define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var WallPermission = Backbone.Model.extend({
			urlRoot: '/api/wallpermissions',
            idAttribute: 'id'
        });
        return WallPermission;
    }
);