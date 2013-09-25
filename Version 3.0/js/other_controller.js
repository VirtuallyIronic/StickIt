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
	function clearWall()
	{
		/*ASK USER FOR CONFIRMATION*/
		var r=confirm("Delete ALL Notes?");
		if (r==true)
		{
			/*ASK USER FOR CONFIRMATION*/
			var rr=confirm("Are you sure?");
			if (rr==true)
			{
				/*FIND ALL NOTES VIA SERIALIZE*/
				var serialGrid = gridster.serialize();
				for (var i=0; i<serialGrid.length; i++)
				{
					/*FOR EACH NOTE
					  FIND GRIDSTER ELEMENT
					  REMOVE IT
					*/
					var col = serialGrid[i].col;
					var row = serialGrid[i].row;
					var widget = gridster.is_widget(col,row);
					gridster.remove_widget(widget);
				}
				/*delete all model data*/
				listView.trigger('completeDelete');
			}
		}
	}
	
	/*
	CHECKS IF CURRENT USER IS AN ADMIN
	MISSING SERVER REQUEST FOR DATA
	*/
	function adminCheck()
	{
		//check if the current user is an admin
		var r=confirm("Confirm Admin -test-");
		if (r==true)
		{
			admin = true;
		}
		else
		{
			admin = false;
		} 
		if (admin == true)
		{
			alert('admin');
		}
		else
		{
			var hideItem = document.getElementById('newLaneBut');
			$(hideItem).hide();
			//document.getElementById('newLaneBut').hide();
			alert('not admin');
		}
	}
	
	/*
	USING HTML2CANVAS.JS, CREATE SCREEN SHOT OF THE WALL
	*/
	function screenCap()
	{
		var test = window.open();
		html2canvas($('.demo'), {
			onrendered: function(canvas) {
				$(test.document.body).html(canvas);
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