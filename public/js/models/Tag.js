define(['jquery', 'underscore', 'backbone', 'backbone-relational'],
	function ($, _, Backbone, Relational) {
		var Vote = Backbone.RelationalModel.extend({
            url: '/api/vote',
            idAttribute: 'id'
        });
        return Vote;
    }
);