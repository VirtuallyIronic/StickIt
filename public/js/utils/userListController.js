function userMakeAdmin(id){
	var url = '/api/user/admin/' + id;
	$.ajax({
		url: url,
		type: 'PUT',
		dataType: 'json',
		success: function(data){
			if(data.error){
				console.log("error: " + data.error.text);
			}
			else {
				window.location.reload();
			}
		},
		error: function(error) {
			window.location.replace('/login');
		}
	});
}
		
function userMakePost(id){
	var url = '/api/user/post/' + id;
	$.ajax({
		url: url,
		type: 'PUT',
		dataType: 'json',
		success: function(data){
			if(data.error){
				console.log("error: " + data.error.text);
			}
			else {
				window.location.reload();
			}
		},
		error: function(error) {
			window.location.replace('/login');
		}
	});
}

function userMakeView(id){
	var url = '/api/user/view/' + id;
	$.ajax({
		url: url,
		type: 'PUT',
		dataType: 'json',
		success: function(data){
			if(data.error){
				console.log("error: " + data.error.text);
			}
			else {
				window.location.reload();
			}
		},
		error: function(error) {
			window.location.replace('/login');
		}
	});
}
function removeUser(id){
	var url = '/api/user/' + id;
	$.ajax({
		url: url,
		type: 'DELETE',
		dataType: 'json',
		success: function(data){
			if(data.error){
				console.log("error: " + data.error.text);
			}
			else {
				window.location.reload();
			}
		},
		error: function(error) {
			window.location.replace('/login');
		}
	});
}