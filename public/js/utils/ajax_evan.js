	
	/*-----------------------------WALL---------------------------------*/
	function wallGet(wall_ID)
	{
		var output = {};// = {data:obj,status:false};
		console.log(wall_ID);
		var url = '/api/wall/' + wall_ID;
		console.log('URL IS: ' + url);
		$.ajax({ 
			url: url,
			type: 'GET',
			async: false,
			success: function(data){
				console.log('Wall obtained '+data);
				output = {data:data, status:true};
			}, 
			error: function(jqXHR, textStatus, err){
				console.log('text status '+textStatus+', err '+err);
				output = {data: '', status:false};
				//return output;
			}
		});
		
		var  obj = {"id": "eJU6kroyQ",
					"title": "Console Wall",
					"owner": "x1TzuEjk",
					"isPrivate": true,
					"permission": "admin",
					"totalCols": 2,
					"cols": [
						{
							"id": 1,
							"wallId": "eJU6kroyQ",
							"colNum": 1,
							"title": "One"
						},
						{
							"id": 2,
							"wallId": "eJU6kroyQ",
							"colNum": 2,
							"title": "Two"
						}
					],
					"posts":[
							{
								"id": 1,
								"col": 1,
								"row": 1,
								"wallId": "eJU6kroyQ",
								"username": "vass",
								"text": "blah",
								"colour": "#FFFFFF",
								"fontSize": 15,
								"vote": [],
								"tag": []
							},
							{
								"id": 2,
								"col": 2,
								"row": 1,
								"wallId": "eJU6kroyQ",
								"username": "kirk",
								"text": "NOPE",
								"colour": "#FFFFFF",
								"fontSize": 15,
								"vote": [{
										'noteID': 2,
										}
								],
								"tag": []
							},
														{
								"id": 3,
								"col": 1,
								"row": 1,
								"wallId": "eJU6kroyQ",
								"username": "vass",
								"text": "Preas",
								"colour": "#FFFFFF",
								"fontSize": 15,
								"vote": [{
										'noteID': 3,
										},
										{
										'noteID': 3,
										}],
								"tag": [{
										'noteID': 1,
										'tagItem': 'TEXT TAG'
										}]
							}
							
						]
					};
		if (output.status == false)
		{
			output = {data:obj,status:false};
		}
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
	
	function noteUpdate(id, model_data)
	{
		$.ajax({ 
			url: '/api/post/'+id,
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
	
	function noteDelete(id)
	{
		$.ajax({ 
			url: '/api/post/'+id,
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
	
	function colUpdate(id, model_data)
	{
		$.ajax({ 
			url: '/api/colname/'+id,
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
	
	function colDelete(id)
	{
		$.ajax({ 
			url: '/api/colname/'+id,
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
	
	function voteGet(id)
	{
		$.ajax({ 
			url: '/api/vote'+id,
			type: 'GET',
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
	
	function tagUpdate(id, model_data)
	{
		$.ajax({ 
			url: '/api/tag/'+id,
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
	
	function tagDelete(id)
	{
		$.ajax({ 
			url: '/api/tag/'+id,
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