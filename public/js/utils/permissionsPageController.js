function makeAdmin(id){
	var url = '/api/walluser/' + id;
	var formValues = {
		permission: "admin";
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
			window.location.replace('/login');
		}
	});
}
		
function makePost(id){
	var url = '/api/walluser/' + id;
	var formValues = {
		permission: "post";
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
			window.location.replace('/login');
		}
	});
}

function makeView(id){
	var url = '/api/walluser/' + id;
	var formValues = {
		permission: "view";
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
			window.location.replace('/login');
		}
	});
}		

function removePermission(id){
}		

function addPermission(){			
}