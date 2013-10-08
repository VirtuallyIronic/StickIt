	
	/*-----------------------------WALL---------------------------------*/
	function wallGet(wall_ID)
	{
		$.ajax({ 
			url: '/api/wall/'+wall_ID,
			type: 'GET',
			async: false,
			success: function(data){
				console.log('Wall obtained '+data);
				var output = {data:data, status:true};
				return output;
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
				
				//return output;
			}
		});
		var output = {data:obj,status:false};
		return output;
	}
	
	function wallUpdate(wall_ID, title_data, isPrivate_data)
	{
		$.ajax({ 
			url: '/api/wall/'+wall_ID,
			type: 'PUT',
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
		$.ajax({ 
			url: '/api/post',
			type: 'POST',
			data: JSON.stringify({	col: model_data.col, 
									row: model_data.row,
								//	author: model_data.userName,
									wallId: model_data.wallId,
									username: model_data.username,
									text: model_data.text,
									colour: model_data.colour,
									fontSize: model_data.fontSize,
									}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('New Note');
				console.log(model_data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	
	function noteUpdate(wall_ID, model_data)
	{
		$.ajax({ 
			url: '/api/post/'+wall_ID,
			type: 'PUT',
			data: JSON.stringify({	col: model_data.col, 
									row: model_data.row,
									text: model_data.text,
									colour: model_data.colour,
									fontSize: model_data.fontSize,
								}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('New Note');
				console.log(model_data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	
	function noteDelete(wall_ID)
	{
		$.ajax({ 
			url: '/api/post/'+wall_ID,
			type: 'DELETE',
			success: function(data){
				console.log('Note deleted: '+data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	/*--------------------------------------------------------------*/
	
	/*--------------------------COLUMNS------------------------------------*/
	function colCreate(model_data)
	{
		$.ajax({ 
			url: '/api/colname',
			type: 'POST',
			data: JSON.stringify({	wallId: model_data.wallId, 
									colNum: model_data.colNum,
									title: model_data.title}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('New Col');
				console.log(model_data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});		
	}
	
	function colUpdate(wall_ID, model_data)
	{
		$.ajax({ 
			url: '/api/colname/'+wall_ID,
			type: 'PUT',
			data: JSON.stringify({	colNum: model_data.colNum, 
									title: model_data.title
								}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log('Col Updated');
				console.log(model_data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	
	function colDelete(wall_ID)
	{
		$.ajax({ 
			url: '/api/colname/'+wall_ID,
			type: 'DELETE',
			success: function(data){
				console.log('col Deleted: '+data);
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
	
	function voteDelete(wall_ID)
	{
		$.ajax({ 
			url: '/api/vote/'+wall_ID,
			type: 'DELETE',
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
		$.ajax({ 
			url: '/api/tag',
			type: 'POST',
			data: JSON.stringify({	postId: model_data.postId,
									title: model_data.title}),
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
	
	function tagUpdate(wall_ID, model_data)
	{
		$.ajax({ 
			url: '/api/tag/'+wall_ID,
			type: 'PUT',
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
	
	function tagDelete(wall_ID)
	{
		$.ajax({ 
			url: '/api/tag/'+wall_ID,
			type: 'DELETE',
			success: function(data){
				console.log('tag Deleted: '+data);
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
			}
		});
	}
	/*--------------------------------------------------------------*/