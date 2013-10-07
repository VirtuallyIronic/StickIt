//--------------
/*
**	VERSION 3.3
**	23/09/2013
**	PRE-TESTING
**

/*
	TODO!!!
	FINSIH INTERGRATING RELATIONS
	CHECK IF THERE ARE ANY PROBLEMS WITH NEW AND EDIT NOTES
	NEW VS IMPORTED NOTES
	WALL + PERMISSIONS (LOW PRIORITY)
	TOMORROW ONLY!!!!!!!!

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
	var online = true;
	var admin = false;
	var confirmLogin = false;
	var currentUser_ID = 0;
	var currentUser = "";
	/*NEEDS TO BE DYNAMICALLY UPDATED!*/
	if (location.search == "")
	{
		alert('NO WALL ID');
		var wallID = 1;
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
		initCall();
		var col = parseInt(lanes);
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
		if (confirmLogin == false)
		{
			gridster.disable();
		}

		Backbone.sync = function(method, model) {
			alert(method + ": " + JSON.stringify(model));
			//model.id = 1;
		};
		
		/*noteFormat = Backbone.RelationalModel.extend({
			defaults: function(){
				return {
					'wallID': wallID,
					'authorID': currentUser_ID,
					'authorName': currentUser,
					'col': '1',
					'row': '1',
					'text': '',
					'votes': 0,
					'voted': new Array(),
					'tagged': new Array(),
					'color': '#FFFFFF',
					'fontsize': 18
				}
			}
		});*/
		
		noteFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: function(){
				return {
					'wallID': wallID,
					'authorName': '',
					'col': 1,
					'row': 1,
					'userId': '',
					'userName': '',
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
				key: 'noteR',
				relatedModel: 'wallFormat',
				collectionType: 'wallList',
				reverseRelation: {
					key: 'hasWall',
					includeInJSON: '_id'
					// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
				}
			}],
			url: 'http://localhost:8080/'
			//http://localhost:8080/messages
		});

		wallFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults:{
					"title": 'NEW WALL',
					'wallID': wallID,
					'owner': currentUser_ID,
					'cols': 5,
					'headings': 'String,of,potato chips for lunch,for,headings'
			}/*,
			relations: [{
				type: Backbone.HasMany,
				key: 'wallR',
				relatedModel: 'noteFormat',
				collectionType: 'noteList',
				reverseRelation: {
					key: 'hasNote',
					includeInJSON: '_id'
					// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
				}
			}]*/,
			url: 'http://localhost:8080/'
			//http://localhost:8080/messages
		});
		
		voteFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: {
					'userID': currentUser_ID,
					'noteID': ''//noteID
					//'voteTotal': 0
			},
			relations: [{
				type: Backbone.HasOne,
				key: 'votesR',
				relatedModel: 'noteFormat',
				collectionType: 'noteList',
				reverseRelation: {
					key: 'voteKey',
					includeInJSON: '_id'
					// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
				}
			}],
			url: 'http://localhost:8080/'
			//http://localhost:8080/messages
		});
		taggedFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: {
					//'userID': currentUser_ID,
					'noteID': '',
					//'wallID': wallID,
					'tagItem': ''
			},
			relations: [{
				type: Backbone.HasOne,
				key: 'tagsR',
				relatedModel: 'noteFormat',
				collectionType: 'noteList',
				reverseRelation: {
					key: 'taggedKey',
					includeInJSON: '_id'
					// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
				}
			}],
			url: 'http://localhost:8080/'
			//http://localhost:8080/messages
		});
		permissionFormat = Backbone.RelationalModel.extend({
			idAttribute: '_id',
			defaults: {
					'userID': currentUser_ID,
					//'wallID': wallID,
					'permission': 'read',

			},
			relations: [{
				type: Backbone.HasOne,
				key: 'permissionR',
				relatedModel: 'wallFormat',
				collectionType: 'wallList',
				reverseRelation: {
					key: 'hasPermission',
					includeInJSON: '_id'
					// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
				}
			}],
			url: 'http://localhost:8080/'
			//http://localhost:8080/messages
		});
		
		noteList = Backbone.Collection.extend({
			model: noteFormat,
			url: 'http://localhost:8080'
		});			
		wallList = Backbone.Collection.extend({
			model: wallFormat,
			url: 'http://localhost:8080'
		});	
		permissionList = Backbone.Collection.extend({
			model: permissionFormat,
			url: 'http://localhost:8080'
		});	
		votingList = Backbone.Collection.extend({
			model: voteFormat,
			url: 'http://localhost:8080'
		});
		tagList = Backbone.Collection.extend({
			model: taggedFormat,
			url: 'http://localhost:8080'
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
				if(options.newNoteInput == true)
				{
					//alert('new tags');
					this.incTagData = options.incTags;
					//alert(this.incTagData);
				}
				else
				{
					this.incTagData = false;
					//alert('NO new tags');
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
						alert(this.incTagData[k]);
						//var item = new noteFormat(notes[w]);
						var addTags = new taggedFormat(/*this.incTagData[k]*/);
						addTags.set({
							'noteID': this.model.get('id'),
							'tagItem': this.incTagData[k].get('tagItem')
						});
						this.tagging.add(addTags);
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
				//--------DEMO SETUP TODO-----------
				testWall = new wallFormat();
				testPer = new permissionFormat();
							//	noteFormat wallFormat	
				testWall.set({
					"title": 'A WALL',
					'wallID': 1,
					'owner': 1,
					'cols': col,
					'headings': 'String,of,words,for,headings',
				});
				this.wallDetails.add(testWall);
				
				testPer.set({
					"userID": currentUser_ID,
					'permission': 'admin',
				});
				this.permissionDetails.add(testPer);
				//-------------------------
				document.title = testWall.get('title');
				var n=testWall.get('headings').split(","); 
				for (var i=0; i<testWall.get('cols'); i++)
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
					$($tSpan).text(n[i]);
					//$($tSpan).text(wallHeadings[i]);
					//--- attempt to put the title inside a <p> tag. ---
					$("<p>").appendTo($headDetails);
					
					$($tSpan).appendTo($headDetails);
					var varvar = i+1
					//if (admin == true)
					//{
						$("<button value="+i+" onclick='deleteThisLane(this)' class='deleteLane'>DELETE LANES</button>").appendTo($headDetails);
						$("<button value="+i+" onclick='editLane(this)' class='editLaneBut'>EDIT LANES</button>").appendTo($headDetails);
						
						//$('#confirmPopup').on('click', this.prepareItem);
						//listView.trigger('newNote');
						//$('#confirmPopup').on('click', this.prepareItem);
						//listView.trigger('newNote');
					//}
				}
				if (testPer.get('permission') != 'admin')//false)
				{
					$('.deleteLane').each(function(  ) {
						$(this).hide();
					});
					$('.editLaneBut').each(function(  ) {
						$(this).hide();
					});
				}
				
				if (online == true){
					for (var w=0; w<notes.length; w++)
					{
						var item = new noteFormat(notes[w]);
						/*for (var e=0; e<votesInput.length; e++)
						{
							newVotes = new voteFormat;
							newVotes.set({
								'noteID': item.get.('id');
							});
							this.voting.add(newVotes);
						}
						for (var e=0; e<votesInput.length; e++)
						{
							newTags = new taggedFormat;
							newTags.set({
								'noteID': item.get.('id');
							});
							this.tags.add(newTags);
						}
						/*item.set({
							'col': notes[w].col,
							'row': notes[w].row,
							'text': notes[w].text
							// modify item defaults
						});*/
						this.collection.add(item);
					}
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
						'hasWall': testWall
					});
					tagObj = new Array;
					var tagCount=0;
					for (var i=1; i<tagSize; i=i+3)
					{
						
						var newNoteTags = new taggedFormat();
						newNoteTags.set({
							'noteID': item.get('id'),
							'tagItem': $(tags).children().eq(i).text()
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
				var objdata = true;
				if (tagObj.length != 0)
				{
					alert(tagObj.length);
					objdata = true;
				}
				else
				{
					objdata = false;
				}
				var itemView = new ItemView({
					model: item,
					voteModel: votingList,
					tagModel: tagList,
					newNoteInput: objdata,
					incTags: tagObj
				});
				var newWidget = itemView.render().el;
					
				gridster.add_widget(newWidget, 1, 1, col, row);
			}
		});

		//listView = new ListView();
		listView = new ListView({
			noteModel: noteList, 
			wallModel: wallList, 
			permissionModel: permissionList
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