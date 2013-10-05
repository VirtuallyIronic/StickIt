define(['jquery', 'underscore', 'backbone', 'backbone-relational'],
	function ($, _, Backbone, Relational) {
		var Tag = Backbone.RelationalModel.extend({
            url: '/api/tag',
            idAttribute: 'id'
        });
        return Tag;
    }
);