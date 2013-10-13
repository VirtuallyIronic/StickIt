define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var WallList = Backbone.Model.extend({
			initialize:function () {
			},
            url: '/api/wall'
        });
        return WallList;
    }
);