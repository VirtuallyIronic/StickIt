define(['jquery', 'underscore', 'backbone', 'backbone-relational'],
	function ($, _, Backbone, Relational) {
		var Post = Backbone.RelationalModel.extend({
			urlRoot: '/api/post',
			idAttribute: 'id'
        });
        return Post;
    }
);