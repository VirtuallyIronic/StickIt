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
	var gridster;
	var lanes;
	var globalData = {};
	
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
				/*$(".note").each(function(){
					$(this).parent().remove();
				});*/
			}
		}
	}
	
	$(function(){
		/*AJAX CALL FOR COLUMNS AND NOTE DATA*/
		$.ajaxSetup( { "async": false } );
		var details = {};
		var request = $.getJSON( "database.json", function(data) {
			details = data;
		});
		
		$.ajax({ 
			url: '/get',
			type: 'GET',
			success: function(data){
				lanes = data.newCol;
				alert("success");
			}
			, error: function(jqXHR, textStatus, err){
				//alert('text status '+textStatus+', err '+err);
				lanes = 7;
			}
		});
		
		var notes = details.note;//JSON.parse(strings);

		var col = lanes;
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
		Backbone.sync = function(method, model, success, error){
			success();
		}

		noteFormat = Backbone.Model.extend({
			defaults: {
				'col': '1',
				'row': '1',
				'text': '',
				"css": {
					'colour-note': 'yellow',
					'colour-bar': 'dark yellow',
					'font': '',
					'font-size': 12
				}
			}
		});
		
		noteList = Backbone.Collection.extend({
			model: noteFormat
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
				'click button.expandButton': 'expanding'		
			},
			
			// `initialize()` now binds model change/removal to the corresponding handlers below.
			initialize: function(){
				// every function that uses 'this' as the current object should be in here
				_.bindAll(this, 'render','editMe', 'unrender','moveNote','removenoprompt','updatePos','processing', 'remove', 'expanding');

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
				expandNote(this);
			},

			//------OPENS EDIT MENU--------
			editMe: function(){
				popMenu(this);
			},
			
			//------AFTER DELETE PROMPT, REMOVE NOTE WIDGET--------
			unrender: function(){
				removeWidgets($(this.el));
			},
			
			//------AFTER DRAG,CHANGES MODEL DATA--------
			updatePos: function(e){
				var newCol = globalData[0];
				var newRow = globalData[1];
				this.model.set('col', newCol);
				this.model.set('row', newRow);
				globalData = {};
			},
			
			//------AFTER EDIT, CHANGES MODEL DATA--------
			processing: function(){
				var data = confirmEdit(this);
				if (data != null)
				{
					var textEdit = data[0];
					/*this.$el.children('.note').children('.edit').children(".editSpan").text( textEdit);
					linkify(this.$el.children('.note').children('.edit').children(".editSpan"));*/
					this.$el.children('.edit').children(".editSpan").text( textEdit);
					linkify(this.$el.children('.edit').children(".editSpan"));
					this.model.set('text', textEdit);
					/* HOW TO MOVE WIDGET ????*/
					//field.model.set('col', col);
				}
				closeMenu();
			},
			
			// CHECKS IF THE USER WANTS TO DELETE NOTE
			remove: function(){
				var r=confirm("Delete note?");
				if (r==true)
				{
					this.model.destroy();
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
				'click button.deleteLane': 'removeLane'
			},
			
			//-------SETS UP ALL LISTENERS AND PROCESSES-------
			initialize: function(){
				_.bindAll(this, 'render', 'addItem', 'removeLane', 'appendItem','prepareItem'); // every function that uses 'this' as the current object should be in here
				this.collection = new noteList();
				this.collection.bind('add', this.appendItem); // collection event binder
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
					$($tSpan).appendTo($headDetails);
					var varvar = i+1
					$("<button value="+varvar+" class='deleteLane'>DELETE LANES</button>").appendTo($headDetails);
					$("<button class='editLaneBut'>EDIT LANES</button>").appendTo($headDetails);
				}

				for (var w=0; w<notes.length; w++)
				{
					var item = new noteFormat();
					item.set({
						'col': notes[w].col,
						'row': notes[w].row,
						'text': notes[w].text
						// modify item defaults
					});
					this.collection.add(item);
				}
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

					for (var q=colID; q<=lanes;q++)
					{
						//alert("q "+q);
						if (q==colID)
						{
							//alert('if');
							var colData = this.collection.where({'col': colID});
							for (var i=0; i<colData.length; i++)
							{
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
								var moveNote = colMove[i];
								moveNote.trigger('moveNote');
								//alert(colMove[i]);//.model.get('text'));
							}
						}
					}
					//remove Heading  --  unneeded
					
					$(ev.target).parent().children('.titleSpan').html("DELETED");
					$(ev.target).remove();
					
					//AJAX: SET SERVER COL NUMBER TO 1 LESS
					//moreLanes();

				}
			},
			
			//-------GETS DATA FROM DIV MENU FOR NEW NOTE-------
			prepareItem: function(){
				var col = document.getElementById('laneDrop').value;
				var row = 1;
				var text = document.getElementById('formText').value;
				var item = new noteFormat();
				item.set({
					'col': col,
					'row': row,
					'text': text
					// modify item defaults
				});
				this.collection.add(item);
				closeMenu();
			},
			
			//-------ADDS WIDGET TO GRIDSTER GRID-------
			appendItem: function(item){
				var col = item.get('col');
				var row = item.get('row');
				while (gridster.is_widget(col,row))
				{
					++row;
				};
				var itemView = new ItemView({
					model: item
				});
				var hashTag = itemView.render().el;
					
				gridster.add_widget(hashTag, 1, 1, col, row);
			}
		});

		listView = new ListView();
	})(jQuery);
	
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
			var $laneSelect = jQuery('<select/>', {
				id: 'laneDrop',
			});
			$laneSelect.appendTo("#sideBar");
			$("<p>lol</p>").appendTo("#sideBar");

			for (i=1; i<=7; i++)
			{
				$("<option value="+i+">"+i+"</option>").appendTo("#laneDrop");
			}
		}
		
		/*if (edit == true)
		{
			$("#laneDrop > [value='"+data.model.get('col')+"']").attr("selected", "true");
		}*/
		
		$("<p>TAGS</p>").appendTo("#sideBar");
		$("<select id='tagDrop'></select>").appendTo("#sideBar");
		//ADD A LIST OF TAGS HERE
		//option value etc.
		for (i=1; i<=lanes; i++)
		{
			$("<option value="+i+">"+i+"</option>").appendTo("#tagDrop");
		}
			
		$("<button id='tagButton' onclick='addTagButton()'>Add Tag</button>").appendTo("#sideBar");
		//------------------------------------------------
		$("<div id='bottomBar'></div>").appendTo("#popupDetails");
		$("<span class='tagLink' onclick='addTag(this)'>www.google.com </span>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>http://www.google.com </span>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>http://test.com </span>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>www.random.org </span>").appendTo("#bottomBar");
			
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
		
		if (/*(newLane != 0) || */subText != null)
		{
			var r=confirm("Confirm?");
			if (r==true)
			{
				var output = [];
				//output[1] = lanePos;
				output[0] = fieldText;
				//output[1] = field;
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
		var $note = $(input.$el);

		var x = input.model.get('text');
		var lanePos = input.model.get('col');
		//$(input.$el).appendTo('gridster');
		/*
		var $note = jQuery('<div/>', {
			class: 'note',
		});
		$note.appendTo($(input.el));
		*/
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
		$($eSpan).text(x);
		$($eSpan).appendTo($edit);
		linkify($eSpan);
			
		var $tb = jQuery('<div/>', {
			class: 'toolbar',
		});
		$tb.appendTo($note);
		$("<span id='userspan'>Created by: "+" no one "+"  </span>").appendTo($tb);
		$("<span id='closespan'><button class='deleteButton'> Delete </button></span>").appendTo($tb);
		$("<span id='editspan'><button class='editButton' > Edit </button></span>").appendTo($tb);
		$("<span id='expandspan'><button class='expandButton'> Expand </button></span>").appendTo($tb);
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
		$("<button id='cancelPopup' onclick='closeMenu()'>Cancel</button>").appendTo("#bottomBar");
	}
	
	//REQUESTS MORE LANES FROM SERVER
	function moreLanes(postType)
	{
		
		alert(lanes);
		if (postType == '0')
		{
			alert('ajax');
			var sendURL = '/ajax';	
			lanes=lanes+1;
		}
		else
		{
			alert('decLane');
			var sendURL = '/decLan';
			lanes=lanes-1;
		}
		
		$.ajax({ 
			url: sendURL,
			type: 'POST',
			cache: false, 
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify({newCol:lanes}),
			success: function(data){
				alert("done, reloading now")
				location.reload(true);
			}
			, error: function(jqXHR, textStatus, err){
				alert('text status '+textStatus+', err '+err)
				location.reload(true);
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
