define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var CurrentUser = Backbone.Model.extend({
			initialize:function () {
			},
            defaults:{
            	id: null,
            	username: null
            },
            url: '/auth/current'
        });
        return CurrentUser;
    }
);