define(['jquery', 'underscore', 'backbone', 'backbone-relational', 'models/Post'],
	function ($, _, Backbone, Relational, modelPost) {
		var Wall = Backbone.RelationalModel.extend({
			urlRoot: '/api/wall',
			idAttribute: 'id',
			relations: [{
				type: Backbone.HasMany,
				key: 'posts',
				relatedModel: modelPost,
				reverseRelation: {
					key: 'wallId',
					includeInJSON: 'id'
				}
			}]
        });
        return Wall;
    }
);