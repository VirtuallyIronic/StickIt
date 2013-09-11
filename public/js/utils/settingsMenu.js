$( document ).ready(function() {
	console.log( "document loaded" );
	function DropDown(el) {
		this.dd = el;
		this.initEvents();
	}
	
	DropDown.prototype = {
		initEvents : function() {
			var obj = this;
			obj.dd.on('click', function(event){
				$(this).toggleClass('active');
				event.stopPropagation();
			});	
		}
	}

	$(function() {
		var dd = new DropDown( $('#dd') );
		$(document).click(function() {
			// all dropdowns
			$('.wrapper-dropdown-5').removeClass('active');
		});
	});
});

// load the first settings menu.
function showSettings(field) {
	$(field).show();
}
// close the settings menu.
function showSettings(field) {
	$(field).hide();
}
// the swap function between setting boxes.
function goToPane(field, target) {
	$(field).fadeOut(1000, function(){
		$(field).hide();
	});
	$(target).fadeIn(1000, function(){
		
	});
}

function sidemenuOpen(field){
	alert(test);
}
 
