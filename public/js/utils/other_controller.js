//--------------
/*
**	VERSION 3.3
**	20/09/2013
**	PRE-TESTING
**
**	--FEATURES--
**		- DELETE ALL NOTES FROM THE WALL
**		- CREATE AN IMG OF THE WALL
**		- REMOVE A SINGLE NOTE
**		- ADMIN CHECK
**		
*/
//--------------

	/*
	Remove all notes on wall
	*/

	
	/*
	CHECKS IF CURRENT USER IS AN ADMIN
	MISSING SERVER REQUEST FOR DATA
	*/
function adminCheck()
	{
		//check if the current user is an admin
		checkAdminAJAX();
	}
	
	/*
	USING HTML2CANVAS.JS, CREATE SCREEN SHOT OF THE WALL
	*/
	function screenCap()
	{
		var test = window.open();
		html2canvas($('.demo'), {
			onrendered: function(canvas) {
				var img = canvas.toDataURL("image/png");
				//window.location.href=img;
				var open = window.open('','','width=500,height=500')
				open.document.write('<img id="img" style="width="400">');
				open.document.getElementById('img').setAttribute('src', img);
				//$(test.document.body).html(canvas);
			}
		});
	}
	
	/*
	REMOVES THE SELECTED WIDGET
	*/
	function removeWidgets(field)
	{
		gridster.remove_widget(field);
	}