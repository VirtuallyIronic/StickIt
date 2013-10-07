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
					key: 'postId',
					includeInJSON: 'id'
				}
			}, {
				type: Backbone.HasMany,
				key: 'votes',
				relatedModel: 'modelVote',
				reverseRelation: {
					key: 'postId',
					includeInJSON: 'id'
				}
			}]
        });
        return Post;
    }
);