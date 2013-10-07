//<!-- created by Kirk Mapperson as a demo version of the sticky note process. -->
//<!-- Version 2.0-->
//<!-- Change log -->
//<!--
	//* ------- 1.1 ------- 
	//* Added buttons to notes
	//* Close button prompt and removes its own note
	//* Edit button still not working, continuing on this later.
	
	//* ------- 1.2 ------- 
	//* Edit button working
	//* Note wont create on empty message
	//* Fixed the cancel bug
	//				When you hit cancel, makes a note anyway
	//* Need to allow note to be edited with original text rather then complete override.\
	
		
	//* ------- 1.3 ------- 
	//* Word wrapping and character limits
	
	//* ------- 1.4 ------- 
	//* Note clipping and dragging working
	//*		Will snap within wall space and within a dynamic number of walls
	//*		lanes global var sets lane amounts

	//* ------- 1.5 ------- 
	//* Mass overhaul of the note creation method
	//* Clear wall button added.
	
	//* ------- 1.6 ------- 
	//* Adding new Note methods and sorting
	//* Lanes created
	
	//* ------- 2.0 ------- 
	//* Re-wrote functions and names for sprint 3
	
//<!-- To Do -->
//<!--
	//* Database interactions
//-->
//-->
var lanes = 0;

var userDetails = {
	userLogged: "blank",
	time: "test",
	other: "other"
};

/*
On page load, create new notes and sets current logged in user.
*/
$( document ).ready(function() 
{		
	var r = prompt("Please enter your name","User");
	if (r!=null)
	{
		userNameChange(r);
	}
	
	laneCount();

	var test = [ ["Bob","me www.google.com ssage", 1], ["James", "asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd", 3], ["Harry", "yay", 1] ];
	test.forEach(spawnNote);
	
	$(function() {
		$( ".itemsList" ).sortable({
			connectWith: ".itemsList",
			handle: '.dragbar',
			items: "li:not('.list_title')",
		});
	});
});

/*
Based on input data create all pre-made notes
*/
function spawnNote (elem, index, array)
{
	newNote(array[index]);
}

/*
Set who is logged in
*/
function userNameChange(userName)
{
	userDetails.userLogged = userName;
}

/*
Dummy function
*/
function notWorking()
{
	alert("Does Nothing");
}

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
			$(".note").each(function(){
				$(this).parent().remove();
			});
		}
	}
}