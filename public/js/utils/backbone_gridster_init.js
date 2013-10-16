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
	var globalData = new Array;
	var initWall;
	var online = false;
	var admin = false;
	var permission = 'read'
	var confirmLogin = false;
	var currentUser_ID = 0;
	var currentUser = "";
	var newNoteInc = false;
	/*NEEDS TO BE DYNAMICALLY UPDATED!*/
	if (location.search == "")
	{
		console.log('NO WALL ID');
		var wallID = 'eJU6kroyQ';
	}
	else
	{
		var searchString = location.search;
		var n=searchString.split("?");
		var test = n[1];
		var wallID = test;
		console.log('WALL ID IS: '+wallID);
	}
	/*--------------------------------*/
	$(function(){
		var initialData = wallGet(wallID);
		evan_data = initialData.data;		
		initWall = initialData.data;		

		modelInit();
		enableItemView();
		
		setInterval(function(){
			location.reload();
		}, 60000);
		
		// Wall View Handler
		ListView = Backbone.View.extend({
			el: $('.wall'), // el attaches to existing element
			
			//------LISTENERS--------
			events: {
				'click button#add': 'addItem',
				'click button#confirmPopup': 'prepareItem',
				'click button.deleteLane': 'removeLane',
				//'click button.editLaneBut': 'editTitle'
				'click button#editLB': 'editTitle',
				'click button#newLaneBut': 'moreLanes'
				//editLB
			},
			
			//-------SETS UP ALL LISTENERS AND PROCESSES-------
			initialize: function(options){
				_.bindAll(this, 'render', 'addItem', 'removeTag', 'moreLanes','purgeData', 'editTitle', 'serverUpdate', 'removeLane', 'appendItem','prepareItem'); // every function that uses 'this' as the current object should be in here
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
				this.on('RIPtag', this.removeTag);
				this.render();
			},
			
			//-------CREATES INITIAL OBJECTS-------
			render: function(){
				var self = this;
				console.log(this.model+" KIRK TEST");
				lanes = initWall.totalCols;
				plzwork();
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
					wallHeadings[i] = this.colDetails.models[i].get('heading');
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
							'voteID': postObj[w].vote[v].voteID,
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
							'tagID': postObj[w].tag[t].tagID,
							'noteID': postObj[w].tag[t].noteID,
							'tagItem': postObj[w].tag[t].tagItem,
							'tags_note': item
						});
						tagObj[objCount] = newTags;
						objCount++;
					}
					var newcolour = converstionCheck(postObj[w].colour);
					item.set({
						'col':postObj[w].col,
						'row':postObj[w].row,
						'noteId':postObj[w].id,
						'wallId':postObj[w].wallId,
						'username':postObj[w].username,
						'text': postObj[w].text,
						'votes': postObj[w].vote.length,
						'color': newcolour,
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
			removeTag: function(){
				//alert(tagid);
				//this.
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
			moreLanes: function(){
				alert('');
				addLanes();
			},
			//-------DELETES A COLUMN OF NOTES AND MOVES REST TO THE LEFT-------
			removeLane: function(ev){
					var r=confirm("Delete lane? ");
					if (r==true)
					{
						var colID = $(ev).val();
						colDelete(colID);
						//NEED TO UPDATE THIS TO THE BACKEND!
						wallHeadings.splice(colID,1);
						
						var notesEdited = 0;
						var idCount = parseInt(colID);
						for (var q=idCount; q<=lanes;q++)
						{
							if (q==idCount)
							{
								var colData = this.collection.where({'col': idCount});
								for (var i=0; i<colData.length; i++)
								{
									notesEdited++;
									var testing = colData[i];
									testing.trigger('laneRemove');
								}
							}
							else
							{
								var colPos = q;//.toString();
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
						//remove Heading  --  unneeded
						$(ev).parent().children('.titleSpan').html("DELETED");
						$(ev).remove();
						//pagerefresh
					}
				
			},
			
			purgeData: function(){
			
				this.collection.each(function(model) 
				{ 
					//removeNote(model);
					note_Delete(model.get('noteId'));
					model.destroy(); 
				});
				//delete ALL note AJAX   search tag: TODO
			},
			
			//-------GETS DATA FROM DIV MENU FOR NEW NOTE-------
			prepareItem: function(){
				//MAY REQUIRE REWRITE DUE TO MODEL CHANGES!
				//TODO
				newNoteInc = true;
				if (confirm('Confirm new Note?')) 
				{   
					var col = document.getElementById('laneDrop').value;
					var row = 1;
					var text = document.getElementById('formText').value;
					var colour = document.getElementById('mainMenu').tempColour;
					colour = converstionCheck(colour);
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
					
					while (gridster.is_widget(col,row))
					{
						++row;
					};
					
					var item = new noteFormat();
					item.set({
						'wallId': wallColData.get('wallID'),
						'col': col,
						'row': row,
						'userId':currentUser_ID,
						'userName':currentUser,
						'text': text,
						'colour': colour,
						'fontsize': fontsize,
						'wall_connection': wallModel_current//.get('_id')
					});
					tagObj = new Array;
					var tagCount=0;
					for (var i=1; i<tagSize; i=i+3)
					{
						var newNoteTags = new taggedFormat();
						newNoteTags.set({
							'tagID': Math.floor((Math.random()*100)+1),
							'noteID': item.get('id'),
							'tagItem': $(tags).children().eq(i).text(),
							'tags_note': item,
						});
						
						tagObj[tagCount]=newNoteTags;
						tagCount++;
						//this.tagging.add(newNoteTags);
					}
					
					this.collection.add(item);
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
					newNote: newNoteInc,
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
		colUpdate(i, ({colNum:i,title:fname}));
		//alert(input);
	}
	
	function plzwork()
	{
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
					var cul = this.$helper.context.attributes[1].nodeValue;
					var row = this.$helper.context.attributes[2].nodeValue;
					globalData = new Array();
					globalData[1] = row;
					//alert(cul);
					globalData[0] = cul;
					$(temp).trigger('custom');//, [cul, row]);
				}
			}
		}).data('gridster');
		/*if (confirmLogin == false)// || permission == 'read')
		{
			gridster.disable();
		}*/
	}