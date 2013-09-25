//--------------
/*
**	VERSION 3.2
**	20/09/2013
**	PRE-TESTING
**
**	--FEATURES--
**	NOTES (CREATE, EDIT, DELETE)
**		DRAGGABLE
**		EDIT:
**			TEXT
**			TAGS
**				-TAGS MISSING LINKS TO ACCESSABLE USERS
**			COLOUR
**				-PRESET
**			FONT SIZE
**				-MISSING FONT STYLE	
**			VOTING
**				+1 AND -1
**			
**	LANES (CREATE, EDIT, DELETE)
**		CLEAR THE WALL
**		CLEAR A LANE
**		EDIT TITLE
**
**	INITIAL AJAX CALLS
**		IF OFFLINE, IGNORE SERVER REQUESTS
**
**	--MISSING--
**	BACKBONE.SYNC
**	  -BACKBONE.SYNC WILL SPEED UP SERVER REQUESTS. 
**	  -STILL INVESTIGATING.
**	FORMATTING OF NOTES
**		-ADDITIONAL STYLE, COLOURS AND FONTS
**	CHROME ISSUES
**		- PARTIALLY SOLVED	
**	ADMIN RIGHTS (!!)
**
**	NEWLY ADDED/FIXED
**		FIXED SPACE BAR BUG ON MENU/EXPAND OPEN
**
**
*/
//--------------


	var globalTestCount = 0;
	var gridster;
	var lanes;
	var notes;
	var offlineTitles = new Array();
	var globalData = {};
	var randomName = 0;
	var online = true;
	var currentUser = "Kirk";
	/*
	Remove all notes on wall
	*/
	function clearWall()
	{
		var r=confirm("Delete ALL Notes?");
		if (r==true)
		{
			var rr=confirm("Are you sure?");
			if (rr==true)
			{
				var serialGrid = gridster.serialize();
				for (var i=0; i<serialGrid.length; i++)
				{
					var col = serialGrid[i].col;
					var row = serialGrid[i].row;
					var widget = gridster.is_widget(col,row);
					gridster.remove_widget(widget);
				}
			}
		}
	}
	
	$(function(){
		/*AJAX CALL FOR COLUMNS AND NOTE DATA*/
		$('#fullscreen').show();
		$.ajax({ 
			url: '/get',
			type: 'GET',
			async: false,
			success: function(data){
				lanes = data[0];//.totalCols;
				notes = data[1];
				//PULL HEADINGS NAMES
				for (var i=0; i<lanes; i++)
				{
					var laneID = (i+1);
					offlineTitles[i] = 'Lane '+laneID;
				}
				//alert("success");
			}, 
			error: function(jqXHR, textStatus, err){
				//alert('text status '+textStatus+', err '+err);
				alert('Offline Mode: ON');
				lanes = 5;
				for (var i=0; i<lanes; i++)
				{
					var laneID = (i+1);
					offlineTitles[i] = 'Lane '+laneID;
				}
				online = false;
			}
		});
		//var notes = noteData;//JSON.parse(strings);

		$('#fullscreen').hide();
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
					var cul = this.$helper.context.attributes[1].nodeValue;
					var row = this.$helper.context.attributes[2].nodeValue;
					globalData[0] = cul;
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
				'click button.deleteButton': 'remove',//'remove',
				'click button.editButton': 'editMe',
				'click button.expandButton': 'expanding',
				'click button.voteButton': 'voting',
				'click button.removeVoteButton': 'cancelVote'
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
				$("<button class='removeVoteButton'> -1 </button>").appendTo($(this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan")));
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
				$("<button class='voteButton'> +1 </button>").appendTo($(this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan")));
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
					this.$el.children('.cssnote').children('.edit').children(".editSpan").text( textEdit);
					linkify(this.$el.children('.cssnote').children('.edit').children(".editSpan"));
					/*this.$el.children('.edit').children(".editSpan").text( textEdit);
					linkify(this.$el.children('.edit').children(".editSpan"));*/
					//$($note).css("background-color", input.model.get('colour-note'));
					
					//this.$el.children('.cssnote').css('background-color', colour);
					this.$el.css('background-color', colour);
					
					//colour = this.$el.children('.cssnote').css('background-color');
					this.model.set('colour-note', colour);
					var newColour = getTintedColor(colour, -75);
					this.$el.children('.cssnote').children('.dragbar').css('background-color', newColour);					
					this.$el.children('.cssnote').children('.toolbar').css('background-color', newColour);
					this.$el.children('.cssnote').children('.edit').children('.editSpan').css('fontSize', fontSize+"px");
					
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
					this.model.set('col', oldCol);
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
				_.bindAll(this, 'render', 'addItem', 'editTitle', 'serverUpdate', 'removeLane', 'appendItem','prepareItem'); // every function that uses 'this' as the current object should be in here
				this.collection = new noteList();
				this.collection.bind('add', this.appendItem); // collection event binder
				this.collection.bind('updateServer', this.serverUpdate);
				this.on('newNote', this.addItem);
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
					$("<button value="+i+" class='deleteLane'>DELETE LANES</button>").appendTo($headDetails);
					$("<button value="+i+" class='editLaneBut'>EDIT LANES</button>").appendTo($headDetails);
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
					var qqa = this.collection.toJSON();					
					$.ajax({ 
						url: '/dataUpdate',
						type: 'POST',
						//async: false,
						cache: false, 
						dataType: 'json',
						contentType: "application/json",
						data: JSON.stringify(qqa),
						success: function(data){
							//SERVER UPDATED
							//alert("reloading now")
							//location.reload(true);
						}
						, error: function(jqXHR, textStatus, err){
							alert('ERROR text status '+textStatus+', err '+err)
							//location.reload(true);
						}
					});
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
				
				/*$(".class").each(function() {
					// ...
				});*/
				
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
						for (var q=colID; q<=lanes;q++)
						{
							if (q==colID)
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
			
			//-------GETS DATA FROM DIV MENU FOR NEW NOTE-------
			prepareItem: function(){
				if (confirm('Confirm new Note?')) 
				{   
					var col = document.getElementById('laneDrop').value;
					var row = 1;
					var text = document.getElementById('formText').value;
					var colour = document.getElementById('colourDrop').value;
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
		
	//CLOSES ANY POPUP MENU OPEN
	function closeMenu()
	{
		$('#fullscreen').hide();
		$('.popupMenu').remove();
	}
	
	//BUTTON STOPPED WORKING, WORKAROUND
	function newNoteWorkaround(){
		listView.trigger('newNote');
	}
	
	//OPENS POP-UP MENU (NEW OR EDIT)
	function popMenu(data)
	{
		//	widgetTest();
		var edit = true;
		var bonusTry = data;
		if (data.$el.selector == '.wall')
		{
			edit = false;
		}
		$('#fullscreen').show();
		var $mainMenu = jQuery('<div/>', {
			class: 'popupMenu',
			title: 'Menu',
			tempData: bonusTry,
		})
		$($mainMenu).appendTo("body");
		$("<span id='createTitle'>Note</span></br>").appendTo(".popupMenu");
		$("<div id='popupDetails'></div>").appendTo(".popupMenu");
		
		$("<div id='formDetails'></div>").appendTo("#popupDetails");
		
		var $textEdit = jQuery('<textarea/>', {
			placeholder:"Your text goes here.",
			id: 'formText',
			rows: '10',
			cols: '24',
		});
		$textEdit.appendTo("#formDetails");
		$textEdit.focus();
		$("<div id='sideBar'></div>").appendTo("#formDetails");
		

		if (edit == true)
		{
			$textEdit.val(data.model.get('text'));
		}
		//------------------------------------------------
		if (edit != true)
		{
			$("<p>Lane</p>").appendTo("#sideBar");
			var $laneSelect = jQuery('<select/>', {
				id: 'laneDrop',
			});
			$laneSelect.appendTo("#sideBar");

			for (i=1; i<=lanes; i++)
			{
				var arrayFix = (i-1);
				$("<option value="+i+">"+offlineTitles[arrayFix]+"</option>").appendTo("#laneDrop");
			}
		}
		//------------------------------------------------

		$("<p>Colour</p>").appendTo("#sideBar");

		var $colourSelect = jQuery('<select/>', {
			id: 'colourDrop',
		});
		$colourSelect.appendTo("#sideBar");

		$("<option value='#E6E6E6'>white</option>").appendTo("#colourDrop");
		$("<option value='#CCCC00'>yellow</option>").appendTo("#colourDrop");
		$("<option value='#33CCFF'>blue</option>").appendTo("#colourDrop");
		$("<option value='#FF0000'>red</option>").appendTo("#colourDrop");
		
		$("<option value='#860e20'>860e20</option>").appendTo("#colourDrop");
		$("<option value='#4246ce'>4246ce</option>").appendTo("#colourDrop");
		$("<option value='#5aa6c8'>5aa6c8</option>").appendTo("#colourDrop");
		$("<option value='#ee740e'>ee740e</option>").appendTo("#colourDrop");
		$("<option value='#1b5733'>1b5733</option>").appendTo("#colourDrop");
		$("<option value='#605d60'>605d60</option>").appendTo("#colourDrop");
		$("<option value='#9717e5'>9717e5</option>").appendTo("#colourDrop");
		$("<option value='#f4504a'>f4504a</option>").appendTo("#colourDrop");
		$("<option value='#f7fa53'>f7fa53</option>").appendTo("#colourDrop");

		//------------------------------------------------

		$("<p>Font Size</p>").appendTo("#sideBar");

		var $sizeSelect = jQuery('<select/>', {
			id: 'sizeDrop',
		});
		$sizeSelect.appendTo("#sideBar");
		var sizeFont = 15;
		for (var i=0; i<17; i++)
		{
			$("<option value='"+sizeFont+"'>"+sizeFont+"</option>").appendTo("#sizeDrop");
			sizeFont = sizeFont+5;
		}
		
		if (edit == true)
		{
			$("#sizeDrop > [value='"+data.model.get('font-size')+"']").attr("selected", "true");
			$("#colourDrop > [value='"+data.model.get('colour-note')+"']").attr("selected", "true");
		}
		
		//------------------------------------------------
		$("<p>TAG</p>").appendTo("#sideBar");

		$('<input class="userText" type="text" name="user" placeholder="e.g. Worked Well">').appendTo('#sideBar');
		$("<button class='tagButton' onclick='addUserTag(this)'>Add Tag</button>").appendTo("#sideBar");
		//------------------------------------------------
		
		$("<div id='bottomBar'></div>").appendTo("#popupDetails");
		/*
		$("<span class='tagLink' onclick='addTag(this)'>www.google.com </span><br/>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>http://www.google.com </span><br/>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>http://test.com </span><br/>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>www.random.org </span><br/>").appendTo("#bottomBar");
		*/
		if (edit === true)
		{
			$("<button id='confirmEdit' >Confirm</button>").appendTo("#bottomBar");
			$('#confirmEdit').on('click', data.processing);
		}		
		//if (edit === false)
		else {
			$("<button id='confirmPopup' >Confirm</button>").appendTo("#bottomBar");
			$('#confirmPopup').on('click', data.prepareItem);
		}
		$("<button id='cancelPopup' onclick='closeMenu()'>Cancel</button>").appendTo("#bottomBar");
				
		$("<div id='newTags' class='newTagBar'></div>").appendTo("#bottomBar");
		$("<div id='oldTags' class='oldTagBar'></div>").appendTo("#bottomBar");
		if (edit === true)
		{
			var tags = data.model.get('tagged');
			//var tagName = $(e.target).parent().children('.userText').val();
			var tagSize = _.size(tags);//.length;

			if (!tags[0])
			{
			}
			else
			{
				for (var i=0; i<tagSize; i++)
				{
					$("<span class='tagSpan' <span>TAGGED: </span><span class='taggedUser'> "+tags[i]+"</span> </span><br/>").appendTo(".oldTagBar");	
				}	
			}			
		}
	}
	
	function addUserTag(field){
		//var tags = this.model.get('tagged');
		var tagName = $(field).parent().children('.userText').val();
		if (tagName != 'undefined' && tagName != '')
		{
			$("<span class='tagRemoval' <span>New: </span><span class='taggedUser'> "+tagName+"</span> (click to remove)</span><br/>").appendTo(".newTagBar");	
		}
		var tagName = $(field).parent().children('.userText').val('');
	}
	
	/*
	Take text and append to note text field
	*/
	function addTag(field)
	{
		var tagText = $(field).text();
		$('#formText').val($('#formText').val()+" "+tagText);
	}
	
	//GETS DATA FROM EDIT FOR NOTE
	function confirmEdit(field)
	{
		var tags = document.getElementById('newTags');
		var tagged = new Array();
		var tagSize = $(tags).children().length;
		var count = 0;

		for (var i=1; i<tagSize; i=i+3)
		{
			tagged[count] = $(tags).children().eq(i).text();
			count=count+1;
		}
		var checkSize = _.size(tagged);
		var fullTextCurrent = field.model.get('text');
		var fieldText = document.getElementById('formText').value;
		var subText = null;
		if (fieldText != fullTextCurrent)
		{
			subText = fieldText;
			if (subText.length>144)
			{
				subText = subText.substr(0, 140);
				subText += " ...";
			};
		}
		
		var newColour = document.getElementById('colourDrop').value;
		var oldColour = field.model.get('colour-note');
		
		var newFontSize = document.getElementById('sizeDrop').value;
		var oldFontSize = field.model.get('font-size');
		
		if ((newColour != oldColour) || (subText != null) || (newFontSize != oldFontSize) || (checkSize>0))
		{
			var r=confirm("Confirm?");
			if (r==true)
			{
				var output = [];
				output[0] = fieldText;
				output[1] = newColour;
				output[2] = newFontSize;
				if (checkSize >0)
				{
					output[3] = tagged;
				}
				else
				{
					output[3] = 0;
				}
				return output;
			}
		}
		else
		{
			return null;
		}
	}
	
	//REMOVES THE SELECTED WIDGET
	function removeWidgets(field)
	{
		gridster.remove_widget(field);
	}
	
	// credits: richard maloney 2006
	function getTintedColor(color, v) {
		if (color.length >6) { color= color.substring(1,color.length)}
		var rgb = parseInt(color, 16); 
		var r = Math.abs(((rgb >> 16) & 0xFF)+v); if (r>255) r=r-(r-255);
		var g = Math.abs(((rgb >> 8) & 0xFF)+v); if (g>255) g=g-(g-255);
		var b = Math.abs((rgb & 0xFF)+v); if (b>255) b=b-(b-255);
		r = Number(r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r).toString(16); 
		if (r.length == 1) r = '0' + r;
		g = Number(g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g).toString(16); 
		if (g.length == 1) g = '0' + g;
		b = Number(b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b).toString(16); 
		if (b.length == 1) b = '0' + b;
		return "#" + r + g + b;
	}
	
	//CREATES NEW HTML ELEMENT NOTE
	function Note(input)
	{
		var x = input.model.get('text');
		var lanePos = input.model.get('col');
		
		var $note = jQuery('<div/>', {
			class: 'cssnote',
		});
		$(input.el).css("background-color", input.model.get('colour-note'));
		$($note).appendTo($(input.el));
		
		var $db = jQuery('<div/>', {
			class: 'dragbar',
		});
		$db.appendTo($note);
		
		var $edit = jQuery('<div/>', {
			class: 'edit'
		});
		if (x.length>144)
		{
			x = x.substr(0, 140);
			x += " ...";
		};
		$edit.appendTo($note);
		
		var $eSpan = jQuery('<span/>', {
			class:'editSpan',
		});
		$($eSpan).css("font-size", input.model.get('font-size')+"px");
		$($eSpan).text(x);
		$($eSpan).appendTo($edit);
		linkify($eSpan);
			
		var $tb = jQuery('<div/>', {
			class: 'toolbar',
		});
		$tb.appendTo($note);
		var oldColour = input.model.get('colour-note');
		var colour = getTintedColor(oldColour, -75);
		$($db).css("background-color", colour);
		$($tb).css("background-color", colour);
		
		var voteScore = input.model.get('votes');
		$("<span id='votespan'>Votes:"+voteScore+"   .</span>").appendTo($tb);
		$("<span id='userspan'>Created by: "+" no one "+"  </span>").appendTo($tb);
		$("<span id='closespan'><button class='deleteButton'> Delete </button></span>").appendTo($tb);
		$("<span id='editspan'><button class='editButton' > Edit </button></span>").appendTo($tb);
		$("<span id='expandspan'><button class='expandButton'> Expand </button></span>").appendTo($tb);
		
		
		var votedList = input.model.get('voted');
		var votedLength = _.size(votedList);
		var alreadyVoted;
		for (var i=0; i<votedLength; i++)
		{
			if (currentUser == votedList[i])
			{
				alreadyVoted = 1;
			}
		}
		if (alreadyVoted != 1)
		{
			$("<span id='voteBtnspan'><button class='voteButton'> +1 </button></span>").appendTo($tb);
		}
	}
	
	//OPENS EXPANDED TEXT BOX FOR NOTE
	function expandNote(field)
	{
		var fullText = field.model.get('text');
		//create a new div with all details of the original
		$('#fullscreen').show();
		var $exMenu = jQuery('<div/>', {
			class: 'popupMenu',
		});
		$($exMenu).appendTo("body");
		
		$($exMenu).css("background-color", field.model.get('colour-note'));
		$("<span id='createTitle'>Note</span></br>").appendTo(".popupMenu");
		$("<div id='popupDetails'></div>").appendTo(".popupMenu");
		
		var $fullT = jQuery('<span/>', {
			id: 'expandFulltext',
		});
		$($fullT).appendTo("#popupDetails");
		
		$("#expandFulltext").html(fullText);
		linkify($fullT);
		$("<br></br>").appendTo("#popupDetails");
		$("<div id='bottomBar'></div>").appendTo("#popupDetails");
		
		var tagged = field.model.get('tagged');
		var tagSize = _.size(tagged);
		for (var i=0; i<tagSize; i++)
		{
			$("<span class='taggedUser'>Tag: "+tagged[i]+"</span><br/>").appendTo("#bottomBar");
		}		
		$("<button id='cancelPopup' onclick='closeMenu()'>Cancel</button>").appendTo("#bottomBar");
		document.getElementById('cancelPopup').focus();
	}

	//REQUESTS MORE LANES FROM SERVER
	function moreLanes(postType)
	{
		if (online == true)
		{		
			if (postType == '0')
			{
				//alert('ajax');
				//var sendURL = '/ajax';
				lanes = parseInt(lanes); 			
				lanes=lanes+1;
			}
			else
			{
				//alert('decLane');
				//var sendURL = '/decLan';
				lanes = parseInt(lanes);
				lanes=lanes-1;
			}
			
			$.ajax({ 
				url: '/',
				type: 'POST',
				cache: false,
				async: false,			
				dataType: 'json',
				contentType: "application/json",
				data: JSON.stringify({'newCol':lanes}),
				success: function(data){
					//LANE ALTERED
					alert('Reloading Page')
					location.reload(true);
				}
				, error: function(jqXHR, textStatus, err){
					alert('ERROR text status '+textStatus+', err '+err)
					//location.reload(true);
				}
			});
		}
		else
		{
			alert('Currently Offline');
		}
	}
	
	function screenCap()
	{
		var test = window.open();
		html2canvas($('.demo'), {
			onrendered: function(canvas) {
				$(test.document.body).html(canvas);
			}
		});
	}
	
	//CREATES URL FROM PLAIN TEXT
	function linkify(eSpan) 
	{
		var replacePattern2;
		var inputText = $(eSpan).text();
		$(eSpan).text("");
		
		//URLs starting with http://, https://, or www.
		replacePattern2 = /((www|https?:\/\/)[^ ]+)/;
		var replacedArray = inputText.split(replacePattern2);
		
		for (var i =0; i<replacedArray.length; i++)
		{
			var temp = "";
			if (replacePattern2.test(replacedArray[i]))
			{
				temp = replacedArray[i].replace(replacePattern2, '<a href="$1" target="_blank">$1</a>');
				$(temp).appendTo(eSpan);
				i=i+1;
			}
			else
			{
				$(eSpan).append(document.createTextNode(replacedArray[i]));
			}
		}
		
		//Change email addresses to mailto:: links.
		//replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
		//replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
	}
