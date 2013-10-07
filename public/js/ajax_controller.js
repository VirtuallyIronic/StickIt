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

//-------NOTES-------
	function updateNote(modelData)
	{
		var mD = modelData;
		//alert('Updating Note...');
		
		$.ajax({ 
			url: '/updateNote',
			type: 'POST',
			cache: false,
			async: false,			
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(mD),
			success: function(data){
				//LANE ALTERED
				//alert('Updated Notes')
			}
			, error: function(jqXHR, textStatus, err){
				//alert('ERROR text status '+textStatus+', err '+err)
			}
		});	
	}
	
	function removeNote(modelData)
	{
		//alert('Removing Note...');
		var mD = modelData;
		
		$.ajax({ 
			url: '/removeNote',
			type: 'POST',
			cache: false,
			async: false,			
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(mD),
			success: function(data){
				//LANE ALTERED
				if (data.status == true)
				{
					//alert('Note Deleted!')
				}
				else
				{
					//alert('ERROR: PLEASE LOG IN')
				}
				//location.reload(true);
			}
			, error: function(jqXHR, textStatus, err){
				//alert('ERROR text status '+textStatus+', err '+err)
				//location.reload(true);
			}
		});
	}
	
	function newInsert(modelData)
	{
		//alert('Adding Note...');
		var mD = modelData;
	
		$.ajax({ 
			url: '/newInsert',
			type: 'POST',
			cache: false,
			async: false,			
			dataType: 'json',
			contentType: "application/json",
			data: JSON.stringify(mD),
			success: function(data){
				//LANE ALTERED
				if (data.status == true)
				{
					//alert('New note added...')
				}
				else
				{
					//alert('ERROR: PLEASE LOG IN')
				}
				//location.reload(true);
			}
			, error: function(jqXHR, textStatus, err){
				//alert('ERROR text status '+textStatus+', err '+err)
				//location.reload(true);
			}
		});
	}
	
	function getWallNotes()
	{
		//alert('GET WALL NOTES');
		$.ajax({ 
			url: '/getNote/'+wallID,
			type: 'GET',
			async: false,
			success: function(data){
				//alert("SUCCESS WALL DATA "+data);
				online = true;
				notes = data;
			}, 
			error: function(jqXHR, textStatus, err){
				////alert('text status '+textStatus+', err '+err);
				//alert('FAILURE WALL NOTES: Offline Mode: ON');
				online = false;
			}
		});
	}
//--------------

