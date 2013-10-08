define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var WallSetting = Backbone.Model.extend({
			urlRoot: '/api/wall',
            idAttribute: 'id'
        });
        return WallSetting;
    }
);