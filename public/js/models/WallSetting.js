define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var WallUpdate = Backbone.Model.extend({
			urlRoot: '/api/wall',
            idAttribute: 'id'
        });
        return WallUpdate;
    }
);