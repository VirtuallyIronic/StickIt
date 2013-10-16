
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/models/WallList.js
 * Purpose:			Backbone Model for the List of Walls Object recieved from server.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

define(['jquery', 'underscore', 'backbone'],
	function ($, _, Backbone) {
		var WallList = Backbone.Model.extend({
			initialize:function () {
			},
            url: '/api/wall'
        });
        return WallList;
    }
);