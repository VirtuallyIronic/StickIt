/*
Code to create menus and pop-ups functionality
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
Create a "new note" menu popup
*/

function MenuSpilt(){
	//determines if a focus point is already set.
	
//set focus, run popup, check focus, if no focus run default, if focus collect input.


}

function popMenu()
{
	var tags = [[],[],[]];
	$('#fullscreen').show();
	var $mainMenu = jQuery('<div/>', {
		class: 'popupMenu',
		title: 'Menu',
		tagz: tags,
	})
	$($mainMenu).appendTo("body");
	$("<span id='createTitle'>Note</span></br>").appendTo(".popupMenu");
	$("<div id='popupDetails'></div>").appendTo(".popupMenu");
	
	$("<div id='formDetails'></div>").appendTo("#popupDetails");
	$("<textarea id='formText' rows='10' cols='24'></textarea>").appendTo("#formDetails");
	$("<div id='sideBar'></div>").appendTo("#formDetails");
	
	$("<select id='laneDrop'></select>").appendTo("#sideBar");
	for (i=1; i<=lanes; i++)
	{
		//alert(laneNames[i]);
		$("<option value="+i+">"+i+"</option>").appendTo("#laneDrop");
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
	
	$("<button id='confirmPopup' onclick='newNote()'>Confirm</button>").appendTo("#bottomBar");
	$("<button id='cancelPopup' onclick='closeMenu(this)'>Cancel</button>").appendTo("#bottomBar");
	$mainMenu.draggable();//{ cancel: ".tagLink", cancel: "#formText", containment: ".wall" });
}

/*
Closes a pop-up menu
*/
function closeMenu(field)
{
	$('#fullscreen').hide();
	$(field).parent().parent().parent().remove();
}

/*
Creates an edit menu for a promted note.
*/
function editClick(field)
{
	var editParent = $(field).parent().parent().parent().children(".edit").children(".editSpan"); //Shown Text field
	var currentLane = $(field).parent().parent().parent().attr("laneid"); //Current Lane Pos
	var fullTextCurrent = $(field).parent().parent().parent().children(".edit").attr("fullText"); //Entire Text
	var textEdit = editParent.text(); //Actually shown text
	var laneHolder = $(field).parent().parent().parent().parent(); //li element
	var laneHolderX = $(field).parent().parent().parent().parent().attr("class"); //li element
	laneHolder.attr('id', 'focus');
	
	$('#fullscreen').show();
	jQuery('<div/>', {
		class: 'popupMenu',
		title: 'Menu',
	}).appendTo("body").draggable();
	$("<span id='createTitle'>Note</span></br>").appendTo(".popupMenu");
	$("<div id='popupDetails'></div>").appendTo(".popupMenu");

	$("<div id='formDetails'></div>").appendTo("#popupDetails");
	var $textEdit = jQuery('<textarea/>', {
		id: 'formText',
		rows: '10',
		cols: '24',
	});
	$textEdit.appendTo("#formDetails");
	$textEdit.val(fullTextCurrent);

	$("<div id='sideBar'></div>").appendTo("#formDetails");

	var $laneSelect = jQuery('<select/>', {
		id: 'laneDrop',
	});
	$laneSelect.appendTo("#sideBar");
	$("<p>lol</p>").appendTo("#sideBar");

	for (i=1; i<=lanes; i++)
	{
		$("<option value="+i+">"+i+"</option>").appendTo("#laneDrop");
	}
	$("#laneDrop > [value='"+currentLane+"']").attr("selected", "true");
	var x=10;
	$("<div id='bottomBar'></div>").appendTo("#popupDetails");
	$("<button id='confirmPopup' onclick='confirmEdit(this)'>Confirm</button>").appendTo("#bottomBar");
	$("<button id='cancelPopup' onclick='closeMenu(this)'>Cancel</button>").appendTo("#bottomBar");
}