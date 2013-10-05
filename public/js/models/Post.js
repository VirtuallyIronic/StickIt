define(['jquery', 'underscore', 'backbone', 'backbone-relational', 'models/Tag', 'models/Vote'],
	function ($, _, Backbone, Relational, modelTag, modelPost) {
		var Post = Backbone.RelationalModel.extend({
			urlRoot: '/api/post',
			idAttribute: 'id',
			relations: [{
				type: Backbone.HasMany,
				key: 'tags',
				relatedModel: 'modelTag',
				reverseRelation: {
					key: ''
				}
			}]
        });
        return Post;
    }
);