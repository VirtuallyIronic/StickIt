//--------------
/*
**	VERSION 3.3
**	20/09/2013
**	PRE-TESTING
**
**	--FEATURES--
**		- AJAX CALLS
**			- INITIAL AJAX CALL FOR JSON DATA
**			- ALTER LANE COUNT AJAX CALL
**			- UPDATE SERVER DATA
**
*/
//--------------

	/*
	CALLS FOR JSON DATA FROM SERVER
	*/
	function initCall()
	{
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
		$('#fullscreen').hide();
	}
	
	/*
	REQUESTS MORE LANES FROM SERVER
	*/
	function moreLanes(postType)
	{
		if (online == true)
		{		
			if (postType == '0')
			{
				lanes = parseInt(lanes); 			
				lanes=lanes+1;
			}
			else
			{
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
	
	/*
	SEND THE DATA BACK TO SERVER TO BE SAVED
	*/
	function dataUpdate(noteJSON)
	{
		$.ajax({ 
			url: '/dataUpdate',
			type: 'POST',
			//async: false,
			cache: false, 
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(noteJSON),
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