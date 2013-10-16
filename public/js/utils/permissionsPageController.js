
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/utils/permissionsPageController.js
 * Purpose:			Contains form functionality for the Wall Permissions page.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

//makes a PUT ajax request for a walluser entry to revert to an admin
function makeAdmin(id){
	var url = '/api/walluser/' + id;
	var formValues = {
		permission: "admin"
	};
	$.ajax({
		url: url,
		type: 'PUT',
		dataType: 'json',
		data: formValues,
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

//makes a PUT ajax request for a walluser entry to revert to a poster
function makePost(id){
	var url = '/api/walluser/' + id;
	var formValues = {
		permission: "post"
	};
	$.ajax({
		url: url,
		type: 'PUT',
		dataType: 'json',
		data: formValues,
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

//makes a PUT ajax request for a walluser entry to revert to a viwer
function makeView(id){
	var url = '/api/walluser/' + id;
	var formValues = {
		permission: "view"
	};
	$.ajax({
		url: url,
		type: 'PUT',
		dataType: 'json',
		data: formValues,
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

//makes a DELETE ajax request to remove a specific walluser entry
function removePermission(id){
	var url = '/api/walluser/' + id;
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