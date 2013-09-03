	// **This example introduces two new Model actions (swap and delete), illustrating how such actions can be handled within a Model's View.**
	//
	// _Working example: [5.html](../5.html)._

	//
	/*
	var myJSON = JSON.parse('[{"id":"1","col":"1","row":"1","text":"hmmm"},
	{"id":"2","col":"1","row":"2","text":"WWJD"},
	{"id":"3","col":"2","row":"2","text":"burp"}]');
	*/
	
	var gridster;
	var lanes;
	
	$(function(){
		/**/
		var obj = jQuery.parseJSON('{"name":"John"}');
		//alert( obj.name === "John" );
		$.ajaxSetup( { "async": false } );
		var details = {};
		var request = $.getJSON( "database.json", function(data) {
			details = data;
			//alert(data);
		});
		//jqxhr.complete(function() { alert("cake"); });
		$.ajax({ 
			url: '/get',
			type: 'GET',
			success: function(data){
				lanes = data.newCol;
				alert("success");
			}
			, error: function(jqXHR, textStatus, err){
				alert('text status '+textStatus+', err '+err)
			}
		});
		var strings = JSON.stringify(details.note);		
		var notes = JSON.parse(strings);
		//lanes = details.totalCols;

		var col = lanes;
		/*ADD COL HEADINGS HERE*/
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
					var temp = this.$el.children()[0];
					var col = this.$helper.context.attributes[1].nodeValue;
					var row = this.$helper.context.attributes[2].nodeValue;
					$(temp).trigger('custom', [col, row]);
				}
			}
		}).data('gridster');

		
		// `Backbone.sync`: Overrides persistence storage with dummy function. This enables use of `Model.destroy()` without raising an error.
		Backbone.sync = function(method, model, success, error){
			alert(method+" method");
			alert(model+" model");
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

		ItemView = Backbone.View.extend({
			tagName: 'div', // name of tag to be created
			className: 'note',
			// `ItemView`s now respond to two clickable actions for each `Item`: swap and delete.
			events: {
				'click button.deleteButton': 'remove',//'remove',
				'click button.editButton': 'editMe',
				'click button.expandButton': 'expanding',
				'click button.confirmEdit': 'prepareEdit',
				'gridster.stop': 'dragStop'
			},
			
			// `initialize()` now binds model change/removal to the corresponding handlers below.
			initialize: function(){
			 // every function that uses 'this' as the current object should be in here
				_.bindAll(this, 'render','editMe', 'unrender','remove', 'expanding','prepareEdit', 'dragStop');

				//this.model.bind('change', this.render);
				this.model.bind('remove', this.unrender);
			},
			
			// `render()` now includes two extra `span`s corresponding to the actions swap and delete.
			render: function(){
				Note(this);
				//Ttest(this);
				return this; // for chainable calls, like .render().el
			},
			
			dragStop: function(){
				alert('STOPPED');
			},
			
			expanding: function(){
				expandNote(this);
			},

			editMe: function(){
				popMenu(this);
			},
			
			// `unrender()`: Makes Model remove itself from the DOM.
			unrender: function(){
				removeWidgets($(this.el));
			},
			// `swap()` will interchange an `Item`'s attributes. When the `.set()` model function is called, the event `change` will be triggered.

			// `remove()`: We use the method `destroy()` to remove a model from its collection. Normally this would also delete the record from its persistent storage, but we have overridden that (see above).
			remove: function(){
				//alert($(this.el).parent());
				this.model.destroy();
			},
						
			prepareEdit: function(){
				//alert("ACTIVATE");
				/*var textEdit = document.getElementById('formText').val();
				this.$el.children('.edit').children(".editSpan").text(textEdit);
				//linkify(this.$el.children('.edit').children(".editSpan"));
				this.modal.set('text', textEdit);*/
				closeMenu();
			}
		});

		// Because the new features (swap and delete) are intrinsic to each `Item`, there is no need to modify `ListView`.
		ListView = Backbone.View.extend({
			el: $('body'), // el attaches to existing element
			events: {
				'click button#add': 'addItem',
				'click button#confirmPopup': 'prepareItem'
			},
			
			initialize: function(){
				_.bindAll(this, 'render', 'addItem', 'appendItem','prepareItem'); // every function that uses 'this' as the current object should be in here
				this.collection = new noteList();
				this.collection.bind('add', this.appendItem); // collection event binder
				this.render();
			},
			
			render: function(){
				var self = this;
				
				for (var i=0; i<notes.length; i++)
				{
					var item = new noteFormat();
					item.set({
						'col': notes[i].col,
						'row': notes[i].row,
						'text': notes[i].text
						// modify item defaults
					});
					this.collection.add(item);
					//alert(notes[i].col);
					//self.appendItem(notes[i]);
				}
				/*_(this.collection.models).each(function(item){ // in case collection is not empty
					self.appendItem(item);
				}, this);*/
			},
			
			addItem: function(){
				popMenu(this);
			},
			
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

		var listView = new ListView();
	})(jQuery);
	//*/
	
	function closeMenu()
	{
		$('#fullscreen').hide();
		$('.popupMenu').remove();
	}
	
	function popMenu(data)
	{
	//	widgetTest();
		var edit = true;
		var bonusTry = data;
		if (data.$el.selector == 'body')
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
		
		var $laneSelect = jQuery('<select/>', {
			id: 'laneDrop',
		});
		$laneSelect.appendTo("#sideBar");
		if (edit == true)
		{
			$textEdit.val(data.model.get('text'));
		}
		
		$("<p>lol</p>").appendTo("#sideBar");

		for (i=1; i<=7; i++)
		{
			$("<option value="+i+">"+i+"</option>").appendTo("#laneDrop");
		}
		
		if (edit == true)
		{
			$("#laneDrop > [value='"+data.model.get('col')+"']").attr("selected", "true");
		}
		
		$("<p>TAGS</p>").appendTo("#sideBar");
		$("<select id='tagDrop'></select>").appendTo("#sideBar");
		//ADD A LIST OF TAGS HERE
		//option value etc.
		for (i=1; i<=lanes; i++)
		{
			$("<option value="+i+">"+i+"</option>").appendTo("#tagDrop");
		}
		
		$("<button id='tagButton' onclick='addTagButton()'>Add Tag</button>").appendTo("#sideBar");

		$("<div id='bottomBar'></div>").appendTo("#popupDetails");
		$("<span class='tagLink' onclick='addTag(this)'>TAG 1 </span>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>TAG 2 </span>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>TAG 3 </span>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>TAG 4 </span>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>TAG CLICK ME FOR 5 </span>").appendTo("#bottomBar");
		$("<span class='tagLink' onclick='addTag(this)'>TAG 6 </span>").appendTo("#bottomBar");
		
		//$("<button id='confirmPopup' >Confirm</button>").appendTo("#bottomBar");
		
		if (edit === false)
		{
			$("<button id='confirmPopup' >Confirm</button>").appendTo("#bottomBar");
			//$("<button id='confirmPopup' onclick='newNote()'>Confirm</button>").appendTo("#bottomBar");
		}
		if (edit === true)
		{
			//alert('correct button');
			//$("<button id='confirmEdit' onclick='confirmEdit(this)'>Confirm</button>").appendTo("#bottomBar");
			$("<button class='confirmEdit' >Confirm</button>").appendTo("#bottomBar");
			$('.confirmEdit').bind('click',function(e){
				confirmEdit(data);
			});
		}
		//*/
		
		$("<button id='cancelPopup' onclick='closeMenu()'>Cancel</button>").appendTo("#bottomBar");
		//$mainMenu.draggable();//{ cancel: ".tagLink", cancel: "#formText", containment: ".wall" });
	}
	
	/*
	Take text and append to note text field
	*/
	function addTag(field)
	{
		var tagText = $(field).text();
		$('#formText').val($('#formText').val()+" "+tagText);
	}
	
	function editCheck(output)
	{
		var textEdit = output[0];
		var col = output[1];
		var field = output[2]
		//var temp = field.$el.children('.edit').children('.editSpan').text();
		field.$el.children('.edit').children(".editSpan").text( textEdit);
		linkify(field.$el.children('.edit').children(".editSpan"));
		field.model.set('text', textEdit);
		/* HOW TO MOVE WIDGET ????*/
		field.model.set('col', col);
		closeMenu();
	}
	
	function confirmEdit(field)
	{
		var currentLane = field.model.get('col');
		var lanePos = document.getElementById('laneDrop').value;
		var newLane = 0;
		if (lanePos != currentLane)
		{
			newLane = lanePos;
		}

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
		
		if ((newLane != 0) || (subText != null))
		{
			var r=confirm("Confirm?");
			if (r==true)
			{
				var output = [];
				output[1] = lanePos;
				output[0] = fieldText;
				output[2] = field;
				//closeMenu();
				editCheck(output);
			}
		}
		else
		{
			closeMenu();
		}
	}
	
	function calltoDB()
	{
		//collect DB data
		//foreach note returned
		var count = 3;
		var test = new Array(count);
		for (var i=0; i<test.length; i++)
		{
			test[i] = new Array(5);
			test[i][0] = "HI GUYS "+i;//text;
			test[i][1] = 1//col;
			test[i][2] = 1//row;
			test[i][3] = "NO ONE"//user;
			test[i][4] = i//id;
		}
		return test;
	}
	
	function removeWidgets(field)
	{
		gridster.remove_widget(field);
	}
	
	function Note(input)
	{
		var noteEle = $(input.$el);
		$(noteEle).on('custom', function(event, col, row) {
			input.model.set('col', col);
			input.model.set('row', row);
		});
		
		var x = input.model.get('text');
		var lanePos = input.model.get('col');
		
		var $db = jQuery('<div/>', {
			class: 'dragbar',
		});
		$db.appendTo($(input.el));
		
		var $edit = jQuery('<div/>', {
			class: 'edit'
		});
		if (x.length>144)
		{
			x = x.substr(0, 140);
			x += " ...";
		};
		$edit.appendTo($(input.$el));
		
		var $eSpan = jQuery('<span/>', {
			class:'editSpan',
		});
		$($eSpan).text(x);
		$($eSpan).appendTo($edit);
		linkify($eSpan);
			
		var $tb = jQuery('<div/>', {
			class: 'toolbar',
		});
		$tb.appendTo($(input.$el));
		$("<span id='userspan'>Created by: "+" no one "+"  </span>").appendTo($tb);
		$("<span id='closespan'><button class='deleteButton'> Delete </button></span>").appendTo($tb);
		$("<span id='editspan'><button class='editButton' > Edit </button></span>").appendTo($tb);
		$("<span id='expandspan'><button class='expandButton'> Expand </button></span>").appendTo($tb);
	}
	
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
	function moreLanes()
	{
		alert(lanes);
		lanes=lanes+1;
		$.ajax({ 
			url: '/ajax',
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
	
	function linkify(eSpan) 
	{
		//var replacedText, replacePattern1, replacePattern3;
		var replacePattern2;
		var inputText = $(eSpan).text();
		$(eSpan).text("");
		
		//URLs starting with http://, https://, or ftp://
		//replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
		//replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

		//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
		replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
		//replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
		var replacedArray = inputText.split(replacePattern2);
		
		for (var i =0; i<replacedArray.length; i++)
		{
			var temp = "";
			if (replacePattern2.test(replacedArray[i]))
			{
				temp = replacedArray[i].replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
				$(temp).appendTo(eSpan);
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