/*
All lane/wall functionality is found withing this file.
//<!-- Change log -->
//<!--
	//* ------- 2.0 ------- 
	//* Re-wrote functions and names for sprint 3	
//-->

//<!-- To Do -->
//<!--
	//* Re-create lane creation method to allow better database interactions	
//-->
*/

/*
Adds a new lane to the Wall.
*/
function addLane()
{
	lanes = lanes+1;

	var $laneList = jQuery('<ul/>', {
		id: 'groupItems'+lanes,
		class: 'itemsList',
	}).appendTo(".wall");
	
	$('<li class="list_title"><h3>Lane '+lanes+'</h3> <button class="laneEdit" onclick="notWorking()">Edit Lane</button> </li>').appendTo($laneList);
	
	$($laneList).sortable({
		connectWith: ".itemsList",
		handle: '.dragbar',
		items: "li:not('.list_title')",
	});

}

/*
Checks how many notes are on screen
*/
function laneCount()
{
	var i=0;
	$(".itemsList").each(function (){
		i = i+1;
	});
	lanes = i;
}