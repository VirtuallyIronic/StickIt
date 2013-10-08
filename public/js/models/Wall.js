/**define(['jquery', 'underscore', 'backbone', 'backbone-relational', 'models/Post'],
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
); **/

define(['jquery', 'underscore', 'backbone'],
	function($, _, Backbone) {
		var Wall = Backbone.model.extend({
			urlRoot: '/api/wall',
			idAttribute: 'id',
		});
		return Wall;
	}
);