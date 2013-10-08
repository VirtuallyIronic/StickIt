	function modelInit()
	{
	noteFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: function(){
				return {
					'noteId': '',
					'wallId': '',//initWall.id,
					'username': '',
					'col': 1,
					'row': 1,
					'text': '',
					'votes': 0,
					'colour': '#FFFFFF',
					'fontsize': 18
				}
			},
			relations: [{
				type: Backbone.HasOne,
				key: 'wall_connection',
				relatedModel: 'wallFormat',
				collectionType: 'wallList',
				reverseRelation: {
					key: 'note_wall',
					includeInJSON: '_id'
					// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
				}
			}]
		});

		wallFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults:{
					"title": 'NEW WALL',
					'wallID': '',//initWall.id,
					'owner': '',//initWall.owner,
					'cols': 5,
			}
		});
		
		colFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: {
					'wallID':'',// initWall.id,
					'colID': 0,
					'heading': 'Lane :id'
			},
			relations: [{
				type: Backbone.HasOne,
				key: 'col_wall',
				relatedModel: 'wallFormat',
				collectionType: 'wallList',
				reverseRelation: {
					key: 'colKey',
					includeInJSON: '_id'
					// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
				}
			}]
		});
		voteFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: {
					'voteID': '',
					'noteID': ''//noteID
			},
			relations: [{
				type: Backbone.HasOne,
				key: 'votes_note',
				relatedModel: 'noteFormat',
				collectionType: 'noteList',
				reverseRelation: {
					key: 'voteKey',
					includeInJSON: '_id'
					// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
				}
			}]
		});
		taggedFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: {
					'tagID':'',
					'noteID': '',
					'tagItem': ''
			},
			relations: [{
				type: Backbone.HasOne,
				key: 'tags_note',
				relatedModel: 'noteFormat',
				collectionType: 'noteList',
				reverseRelation: {
					key: 'taggedKey',
					includeInJSON: '_id'
					// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
				}
			}]
		});
		permissionFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: {
					'userID': '',
					'permission': 'read',

			},
			relations: [{
				type: Backbone.HasOne,
				key: 'user_wall',
				relatedModel: 'wallFormat',
				collectionType: 'wallList',
				reverseRelation: {
					key: 'hasPermission',
					includeInJSON: '_id'
					// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
				}
			}]
		});
		
		noteList = Backbone.Collection.extend({
			model: noteFormat
		});			
		wallList = Backbone.Collection.extend({
			model: wallFormat
		});
		colList = Backbone.Collection.extend({
			model: colFormat
		});		
		permissionList = Backbone.Collection.extend({
			model: permissionFormat
		});	
		votingList = Backbone.Collection.extend({
			model: voteFormat
		});
		tagList = Backbone.Collection.extend({
			model: taggedFormat
		});
	}