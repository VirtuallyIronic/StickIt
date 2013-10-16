	
	/*-----------------------------WALL---------------------------------*/
		function wallGet(wall_ID)
		{
			var output = {};// = {data:obj,status:false};
			console.log("GET WALL");
			console.log(wall_ID);
			var url = '/api/wall/' + wall_ID;
			console.log('URL IS: ' + url);
			$.ajax({
				url: url,
				type: 'GET',
				async: false,
				success: function(data){
					console.log('Wall obtained');
					console.log(data);
					output = {data:data, status:true};
				},
				error: function(jqXHR, textStatus, err){
					console.log('text status '+textStatus+', err '+err);
					output = {data: '', status:false};
					//return output;
				}
			});
			
			if (output.status == false)
			{
				location.redirect('/home');
				output = {data:obj,status:false};
			}
			console.log('output data');
			console.log(output);
			return output;
}
	
	function wallUpdate(wall_ID, title_data, isPrivate_data)
	{
		console.log("WALL UPDATE");
		$.ajax({ 
			url: '/api/wall/'+wall_ID,
			type: 'PUT',
			async: false,
			data: JSON.stringify({title: title_data, isPrivate: isPrivate_data}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('Wall updated: title: '+title_data+' isPrivate: '+isPrivate_data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	
	function wallCreate()
	{
	
	}
	function wallDelete()
	{
	
	}
	/*---------------------------NOTES-----------------------------------*/
	function newNotePost(model_data)
	{
		console.log("NEW NOTE");
		console.log(model_data);
		$.ajax({ 
			url: '/api/post',
			type: 'POST',
			async: false,
			data: JSON.stringify({	col: model_data.get('col'), 
									row: model_data.get('row'),
								//	author: model_data.userName,
									wallId: model_data.get('wallId'),
									username: model_data.get('username'),
									text: model_data.get('text'),
									colour: model_data.get('colour'),
									fontSize: model_data.get('fontsize'),
									stringtags: model_data.get('stringtags')
									}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('New Note');
				console.log(model_data);
				//location.reload(); 
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	
	function noteUpdate(id, model_data)
	{
		console.log("-----UPDATE NOTE---ID---------");
		console.log(id);
		console.log("----------DATA-------");
		console.log(model_data);
		console.log("-----------------");
		var url = '/api/post/' + id;
		$.ajax({ 
			url: url,
			type: 'PUT',
			async: false,
			data: JSON.stringify({	col: model_data.get('col'), 
									row: model_data.get('row'),
									text: model_data.get('text'),
									colour: model_data.get('colour'),
									fontSize: model_data.get('fontsize'),
									stringtags: model_data.get('stringtags')
								}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('New Note');
				console.log(model_data);
				//location.reload(); 
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	
	function note_Delete(id)
	{
		console.log("--------DELETE NOTE--ID-------");
		console.log(id);
		console.log("----------------");
		var url = '/api/post/' + id;
		$.ajax({ 
			url: url,
			type: 'DELETE',
			async: false,
			success: function(data){
				console.log('Note deleted: '+data);
				//location.reload(); 
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	/*--------------------------------------------------------------*/
	
	/*--------------------------COLUMNS------------------------------------*/
	function addLanes()
	{
		//alert("!");
		var modelData = ({wallId:initWall.id,colNum:(initWall.totalCols+1),'title': "Lane "+(initWall.totalCols+1)});
		colCreate(modelData);
	}
	
	function clearWall()
	{
		var modelData = ({wallId:initWall.id});
		killAllWall(modelData);
	}
	
	function killAllWall(model_data){
		/*ASK USER FOR CONFIRMATION*/
		var r=confirm("Delete ALL Notes?");
		if (r==true)
		{
			var url = '/api/clearwall/' + model_data.wallId;
			$.ajax({
				url: url,
				type: 'DELETE',
				async: false,
				dataType: "json",
				success: function(data){
					location.reload(); 
				}, 
				error: function(jqXHR, textStatus, err){
					console.log('text status '+textStatus+', err '+err);
				}
			});
		}
	}
	
	function showSettings()
	{
		var modelData = ({wallId:initWall.id});
		redirectToSettings(modelData);
	}
	
	function redirectToSettings(model_data){
		var url = "/wallsettings/" + model_data.wallId;
		console.log(url);
		window.location = url;
	}
	
	function colCreate(model_data)
	{
		console.log('COLCREATE');
		console.log(model_data);
		$.ajax({ 
			url: '/api/colname',
			type: 'POST',
			async: false,
			data: JSON.stringify({	wallId: model_data.wallId, 
									colNum: model_data.colNum,
									title: model_data.title}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('New Col');
				console.log(model_data);
				location.reload(); 
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});		
	}
	
	function colUpdate(id, model_data)
	{
		console.log('COLUPDATE');
		console.log(model_data);
		$.ajax({ 
			url: '/api/colname/'+id,
			type: 'PUT',
			async: false,
			data: JSON.stringify({	colNum: model_data.colNum, 
									title: model_data.title
									}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('Col Updated');
				console.log(model_data);
				location.reload(); 
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	
	function colDelete(id)
	{
		console.log('COLDELETE');
		console.log(id);
		$.ajax({ 
			url: '/api/colname/'+id,
			type: 'DELETE',
			async: false,
			success: function(data){
				console.log('col Deleted: '+data);
				location.reload(); 
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	/*--------------------------------------------------------------*/
	
	/*----------------------------VOTES----------------------------------*/
	function voteNew(model_data)
	{
		$.ajax({ 
			url: '/api/vote',
			type: 'POST',
			async: false,
			data: JSON.stringify({postId: model_data.postId}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('New Vote');
				console.log(model_data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});		
	}
	
	function voteGet(id)
	{
		$.ajax({ 
			url: '/api/vote/'+id,
			type: 'GET',
			async: false,
			success: function(data){
				console.log('Get Vote');
				console.log(data);
				return data;
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});	
		return false;
	}
	
	function voteDelete(id)
	{
		$.ajax({ 
			url: '/api/vote/'+id,
			type: 'DELETE',
			async: false,
			success: function(data){
				console.log('vote Deleted: '+data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	/*--------------------------------------------------------------*/
	
	/*--------------------------TAGS------------------------------------*/
	function tagNew(model_data)
	{
		console.log('NEW TAG');
		console.log(model_data);
		$.ajax({ 
			url: '/api/tag',
			type: 'POST',
			async: false,
			data: JSON.stringify({	postId: model_data.get('noteID'),
									text: model_data.get('tagItem')}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('New Vote');
				console.log(model_data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});	
	}
	
	function tagUpdate(id, model_data)
	{
		$.ajax({ 
			url: '/api/tag/'+id,
			type: 'PUT',
			async: false,
			data: JSON.stringify({title: model_data.title}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('Tag Updated');
				console.log(model_data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	
	function tagDelete(id)
	{
		console.log('TAG DELETE');
		console.log(id);
		$.ajax({ 
			url: '/api/tag/'+id,
			type: 'DELETE',
			async: false,
			success: function(data){
				console.log('tag Deleted: '+data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	/*--------------------------------------------------------------*/