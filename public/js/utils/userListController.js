
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/utils/userListController.js
 * Purpose:			Contains form functionality for the userList page.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

// submits a PUT request to the server to make a specified user an admin.
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
			window.location.replace('/error');
		}
	});
}

//submits a PUT request to the server to make a specified user a poster.
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
			window.location.replace('/error');
		}
	});
}

//submits a PUT request to the server to make a specified user viewer.
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
			window.location.replace('/error');
		}
	});
}

//submits a DELETE request to the server to remove that user.
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
			window.location.replace('/error');
		}
	});
}