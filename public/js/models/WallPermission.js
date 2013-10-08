define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var WallSetting = Backbone.Model.extend({
			urlRoot: '/api/wallpermissions',
            idAttribute: 'id'
        });
        return WallSetting;
    }
);