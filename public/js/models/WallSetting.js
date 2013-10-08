define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var WallPermission = Backbone.Model.extend({
			urlRoot: '/api/wall',
            idAttribute: 'id'
        });
        return WallPermission;
    }
);