//------WALLS--------

	
	function getWallInfo()
	{
		//alert('GET WALL DATA (HEADINGS ETC.)');
		$.ajax({ 
			url: '/getWall/'+wallID,
			type: 'GET',
			async: false,
			success: function(data){
				//alert('SUCCESS WALL DATA '+data);
				//online = false;
				lanes = data.cols;
				for (var i=0; i<lanes; i++)
				{
					var laneID = (i+1);
					wallHeadings[i] = data.headings[i]
				}
				////alert("success");
			}, 
			error: function(jqXHR, textStatus, err){
				////alert('text status '+textStatus+', err '+err);
				//alert('FAILED WALL DATA: Offline Mode: ON');
				lanes = 5;
				for (var i=0; i<lanes; i++)
				{
					var laneID = (i+1);
					wallHeadings[i] = 'Lane '+laneID;
				}
				online = false;
			}
		});
	}
	
	function insertWall()
	{
		//ADD NEW WALL
	}
	function removeWall()
	{
		//REMOVE A WALL
	}
	function editWall()
	{
		//wallHeadings
		//lanes
		
		//CHANGE COLUMNS AND HEADINGS: WALL
	}
	//--------------

	function userInformation()
	{
		//alert('GET user info');
		$.ajax({ 
			url: '/getUserInfo',
			type: 'get',
			async: false,
			success: function(data){
				//LANE ALTERED
				if (data.status == false)
				{
					//alert('FAILURE PLEASE LOG IN -> REDIRECTING');
					////alert('REDIRECT TO HOME PAGE DUE TO LACK OF PRIBLIGES');
					var r=confirm("YES-> Redirect NO-> Testing page");
					if (r==true)
					{
						document.location.href='Homepage.html';
					}	
				}
				else
				{
					//alert('SUCCESS User info data');
					checkAdmin(data.userID);
					currentUser = data.userName;
					currentUser_ID = data.userID;
					confirmLogin = true;
				}
			}
			, error: function(jqXHR, textStatus, err){
				//alert('USER INFO ERROR text status '+textStatus+', err '+err)
				currentUser = 'Kyas';
				currentUser_ID = 1;
				confirmLogin = true;
				admin = true;
			}
		});
	}
	
	function checkAdmin(userdata)
	{
		////alert('ADMIN CHECK');
		$.ajax({ 
			url: '/checkPrivleges',
			type: 'POST',
			async: false,
			data: JSON.stringify({walldata: wallID, userID: userdata}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				////alert("CHECK PRIV success "+data);
				if (data.access == false)
				{
					////alert('FAILURE NO PERMISSION -> REDIRECTING');
					var r=confirm("YES-> Redirect NO-> Testing page");
					if (r==true)
					{
						document.location.href='Homepage.html';
					}		
				}
				else
				{
					if (data.admin == false)
					{
						//alert('IS NOT AN admin -> hiding data');
						var hideItem = document.getElementById('clearNoteButton');
						$(hideItem).hide();
						admin = false;
					}
					else
					{
						//alert('admin CONFIRMED');
						admin = true;
						var hideItem = document.getElementById('clearNoteButton');
						$(hideItem).show();
					}
				}
			}, 
			error: function(jqXHR, textStatus, err){
				//alert('AJAX ADMIN ERROR');
				//alert('text status '+textStatus+', err '+err);
			}
		});
	}

//--------------

//--------------

//--------------

//--------------
	function addNewUser()
	{
	
	}
	function deleteAUser()
	{
	
	}
	function editAUser()
	{
	
	}
	
	function addPermissons()
	{
	
	}
	function removePermissions()
	{
	
	}
	function updatePermissions()
	{
	
	}

	function preformLogin()
	{
		var u = document.getElementById('username').value;
		var p = document.getElementById('password').value;
		loginUser(u,p);
	}
	
	function preformLoginOut()
	{
		if (confirmLogin = true)
		{
			logoutUser();
		}
	}
	
	function loginUser(user, pass)
	{
		//alert('Logging in...');
		$.ajax({ 
			url: '/login',
			type: 'POST',
			data: JSON.stringify({user: user, PW: pass}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				//alert("login success "+data);
				if (data.user != null)
				{
					//alert("SUCCESS LOGIN: " +data.user);
					location.reload();
					//userInformation();
					//gridster.enable();
				}
				else
				{
					if (data.login == true)
					{
						//alert("Please Logout");
						//redirect?
					}
					else
					{
						//alert("Bad Details");
					}
				}
				//userInformation();
			}, 
			error: function(jqXHR, textStatus, err){
				//alert('text status '+textStatus+', err '+err);
			}
		});
	}
	
	function logoutUser()
	{
		//alert('Logging out...');
		$.ajax({ 
			url: '/logoutUser',
			type: 'GET',
			success: function(data){
				if (data.status == false)
				{
					//alert("Not Logged in... "+data.status);
				}
				else
				{
					//alert("Logged Out! "+data.status);
					location.reload();
				}
			}, 
			error: function(jqXHR, textStatus, err){
				//alert('text status '+textStatus+', err '+err);
			}
		});
	}
	
	/*
		CALLS FOR JSON DATA FROM SERVER
	*/
	function initCall()
	{
		$('#fullscreen').show();
		userInformation();
		getWallNotes();
		getWallInfo();
		$('#fullscreen').hide();
	}