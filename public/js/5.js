//--------------
/*
**	VERSION 3(?)
**	13/09/2013
**	END OF SPRINT 4
**
**	--FEATURES--
**	NOTES (CREATE, EDIT, DELETE)
**		DRAGGABLE
**	LANES (CREATE, EDIT, DELETE)
**		CLEAR THE WALL
**	INITIAL AJAX CALLS
**
**	--MISSING--
**	BACKBONE.SYNC
**	  -BACKBONE.SYNC WILL SPEED UP SERVER REQUESTS. 
**	  -STILL INVESTIGATING.
**
**
*/
//--------------
	var globalTestCount = 0;
	var gridster;
	var lanes;
	var notes;
	var globalData = {};
	var randomName = 0;
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
		/*$.ajaxSetup( { "async": false } );
		var details = {};
		var request = $.getJSON( "database.json", function(data) {
			details = data;
		});*/
		//$.ajaxSetup( { "async": false } );
		$('#fullscreen').show();
		$.ajax({ 
			url: '/get',
			type: 'GET',
			async: false,
			success: function(data){
				lanes = data[0];//.totalCols;
				notes = data[1];
				alert("success");
			}, 
			error: function(jqXHR, textStatus, err){
				alert('text status '+textStatus+', err '+err);
				lanes = 7;
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
			alert(method+"<-- method SYNC model-->"+model);
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
					'colour-note': 'white',
					'colour-bar': 'red',
					'font': '',
					'font-size': 18
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
				'click button.voteButton': 'voting'
			},
			
			// `initialize()` now binds model change/removal to the corresponding handlers below.
			initialize: function(){
				// every function that uses 'this' as the current object should be in here
				_.bindAll(this, 'render','editMe', 'testingAlerts','unrender','removeTag','addNewTag','voting','moveNote','removenoprompt','updatePos','processing', 'remove', 'expanding');

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
				var asdasd = this.model.toJSON();
				alert(asdasd);
				expandNote(this);
			},
			
			testingAlerts: function(input){
				alert(input);
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
					voted[0] = "who ever is logged in";
				}
				else
				{
					voted[tat] = "who ever is logged in";
				}
				this.model.set('votes', votes);
				this.model.set('voted', voted);
				this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan").remove();
				this.$el.children('.cssnote').children(".toolbar").children("#votespan").text('Votes: '+votes+'  .');
				this.model.trigger('updateServer');				
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
					this.$el.children('.cssnote').css('background-color', colour);
					colour = this.$el.children('.cssnote').css('background-color');
					colour = palletSwap(colour);
					this.$el.children('.cssnote').children('.dragbar').css('background-color', colour);					
					this.$el.children('.cssnote').children('.toolbar').css('background-color', colour);
					this.$el.children('.cssnote').children('.edit').children('.editSpan').css('fontSize', fontSize+"px");
					
					this.model.set('font-size', fontSize);
					this.model.set('colour-note', colour);
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
					$($tSpan).text(i);
					
					//--- attempt to put the title inside a <p> tag. ---
					$("<p>").appendTo($headDetails);
					
					$($tSpan).appendTo($headDetails);
					var varvar = i+1
					$("<button value="+varvar+" class='deleteLane'>DELETE LANES</button>").appendTo($headDetails);
					$("<button class='editLaneBut'>EDIT LANES</button>").appendTo($headDetails);
				}

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
			},
			
			serverUpdate: function(){
				//alert('testing '+globalTestCount);
				//globalTestCount = globalTestCount+1;
				var qqa = this.collection.toJSON();
				//alert(qqa);
				
				$.ajax({ 
					url: '/dataUpdate',
					type: 'POST',
					//async: false,
					cache: false, 
					dataType: 'json',
					contentType: "application/json",
					data: JSON.stringify(qqa),
					success: function(data){
						alert("done, reloading now")
						//location.reload(true);
					}
					, error: function(jqXHR, textStatus, err){
						alert('ERROR text status '+textStatus+', err '+err)
						//location.reload(true);
					}
				});
				
				
			},
			
			editTitle: function(ev){
				var fname=prompt("New Lane Title")
				$(ev.target).parent().children('.titleSpan').html(fname);
			},
			
			//------OPENS NEW NOTE MENU--------
			addItem: function(){
				//alert('!!!!');
				popMenu(this);
			},
			
			//-------DELETES A COLUMN OF NOTES AND MOVES REST TO THE LEFT-------
			removeLane: function(ev){
				var r=confirm("Delete lane? ");
				if (r==true)
				{
					var colID = $(ev.target).val();
					var notesEdited = 0;
					for (var q=colID; q<=lanes;q++)
					{
						//alert("q "+q);
						if (q==colID)
						{
							//alert('if');
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
							//alert('else '+q );
							var colPos = q.toString();
							var colMove = this.collection.where({'col': colPos});
							for (var i=0; i<colMove.length; i++)
							{
								//Move all notes to the left.
								notesEdited++;
								var moveNote = colMove[i];
								moveNote.trigger('moveNote');
								//alert(colMove[i]);//.model.get('text'));
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
					//alert($(tags).children().eq(1).text());
					for (var i=1; i<tagSize; i=i+3)
					{
						//alert($(tags).children[i].text());
						tagged[count] = $(tags).children().eq(i).text();
						count=count+1;
						//i=i+2;
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
	
	function palletSwap(col)
	{
		var check = col.substring(0,3);
		if (check!='rgb')
		{
			col = "rgb("+255+","+255+","+255+")";
		}
		var num = col.slice(4);
		num = num.split(",");
		var red = parseInt(num[0]);
		var green = parseInt(num[1]);
		var blue = num[2].slice(0,-1);
		blue = parseInt(blue);

		red = red-55;
		green = green-55;
		blue = blue-55;
		
		red = zeroCheck(red);
		green = zeroCheck(green);
		blue = zeroCheck(blue);
		var newColour = "rgb("+red+","+green+","+blue+")";
		return newColour;
		//return col;
	}

	function zeroCheck(colour)
	{
		if (colour < 0)
		{
			colour = 0;
		}
		return colour;
	}
	
	//CLOSES ANY POPUP MENU OPEN
	function closeMenu()
	{
		$('#fullscreen').hide();
		$('.popupMenu').remove();
	}
	
	//BUTTON STOPPED WORKING, WORKAROUND
	function newNoteWorkaround(){
		//alert("FUCK");
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

			for (i=1; i<=7; i++)
			{
				$("<option value="+i+">"+i+"</option>").appendTo("#laneDrop");
			}
		}

		$("<p>Colour</p>").appendTo("#sideBar");

		var $colourSelect = jQuery('<select/>', {
			id: 'colourDrop',
		});
		$colourSelect.appendTo("#sideBar");

		$("<option value='#E6E6E6'>white</option>").appendTo("#colourDrop");
		$("<option value='#CCCC00'>yellow</option>").appendTo("#colourDrop");
		$("<option value='#33CCFF'>blue</option>").appendTo("#colourDrop");
		$("<option value='#FF0000'>red</option>").appendTo("#colourDrop");

		$("<p>Colour</p>").appendTo("#sideBar");

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
			$("#colourDrop > [value='"+data.model.get('colour-note')+"']").attr("selected", "true");
			$("#sizeDrop > [value='"+data.model.get('font-size')+"']").attr("selected", "true");
		}
		
		//------------------------------------------------
		$("<p>TAG</p>").appendTo("#sideBar");
		/*
		**List is available if we can get a list of those with access to the wall
		**else Text box for tagging, can check text later to see if user exists.
		$("<select id='tagDrop'></select>").appendTo("#sideBar");
		//ADD A LIST OF TAGS HERE
		//option value etc.
		for (i=1; i<=lanes; i++)
		{
			$("<option value="+i+">"+i+"</option>").appendTo("#tagDrop");
		}
		*/
		$('<input class="userText" type="text" name="user" placeholder="e.g. Worked Well">').appendTo('#sideBar');
		//$('<input class="userText" type="text" name="user">').appendTo('#sideBar');
		$("<button class='tagButton' onclick='addUserTag(this)'>Add Tag</button>").appendTo("#sideBar");
		//$('.tagButton').on('click', addUserTag(this));
		//------------------------------------------------
		
		$("<div id='bottomBar'></div>").appendTo("#popupDetails");
		$("<span class='tagLink' onclick='addTag(this)'>www.google.com </span><br/>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>http://www.google.com </span><br/>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>http://test.com </span><br/>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>www.random.org </span><br/>").appendTo("#bottomBar");
			
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
		//alert($(tags).children().eq(1).text());
		for (var i=1; i<tagSize; i=i+3)
		{
			//alert($(tags).children[i].text());
			tagged[count] = $(tags).children().eq(i).text();
			count=count+1;
			//i=i+2;
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
				//output[1] = lanePos;
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
				//closeMenu();
				return output;
			}
		}
		else
		{
			return null;
			//closeMenu();
		}
	}
	
	//REMOVES THE SELECTED WIDGET
	function removeWidgets(field)
	{
		gridster.remove_widget(field);
	}
	
	//CREATES NEW HTML ELEMENT NOTE
	function Note(input)
	{
		//var $note = $(input.$el);

		var x = input.model.get('text');
		var lanePos = input.model.get('col');
		//$(input.$el).appendTo('gridster');
		
		var $note = jQuery('<div/>', {
			class: 'cssnote',
		});
		$($note).css("background-color", input.model.get('colour-note'));
		var colour = $($note).css("background-color");
		var check = colour.substring(0,3);
		if (check!='rgb')
		{
			var ppp = window.getComputedStyle($note);
			colour = "rgb("+255+","+255+","+255+")";
		}
		colour = palletSwap(colour);
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
		
		$($db).css("background-color", colour);
		$($tb).css("background-color", colour);
		
		if (randomName == 0)
		{
			randomName = 1;
			var demo = new Array();
			demo[0] = "poop";
			input.model.set('voted', demo);
			var vv = input.model.get('votes');
			vv = vv+1;
			input.model.set('votes', vv);
		}
		else
		{
			randomName = 0;
		}
		
		var voteScore = input.model.get('votes');
		$("<span id='votespan'>Votes:"+voteScore+"   .</span>").appendTo($tb);
		$("<span id='userspan'>Created by: "+" no one "+"  </span>").appendTo($tb);
		$("<span id='closespan'><button class='deleteButton'> Delete </button></span>").appendTo($tb);
		$("<span id='editspan'><button class='editButton' > Edit </button></span>").appendTo($tb);
		$("<span id='expandspan'><button class='expandButton'> Expand </button></span>").appendTo($tb);
		
		
		var votedList = input.model.get('voted');
		var votedLength = _.size(votedList);
		var alreadyVoted;
		var loggedInUser = "poop";
		for (var i=0; i<votedLength; i++)
		{
			if (loggedInUser == votedList[i])
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
		});//.draggable();
		$($exMenu).appendTo("body");
		//$($exMenu).css('background-color', field.model.get('note-colour'));
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
	}

	//REQUESTS MORE LANES FROM SERVER
	function moreLanes(postType)
	{
		
		alert(lanes);
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
				alert("done, reloading now")
				location.reload(true);
			}
			, error: function(jqXHR, textStatus, err){
				alert('ERROR text status '+textStatus+', err '+err)
				//location.reload(true);
			}
		});
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
				//'<a href="$1">$1</a>
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
