	function modelInit()
	{
		//_----------------------------
		//TODO
		//REWRITE FOR NEW DATA ENRTY
		//Note Model, handles what data each note contains
		noteFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: function(){
				return {
					'noteId': '',
					'wallId': '',
					'username': '',
					'col': 1,
					'row': 1,
					'text': '',
					'votes': 0,
					'colour': '#FFFFFF',
					'fontsize': 18,
					'stringtag': ''
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
				}
			}]
		});
		//_----------------------------
		//Wall Model, handles what data the wall needs.
		wallFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults:{
					"title": 'NEW WALL',
					'wallID': '',
					'owner': '',
					'cols': 5,
			}
		});
		
		//Column Model, handles data for each column heading.
		colFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: {
					'wallID':'',
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
				}
			}]
		});
		
		//Vote Model, handles what each vote per note.
		voteFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: {
					'voteID': '',
					'noteID': ''
			},
			relations: [{
				type: Backbone.HasOne,
				key: 'votes_note',
				relatedModel: 'noteFormat',
				collectionType: 'noteList',
				reverseRelation: {
					key: 'voteKey',
					includeInJSON: '_id'
				}
			}]
		});
		
		//Tag Model, handles tag data per note.
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
				}
			}]
		});
		
		//Permission Model, handles permission data for each user
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
				}
			}]
		});
		/*
		Collections for each Model data set.
		*/
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