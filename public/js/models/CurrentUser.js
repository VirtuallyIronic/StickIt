define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var CurrentUser = Backbone.Model.extend({
			initialize:function () {
			},
            url: '/auth/current'
        });
        return CurrentUser;
    }
);