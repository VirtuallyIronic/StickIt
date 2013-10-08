define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var UserList = Backbone.Model.extend({
			initialize:function () {
			},
            url: '/api/users'
        });
        return UserList;
    }
);