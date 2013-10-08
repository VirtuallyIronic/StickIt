//--------------
/*
**	VERSION 3.3
**	23/09/2013
**	PRE-TESTING
**
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
	var offlineTitles = new Array();
	var globalData = {};
	var online = true;
	var admin = false;
	var currentUser = "Kirk";
	
	$(function(){
		initCall();
		adminCheck();
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

		// `Backbone.sync`: Overrides persistence storage with dummy function. This enables use of `Model.destroy()` without raising an error.
		Backbone.sync = function(method, model) {
			//alert(method+"<-- method SYNC model-->"+model);
		};

		noteFormat = Backbone.Model.extend({
			defaults: function(){
				return {
					'col': '1',
					'row': '1',
					'text': '',
					'votes': 0,
					'voted': new Array(),
					'tagged': new Array(),
					'colour-note': '#FFFFFF',
					'colour-bar': '#000000',
					'font': '',
					'font-size': 18
				}
			},
			url: 'http://localhost:8080/'
			//http://localhost:8080/messages
		});
		
		wallFormat = Backbone.Model.extend({
			defaults: function(){
				return {
					'voted': new Array()
				}
			},
			url: 'http://localhost:8080/'
			//http://localhost:8080/messages
		});
		
		noteList = Backbone.Collection.extend({
			model: noteFormat,
			url: 'http://localhost:8080'
		});

		//------VIEW HANDLER FOR NOTES--------
		ItemView = Backbone.View.extend({
			/*tagName: 'li', // name of tag to be created
			className: 'noteContainer',*/
			tagName: 'div', // name of tag to be created
			className: 'note',
			
			// `ItemView`s now respond to two clickable actions for each `Item`: swap and delete.
			events: {
				'click img.deleteButton': 'remove',//'remove',
				'click img.editButton': 'editMe',
				'click img.expandButton': 'expanding',
				'click img.voteButton': 'voting',
				'click img.removeVoteButton': 'cancelVote'
			},
			
			// `initialize()` now binds model change/removal to the corresponding handlers below.
			initialize: function(){
				// every function that uses 'this' as the current object should be in here
				_.bindAll(this, 'render','editMe', 'cancelVote', 'unrender','removeTag','addNewTag','voting','moveNote','removenoprompt','updatePos','processing', 'remove', 'expanding');

				this.model.bind('remove', this.unrender);
				this.model.on('laneRemove', this.removenoprompt);
				this.model.on('moveNote', this.moveNote);
				$(this.$el).on('custom', this.updatePos);
			},
			
			//------CREATES A NEW NOTE--------
			render: function(){
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
			
			removeTag: function(e){
				alert(e);
			},
			
			//------+1 Vote--------
			voting: function(){
				var votes = this.model.get('votes');
				votes = (votes+1);//.toString();
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
				this.model.set('votes', votes);
				this.model.set('voted', voted);
				this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan").children().remove();
				$("<img class='removeVoteButton' src='images/icons/dislike-button-transparent.png' style='width: 30px;'></img>").appendTo($(this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan")));
				////.remove();
				this.$el.children('.cssnote').children(".toolbar").children("#votespan").text('Votes: '+votes+'  .');
				this.model.trigger('updateServer');				
			},

			cancelVote: function(){
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
				$("<img class='voteButton' src='images/icons/Like-button-transparent.png' style='width: 30px;'></img>").appendTo($(this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan")));
				if (changed > 0)
				{
					votes = (votes-1);
					this.model.set('votes', votes);
					this.model.set('voted', voted);
					this.$el.children('.cssnote').children(".toolbar").children("#votespan").text('Votes: '+votes+'  .');
					this.model.trigger('updateServer');		
				}
			},
			
			//------OPENS EDIT MENU--------
			editMe: function(){
				popMenu(this);
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
				this.model.trigger('updateServer');
			},
			
			//------AFTER EDIT, CHANGES MODEL DATA--------
			processing: function(){
				var data = confirmEdit(this);
				if (data != null)
				{
					var textEdit = data[0];
					var colour = data[1];
					var fontSize = data[2];
					var tags = data[3];
					this.$el.children('.cssnote').children('.edit').children(".editSpan").text(textEdit);
					linkify(this.$el.children('.cssnote').children('.edit').children(".editSpan"));
					/*this.$el.children('.edit').children(".editSpan").text( textEdit);
					linkify(this.$el.children('.edit').children(".editSpan"));*/
					//$($note).css("background-color", input.model.get('colour-note'));
					
					//this.$el.children('.cssnote').css('background-color', colour);
					this.$el.css('background-color', colour);
					
					//colour = this.$el.children('.cssnote').css('background-color');
					this.model.set('colour-note', colour);
					var fontColour = getContrastYIQ(colour);
					var newColour = getTintedColor(colour, -75);
					this.$el.children('.cssnote').children('.dragbar').css('background-color', newColour);					
					this.$el.children('.cssnote').children('.toolbar').css('background-color', newColour);
					this.$el.children('.cssnote').children('.edit').children('.editSpan').css('fontSize', fontSize+"px");
					this.$el.children('.cssnote').children('.edit').children('.editSpan').css('color', fontColour);
					
					this.model.set('font-size', fontSize);
					this.model.set('text', textEdit);
					if (tags != 0)
					{
						var oldTags = this.model.get('tagged');
						var newTags = oldTags.concat(tags);
						this.model.set('tagged',newTags);
					}
					closeMenu();
					this.model.trigger('updateServer');
					/* HOW TO MOVE WIDGET ????*/
					//field.model.set('col', col);
				}
				else
				{
					closeMenu();
				}
			},
			
			// CHECKS IF THE USER WANTS TO DELETE NOTE
			remove: function(){
				var r=confirm("Delete note?");
				if (r==true)
				{
					this.model.destroy();
					//this.model.set('col', oldCol);
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
				'click button.editLaneBut': 'editTitle'
			},
			
			//-------SETS UP ALL LISTENERS AND PROCESSES-------
			initialize: function(){
				_.bindAll(this, 'render', 'addItem', 'purgeData', 'editTitle', 'serverUpdate', 'removeLane', 'appendItem','prepareItem'); // every function that uses 'this' as the current object should be in here
				this.collection = new noteList();
				this.collection.bind('add', this.appendItem); // collection event binder
				this.collection.bind('updateServer', this.serverUpdate);
				this.on('newNote', this.addItem);
				this.on('completeDelete', this.purgeData);
				this.render();
			},
			
			//-------CREATES INITIAL OBJECTS-------
			render: function(){
				var self = this;
				for (var i=0; i<col; i++)
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
					$($tSpan).text(offlineTitles[i]);
					
					//--- attempt to put the title inside a <p> tag. ---
					$("<p>").appendTo($headDetails);
					
					$($tSpan).appendTo($headDetails);
					//var varvar = i+1
					if (admin == true)
					{	
						$("<br>").appendTo($headDetails);
						$("<button value="+i+" class='deleteLane'>DELETE LANES</button>").appendTo($headDetails);
						$("<button value="+i+" class='editLaneBut'>EDIT LANES</button>").appendTo($headDetails);
					}
				}
				
				if (online == true){
					for (var w=0; w<notes.length; w++)
					{
						var item = new noteFormat(notes[w]);
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
					offlineTitles[i] = fname;
					$(ev.target).parent().children('.titleSpan').text(fname);
				}				
			},
			
			//------OPENS NEW NOTE MENU--------
			addItem: function(){
				popMenu(this);
			},
			
			//-------DELETES A COLUMN OF NOTES AND MOVES REST TO THE LEFT-------
			removeLane: function(ev){
				if (online == true)
				{
					var r=confirm("Delete lane? ");
					if (r==true)
					{
						var colID = $(ev.target).val();
						
						//NEED TO UPDATE THIS TO THE BACKEND!
						offlineTitles.splice(colID,1);
						
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
							this.serverUpdate();
						}
						
						
						//remove Heading  --  unneeded
						$(ev.target).parent().children('.titleSpan').html("DELETED");
						$(ev.target).remove();
						
						//AJAX: SET SERVER COL NUMBER TO 1 LESS
						moreLanes();
					}
				}
				else
				{
					alert('Currently Offline');
				}
			},
			
			purgeData: function(){
				this.collection.each(function(model) { model.destroy(); } );
			},
			
			//-------GETS DATA FROM DIV MENU FOR NEW NOTE-------
			prepareItem: function(){
				if (confirm('Confirm new Note?')) 
				{   
					var col = document.getElementById('laneDrop').value;
					var row = 1;
					var text = document.getElementById('formText').value;
					var colour = document.getElementById('mainMenu').tempColour;
					var fontSize = document.getElementById('sizeDrop').value;
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
						'col': col,
						'row': row,
						'text': text,
						'tagged': tagged,
						'colour-note': colour,
						'font-size': fontSize
					});
					
					this.collection.add(item);
					this.serverUpdate();
				}
				closeMenu();
			},
			
			//-------ADDS WIDGET TO GRIDSTER GRID-------
			appendItem: function(item){
				var col = item.get('col');
				var row = item.get('row');
				var itemView = new ItemView({
					model: item
				});
				var hashTag = itemView.render().el;
					
				gridster.add_widget(hashTag, 1, 1, col, row);
			}
		});

		listView = new ListView();
	});//(jQuery);
	
	/*
	$( document ).ready(function() {
		if (admin == false)
		{
			//var hideItem = document.getElementById('newLaneBut');
			//$(hideItem).hide();
			
		}
	});*/