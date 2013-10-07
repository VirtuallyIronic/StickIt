/*
All note functionality is found withing this file.
//<!-- Change log -->
//<!--
	//* ------- 2.0 ------- 
	//* Re-wrote functions and names for sprint 3	
//-->

//<!-- To Do -->
//<!--
	//* Database interactions
//-->
*/

/*
Creates a new note based on inputted information
*/
function Note(input)
{
	var x = input[1];
	var lanePos = input[2];

	var $listItem = jQuery('<li/>', {
		class: 'item',
	});
	$listItem.appendTo("#groupItems"+lanePos);

	var $note = jQuery('<div/>', {
		class: 'note',
		laneid: lanePos,
		userid: input[0],
	});
	$note.appendTo($listItem);
	
	var $db = jQuery('<div/>', {
		class: 'dragbar',
	});
	$db.appendTo($note);
	
	var $edit = jQuery('<div/>', {
		class: 'edit',
		fulltext: x,
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
	$("<span id='userspan'>Created by: "+input[0]+"  </span>").appendTo($tb);
	$("<span id='closespan'><button class='deleteButton' id='closeb' onclick='deleteNote(this)'> Delete </button></span>").appendTo($tb);
	$("<span id='editspan'><button class='editButton' id='editb' onclick='editClick(this)'> Edit </button></span>").appendTo($tb);
	$("<span id='expandspan'><button class='expandButton' id='expandb' onclick='expandNote(this)'> Expand </button></span>").appendTo($tb);
	
	return $note;
}
  
/*
Creates an expanded version of the note showing text.
*/
function expandNote(field)
{
	var selected = $(field).parent().parent().parent();
	var fullText = $(selected).children(".edit").attr("fullText");
	//create a new div with all details of the original
	$('#fullscreen').show();
	var $exMenu = jQuery('<div/>', {
		class: 'popupMenu',
	}).draggable();
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
	$("<button id='cancelPopup' onclick='closeMenu(this)'>Cancel</button>").appendTo("#bottomBar");
}

/*
Finds the original note to edit via "focus" tag
Then depending on what has changed, editing appropriatly
*/
function confirmEdit(field)
{
	var listItem = document.getElementById('focus').children[0];
	var liq = document.getElementById('focus');
	
	var currentLane = $(listItem).attr("laneid"); //Current Lane Pos
	var lanePos = document.getElementById('laneDrop').value;
	var newLane = 0;
	if (lanePos != currentLane)
	{
		newLane = lanePos;
	}
	var textEdit = $(listItem).children(".edit").children(".editSpan").text(); //Actually shown text
	var fullTextCurrent = $(listItem).children(".edit").attr("fullText"); //Entire Text
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
		textEdit = subText;
	}
	
	if ((newLane != 0) || (subText != null))
	{
		var r=confirm("Confirm?");
		if (r==true)
		{
			$(liq).appendTo("#groupItems"+newLane);
			$(listItem).attr("laneid",newLane);

			$(listItem).children(".edit").attr("fullText",fieldText);
			
			$(listItem).children(".edit").children(".editSpan").text(textEdit);
			linkify($(listItem).children(".edit").children(".editSpan"));
			closeMenu(field);
			laneHolder.attr('id', '');
		}
	}
	else
	{
		closeMenu(field);
		laneHolder.attr('id', '');
	}
}

/*
Creates weblinks from text within a <span> tag
*/
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
  
/*
Permenently removes a note from the wall.
*/
function deleteNote(field)
{
	var r=confirm("Delete Note?");
	if (r==true)
	{
		//CODE HERE TO DELETE TABLE ENTRY
		//SQL REQUEST DELETE NOTE FROM WALL
		//var test = $(field).parent().parent().parent();
		$(field).parent().parent().parent().parent().remove();
	}
}

/*
Based upon who promts function
Creates a note with inputed data
If no inputed data is passed, then no note is created
*/
function newNote(data)
{	
	var lanePos;
	if (document.getElementById('laneDrop'))
	{
		lanePos = document.getElementById('laneDrop').value;
	}
	else
	{
		lanePos = data[2];
	}
		
	var msg;
	if (document.getElementById('formText'))
	{
		msg = document.getElementById('formText').value;
	}
	else
	{
		msg = data[1];
	}
	
	var userCreator;
	if (data !== undefined)
	{
		userCreator = data[0];
	}
	else
	{
		userCreator = userDetails.userLogged;
	}
	var conbut = document.getElementById('confirmPopup');
	closeMenu(conbut);
	
	if (msg==null || msg == "" || msg == 'undefinded')
	{
		msg="";
	}
	else
	{
		var input = [userCreator, msg, lanePos];
		var widthPos;
		var heightPos;

			widthPos = 850;
			heightPos = 85;

		var $newNote = new Note(input);
		//Probably update database around here.
	}
}
/*
Take text and append to note text field
*/
function addTag(field)
{
	var tagText = $(field).text();
	$('#formText').val($('#formText').val()+" "+tagText);
}