define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var WallPermission = Backbone.Model.extend({
            url: '/api/wallpermissions',
            idAttribute: 'id'
        });
        return WallPermission;
    }
);