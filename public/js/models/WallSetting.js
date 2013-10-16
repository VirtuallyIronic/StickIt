
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/views/footer/footerView.js
 * Purpose:			Marionette View Page for the Footer Region.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var WallUpdate = Backbone.Model.extend({
			urlRoot: '/api/wall',
            idAttribute: 'id'
        });
        return WallUpdate;
    }
);