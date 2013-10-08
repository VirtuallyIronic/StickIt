//--------------
/*
**	VERSION 3.3
**	23/09/2013
**	PRE-TESTING
**

/*
	TODO!!!
	CREATE APPROPRIATE MODELS TO INTERACT WITH NEW AJAX COMMANDS

*-----

**	--FEATURES--
**		GRIDSTER INITIALISATION
**		BACKBONE INITILISATION
**			- MODEL DECALRED
**				- DEFAULTS SET
**			- COLLECTION OF MODELS
**			- NOTE VIEWS
**				- CONTROLS EACH NOTE ELEMENT
**			- WALL VIEWS
**				- CONTROLS WALL AND NOTE SETUP
**
**	--MISSING--
**		BACKBONE.SYNC
**		  -BACKBONE.SYNC WILL SPEED UP SERVER REQUESTS. 
**		  -STILL INVESTIGATING.
**		FORMATTING OF NOTES
**			-ADDITIONAL STYLE, COLOURS AND FONTS
**		USER PERMISSIONS
**			- TAGS CHECKING IF USER EXISTS
**			- ADMIN RIGHTS (!!)
**		CHROME ISSUES
**			- PARTIALLY SOLVED	
**
*/
//--------------

	var gridster;
	var lanes;
	var notes;
	var wallHeadings = new Array();
	var globalData = {};
	var initWall;
	var online = false;
	var admin = false;
	var permission = 'read'
	var confirmLogin = false;
	var currentUser_ID = 0;
	var currentUser = "";
	var wallID;
	/*NEEDS TO BE DYNAMICALLY UPDATED!*/
	if (location.search == "")
	{
		//alert('NO WALL ID');
		wallID = "eJU6kroyQ";
	}
	else
	{
		var searchString = location.search;
		var n=searchString.split("");
		var test = parseInt(n[1]);
		var wallID = test;
		alert('WALL ID IS: '+wallID);
	}
	/*--------------------------------*/
	$(function(){
		var initialData = wallGet(wallID);
		if (initialData.status != false)
		{
			initWall = initialData.data;
			confirmLogin == true;
		}
		else
		{
			initWall = initialData.data;
			if (initWall.permission == 'admin')
			{
				admin = true;
				confirmLogin = true;
				permission = 'admin';
			}
			else if (initWall.permission == 'post')
			{
				admin = false;
				confirmLogin = true;
				permission = 'post'
			}
			else
			{
				admin = false;
				confirmLogin = false;
				permission = 'read'
			}			
		}
		
		var col = parseInt(initWall.totalCols);
		gridster = $(".gridster ul").gridster({
			//widget_selector: "li",
			widget_margins: [20, 30], 
			widget_base_dimensions: [200, 250],
			avoid_overlapped_widgets: true,
			min_cols: col,
			max_cols: col,
			autogenerate_stylesheet: true,
			draggable: {
				stop: function(event, ui){
					var temp = this.$helper.context;					
					var cul = this.$helper.context.attributes[2].nodeValue;
					var row = this.$helper.context.attributes[3].nodeValue;
					globalData[0] = cul;
					//alert(cul);
					globalData[1] = row;
					$(temp).trigger('custom');//, [cul, row]);
				}
			}
		}).data('gridster');
		if (confirmLogin == false || permission == 'read')
		{
			gridster.disable();
		}
				
		noteFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: function(){
				return {
					'noteId': '',
					'wallId': initWall.id,
					'username': '',
					'col': 1,
					'row': 1,
					'text': '',
					'votes': 0,
					/*REMOVE*/'voted': new Array(),
					/*REMOVE*/'tagged': new Array(),
					'colour-note': '#FFFFFF',
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
					'wallID': initWall.id,
					'owner': initWall.owner,
					'cols': 5,
			}
		});
		
		colFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: {
					'wallID': initWall.id,
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

		//------VIEW HANDLER FOR NOTES--------
		ItemView = Backbone.View.extend({
			tagName: 'div', // name of tag to be created
			className: 'note',
			
			// `ItemView`s now respond to two clickable actions for each `Item`: swap and delete.
			events: {
				'click button.deleteButton': 'remove',//'remove',
				'click button.editButton': 'editMe',
				'click button.expandButton': 'expanding',
				'click button.voteButton': 'voting',
				'click button.removeVoteButton': 'cancelVote'
			},
			
			// `initialize()` now binds model change/removal to the corresponding handlers below.
			initialize: function(options){
				// every function that uses 'this' as the current object should be in here
				_.bindAll(this, 'render','editMe', 'cancelVote', 'unrender','addNewTag','voting','moveNote','removenoprompt','updatePos','processing', 'remove', 'expanding');
				this.model = options.model;
				this.model.bind('remove', this.unrender);
				this.voteObj = new options.voteModel;
				this.tagging = new options.tagModel;
				//this.newNoteStatus = 
				if(options.newNoteInput == 'tv')
				{
					this.incTagData = options.incTags;
					this.incVoteData = options.incVotes;
				}
				else if(options.newNoteInput == 'tf')
				{
					this.incTagData = options.incTags;
					this.incVoteData = false;
				}
				else if(options.newNoteInput == 'fv')
				{
					this.incTagData = false;
					this.incVoteData = options.incVotes;
				}
				else
				{
					this.incTagData = false;
					this.incVoteData = false;
				}

				this.model.on('laneRemove', this.removenoprompt);
				this.model.on('moveNote', this.moveNote);
				$(this.$el).on('custom', this.updatePos);
			},
			
			//------CREATES A NEW NOTE--------
			render: function(){
				if (this.incTagData != false)
				{
					//alert(this.incTagData);
					for (var k=0; k<this.incTagData.length; k++)
					{
						var addTags = new taggedFormat();
						addTags.set({
							'noteID': this.model.get('id'),
							'tagItem': this.incTagData[k].get('tagItem')
						});
						this.tagging.add(addTags);
					}
				}
				
				if (this.incVoteData != false)
				{
					for (var k=0; k<this.incVoteData.length; k++)
					{
						var addVotes = new voteFormat();
						addVotes.set({
							'noteID': this.incVoteData[k].get('noteID'),
							'votes_note': this.incVoteData[k].get('votes_note'),
						});
						this.voteObj.add(addVotes);
					}
				}
				
				Note(this);
				return this; // for chainable calls, like .render().el
			},
			
			//------OPENS EXPANDED TEXT BOX--------
			expanding: function(){
				//var asdasd = this.model.toJSON();
				expandNote(this);
			},

			addNewTag: function(e){
				var tags = this.model.get('tagged');
				var tagName = $(e.target).parent().children('.userText').val();
				var tagSize = _.size(tags);//.length;
				if (tagSize === 0)
				{
					tags[0] = tagName;
				}
				else
				{
					tags[tagSize] = tagName;
				}
				this.model.set('tagged',tags);
				$("<span>TAGGED: </span><span class='taggedUser'> "+tags[tagSize]+"</span><br/>").appendTo(".popupMenu");
			},
			
			//------+1 Vote--------
			voting: function(){
				if (confirmLogin == true)
				{
					var votes = this.model.get('votes');
					votes = (parseInt(votes)+1);//.toString();
					var voted = this.model.get('voted');
					var tat = _.size(voted);//.length;
					if (tat === 0)
					{
						voted[0] = currentUser;
					}
					else
					{
						voted[tat] = currentUser;
					}

					this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan").children().remove();
					$("<button class='removeVoteButton'> -1 </button>").appendTo($(this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan")));
					////.remove();
					this.$el.children('.cssnote').children(".toolbar").children("#votespan").text('Votes: '+votes+'  .');
					
					
					this.model.set({
						'votes': votes,
						'voted': voted
						// modify item defaults
					});
					
					var voteSearch = this.voteObj.where({'userID':currentUser_ID, 'noteID': this.model.get('id')});
					//alert(voteSearch.length);
					if (voteSearch.length == 0)
					{
						var newVotings = new voteFormat();
						newVotings.set({
							'userID': currentUser_ID,
							'noteID': this.model.get('_id'),//noteID
							'votes_note': this.model
						});
						this.voteObj.add(newVotings);
					}
					else
					{
						//VOTING ERROR
						//alert('error');
					}
					//TODO
					//SERVER UPDATE NOTE
					//updateNote(this.model);
					//this.model.trigger('updateServer');	
				}				
				else
				{
					alert('PLEASE LOG IN');
				}
			},

			cancelVote: function(){
				if (confirmLogin == true)
				{
					var changed =0;
					var votes = this.model.get('votes');
					
					var voted = this.model.get('voted');
					var tat = _.size(voted);//.length;
					for (var i=0; i<tat; i++)
					{
						if (voted[i] == currentUser)
						{
							voted.splice(i,1);
							changed++;
						}
					}
					this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan").children().remove();
					$("<button class='voteButton'> +1 </button>").appendTo($(this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan")));
					if (changed > 0)
					{
						votes = (votes-1);
						this.model.set('votes', votes);
						this.model.set('voted', voted);
						this.$el.children('.cssnote').children(".toolbar").children("#votespan").text('Votes: '+votes+'  .');
						//TODO
						//SERVER UPDATE NOTE
						//updateNote(this.model);
						//this.model.trigger('updateServer');		
					}
					
					var voteSearch = this.voteObj.where({'userID':currentUser_ID, 'noteID': this.model.get('id')});
					//alert(voteSearch.length);
					if (voteSearch.length != 0)
					{
						for (var q=0; q<voteSearch.length; q++)
						{
							//alert(voteSearch[q].get('userID'));
							voteSearch[q].destroy();
						}
					}
					else
					{
						//VOTING ERROR
						//alert('error');
					}
				}				
				else
				{
					alert('PLEASE LOG IN');
				}
			},
			
			//------OPENS EDIT MENU--------
			editMe: function(){
				if (confirmLogin == true)
				{
					popMenu(this);
				}
				else
				{
					alert('PLEASE LOG IN');
				}
			},
			
			//------AFTER DELETE PROMPT, REMOVE NOTE WIDGET--------
			unrender: function(){
				removeWidgets($(this.el));
				//this.model.trigger('updateServer');
			},
			
			//------AFTER DRAG,CHANGES MODEL DATA--------
			updatePos: function(e){
				var newCol = globalData[0];
				//alert(newCol);
				var newRow = globalData[1];
				this.model.set('col', newCol);
				this.model.set('row', newRow);
				globalData = {};
				
				if (confirmLogin == true)
				{
					//TODO
					//SERVER UPDATE NOTE
					//updateNote(this.model);
				}
				else
				{
					alert('PLEASE LOG IN');
				}
				//this.model.trigger('updateServer');
			},
			
			//------AFTER EDIT, CHANGES MODEL DATA--------
			processing: function(){
				var data = confirmEdit(this);
				if (data != null)
				{
					var textEdit = data[0];
					var colour = data[1];
					var fontsize = data[2];
					var tags = data[3];
					this.$el.children('.cssnote').children('.edit').children(".editSpan").text(textEdit);
					linkify(this.$el.children('.cssnote').children('.edit').children(".editSpan"));
					/*this.$el.children('.edit').children(".editSpan").text( textEdit);
					linkify(this.$el.children('.edit').children(".editSpan"));*/
					//$($note).css("background-color", input.model.get('colour'));
					
					//this.$el.children('.cssnote').css('background-color', colour);
					this.$el.css('background-color', colour);
					
					//colour = this.$el.children('.cssnote').css('background-color');
					//this.model.set('colour', colour);
					var fontColour = getContrastYIQ(colour);
					var newColour = getTintedColor(colour, -75);
					this.$el.children('.cssnote').children('.dragbar').css('background-color', newColour);					
					this.$el.children('.cssnote').children('.toolbar').css('background-color', newColour);
					this.$el.children('.cssnote').children('.edit').children('.editSpan').css('fontsize', fontsize+"px");
					this.$el.children('.cssnote').children('.edit').children('.editSpan').css('color', fontColour);
					
					//this.model.set('fontsize', fontsize);
					//this.model.set('text', textEdit);
					if (tags != 0)
					{
						var oldTags = this.model.get('tagged');
						var newTags = oldTags.concat(tags);

						for (var k=0; k<tags.length; k++)
						{
							var addTags = new taggedFormat();
							addTags.set({
								'noteID': this.model.get('id'),
								'tagItem': tags[k]
							});
							this.tagging.add(addTags);
						}

						this.model.set({
							'tagged': newTags,
							'text': textEdit,
							'fontsize': fontsize,
							'color': colour
							// modify item defaults
						});
						//this.model.set('tagged',newTags);
					}
					else
					{
						this.model.set({
							'text': textEdit,
							'fontsize': fontsize,
							'color': colour
							// modify item defaults
						});
					}
					closeMenu();
					//TODO
					//SERVER UPDATE NOTE
					//updateNote(this.model);
					//this.model.trigger('updateServer');
				}
				else
				{
					closeMenu();
				}
			},
			
			// CHECKS IF THE USER WANTS TO DELETE NOTE
			remove: function(){
				if (confirmLogin == true)
				{
					var r=confirm("Delete note?");
					if (r==true)
					{
						//TODO
						//SERVER UPDATE NOTE
						//removeNote(this.model);
						this.model.destroy();
						//this.model.set('col', oldCol);
					}	
				}
				else
				{
					alert('PLEASE LOG IN');
				}		
			},
			
			//------LANE DELETION FUNCTION -NOTE --------
			removenoprompt: function(){
				this.model.destroy();
			},
			
			//------Moves Note Data to the left--------
			moveNote: function(){
				var oldCol = this.model.get('col');
				oldCol = (oldCol-1).toString();
				this.model.set('col', oldCol);
			}

		});

		// Wall View Handler
		ListView = Backbone.View.extend({
			el: $('.wall'), // el attaches to existing element
			
			//------LISTENERS--------
			events: {
				'click button#add': 'addItem',
				'click button#confirmPopup': 'prepareItem',
				'click button.deleteLane': 'removeLane',
				//'click button.editLaneBut': 'editTitle'
				'click button#editLB': 'editTitle'
				//editLB
			},
			
			//-------SETS UP ALL LISTENERS AND PROCESSES-------
			initialize: function(options){
				_.bindAll(this, 'render', 'addItem', 'purgeData', 'editTitle', 'serverUpdate', 'removeLane', 'appendItem','prepareItem'); // every function that uses 'this' as the current object should be in here
				//this.collection = new noteList();
				this.collection = new options.noteModel;//new noteList();
				this.wallDetails = new options.wallModel;
				this.permissionDetails = new options.permissionModel;
				this.colDetails = new options.colModel;
				this.collection.bind('add', this.appendItem); // collection event binder
				this.collection.bind('updateServer', this.serverUpdate);
				this.on('newNote', this.addItem);
				this.on('completeDelete', this.purgeData);
				this.on('prepareLaneDelete', this.removeLane);
				this.render();
			},
			
			//-------CREATES INITIAL OBJECTS-------
			render: function(){
				var self = this;
				console.log(this.model+" KIRK TEST");
				//--------DEMO SETUP TODO-----------
				wallModel_current = new wallFormat();
				wallModel_current.set({
					"title": initWall.title,
					'wallID': initWall.id,
					'owner': initWall.owner,
					'cols': initWall.totalCols,
				});
				this.wallDetails.add(wallModel_current);
				
				userPer = new permissionFormat();
				userPer.set({
					'permission': initWall.permission,
					'user_wall': wallModel_current,
				});
				this.permissionDetails.add(userPer);
				
				for (var i=0; i<initWall.cols.length; i++)
				{
					wallColData = new colFormat();
					wallColData.set({
						'wallID': initWall.cols[i].wallId,
						'colID': initWall.cols[i].id,
						'heading': initWall.cols[i].title,
						'col_wall': wallModel_current
					});
					this.colDetails.add(wallColData);
				}
				//-------------------------
				document.title = wallModel_current.get('title');
				//var n=wallModel_current.get('headings').split(","); 
				for (var i=0; i<this.colDetails.length; i++)
				{
					var $laneHead = jQuery('<li/>', {
						class: 'titleDisplay'
					});
					$($laneHead).appendTo("#laneHeadings");
					
					var $headDetails = jQuery('<div/>', {
						class: 'laneTitle'
					});
					$($headDetails).appendTo($laneHead);
					var $tSpan = jQuery('<span/>', {
						class:'titleSpan',
					});

					$($tSpan).text(this.colDetails.models[i].get('heading'));
					//--- attempt to put the title inside a <p> tag. ---
					$("<p>").appendTo($headDetails);
					
					$($tSpan).appendTo($headDetails);
					var varvar = i+1
					$("<button value="+this.colDetails.models[i].get('colID')+" onclick='deleteThisLane(this)' class='deleteLane'>DELETE LANES</button>").appendTo($headDetails);
					$("<button value="+this.colDetails.models[i].get('colID')+" onclick='editLane(this)' class='editLaneBut'>EDIT LANES</button>").appendTo($headDetails);
				}
				if (userPer.get('permission') != 'admin')//false)
				{
					$('.deleteLane').each(function(  ) {
						$(this).hide();
					});
					$('.editLaneBut').each(function(  ) {
						$(this).hide();
					});
				}
				//alert(this.//);
				var postObj = initWall.posts
				tagObj = new Array;
				voteObj = new Array;
				for (var w=0; w<postObj.length; w++)
				{				
					var item = new noteFormat();
					var objCount = 0;
					for (var v=0; v<postObj[w].vote.length; v++)
					{
						var newVotes = new voteFormat();
						newVotes.set({
							'noteID': postObj[w].vote[v].noteID,
							'votes_note': item
						});
						voteObj[objCount] = newVotes;
						objCount++;
					}
					objCount = 0;
					for (var t=0; t<postObj[w].tag.length; t++)
					{
						var newTags = new taggedFormat();
						var test = postObj[w].tag[t];
						newTags.set({
							'noteID': postObj[w].tag[t].noteID,
							'tagItem': postObj[w].tag[t].tagItem,
							'tags_note': item
						});
						tagObj[objCount] = newTags;
						objCount++;
					}
					item.set({
						'col':postObj[w].col,
						'row':postObj[w].row,
						'noteId':postObj[w].id,
						'wallId':postObj[w].wallId,
						'username':postObj[w].username,
						'text': postObj[w].text,
						'votes': postObj[w].vote.length,
						'color': postObj[w].colour,
						'fontsize': postObj[w].fontSize,
						'wall_connection': wallModel_current
					});
					this.collection.add(item);
				}
			},
			
			serverUpdate: function(){
				if (online == true)
				{
					var noteJSON = this.collection.toJSON();					
					dataUpdate(noteJSON);
				}
			},
			
			editTitle: function(ev){
				var i = $(ev.target).val();
				var fname=prompt("New Lane Title",$(ev.target).parent().children('.titleSpan').text());
				if (fname != 'null' && fname != 'undefinded' && fname != "")
				{
					wallHeadings[i] = fname;
					$(ev.target).parent().children('.titleSpan').text(fname);
					alert(wallHeadings);
				}				
			},
			
			//------OPENS NEW NOTE MENU--------
			addItem: function(){
				if (confirmLogin == true)
				{
					popMenu(this);
				}
				else
				{
					alert('PLEASE LOG IN');
				}
			},
			
			//-------DELETES A COLUMN OF NOTES AND MOVES REST TO THE LEFT-------
			removeLane: function(ev){
				var a = 1;
				//if (online == true)
				if (a == 1)
				{
					var r=confirm("Delete lane? ");
					if (r==true)
					{
						var colID = $(ev).val();
						
						//NEED TO UPDATE THIS TO THE BACKEND!
						wallHeadings.splice(colID,1);
						
						var notesEdited = 0;
						var idCount = parseInt(colID);
						idCount = idCount+1;
						colID = idCount.toString();
						for (var q=idCount; q<=lanes;q++)
						{
							if (q==idCount)
							{
								var colData = this.collection.where({'col': colID});
								for (var i=0; i<colData.length; i++)
								{
									notesEdited++;
									var testing = colData[i];
									testing.trigger('laneRemove');
								}
							}
							else
							{
								var colPos = q.toString();
								var colMove = this.collection.where({'col': colPos});
								for (var i=0; i<colMove.length; i++)
								{
									//Move all notes to the left.
									notesEdited++;
									var moveNote = colMove[i];
									moveNote.trigger('moveNote');
								}
							}
						}
						if (notesEdited > 0)
						{
							var colMove = this.collection.where({'wallID': wallID});
							updateNote(colMove);
							//this.serverUpdate();
						}
						
						
						//remove Heading  --  unneeded
						$(ev).parent().children('.titleSpan').html("DELETED");
						$(ev).remove();
						
						//AJAX: SET SERVER COL NUMBER TO 1 LESS
						//l editWall();
					}
				}
				else
				{
					alert('Currently Offline');
				}
			},
			
			purgeData: function(){
			
				this.collection.each(function(model) 
				{ 
					//removeNote(model);
					model.destroy(); 
				});
				//delete ALL note AJAX   search tag: TODO
			},
			
			//-------GETS DATA FROM DIV MENU FOR NEW NOTE-------
			prepareItem: function(){
				//MAY REQUIRE REWRITE DUE TO MODEL CHANGES!
				//TODO
				if (confirm('Confirm new Note?')) 
				{   
					var col = document.getElementById('laneDrop').value;
					var row = 1;
					var text = document.getElementById('formText').value;
					var colour = document.getElementById('colourDrop').value;
					var fontsize = document.getElementById('sizeDrop').value;
					var tags = document.getElementById('newTags');
					var tagged = new Array();
					var tagSize = $(tags).children().length;
					var count = 0;

					for (var i=1; i<tagSize; i=i+3)
					{
						tagged[count] = $(tags).children().eq(i).text();
						count=count+1;
					}
					//ELEPHANT

					
					while (gridster.is_widget(col,row))
					{
						++row;
					};
					
					var item = new noteFormat();
					item.set({
						'col': col,
						'row': row,
						'userId':currentUser_ID,
						'userName':currentUser,
						'text': text,
						'tagged': tagged,
						'color': colour,
						'fontsize': fontsize,
						//'taggedKey'
						'wall_connection': wallModel_current//.get('_id')
					});
					tagObj = new Array;
					var tagCount=0;
					for (var i=1; i<tagSize; i=i+3)
					{
						
						var newNoteTags = new taggedFormat();
						newNoteTags.set({
							'noteID': item.get('id'),
							'tagItem': $(tags).children().eq(i).text(),
							'tags_note': item,
						});
						
						tagObj[tagCount]=newNoteTags;
						tagCount++;
						//this.tagging.add(newNoteTags);
					}
					this.collection.add(item);
					////newInsert(item);
				}
				closeMenu();
			},
			
			//-------ADDS WIDGET TO GRIDSTER GRID-------
			appendItem: function(item){
				var col = item.get('col');
				var row = item.get('row');
				var objdata ='';
				if (tagObj.length != 0)
				{
					//alert(tagObj.length);
					objdata += 't';
				}
				else
				{
					objdata += 'f';
				}
				if (voteObj.length != 0)
				{
					//alert(tagObj.length);
					objdata += 'v';
				}
				else
				{
					objdata += 'f';
				}
				var itemView = new ItemView({
					model: item,
					voteModel: votingList,
					tagModel: tagList,
					newNoteInput: objdata,
					incTags: tagObj,
					incVotes: voteObj
				});
				var newWidget = itemView.render().el;
					
				gridster.add_widget(newWidget, 1, 1, col, row);
			}
		});

		//listView = new ListView();
		listView = new ListView({
			noteModel: noteList, 
			wallModel: wallList, 
			permissionModel: permissionList,
			colModel: colList
		});
	});
	
	function deleteThisLane(input)
	{
		listView.trigger('prepareLaneDelete',input);
	}
	
	function editLane(input)
	{
		//listView.trigger('editTitle');
		var i = $(input).val();
		var fname=prompt("New Lane Title",$(input).parent().children('.titleSpan').text());
		if (fname != 'null' && fname != 'undefinded' && fname != "")
		{
			wallHeadings[i] = fname;
			$(input).parent().children('.titleSpan').text(fname);
			//function trigger passing wallHeadings to update this wall data.
		}
		alert(input);
	}