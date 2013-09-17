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
        

  
            $(function() {
                $( "#slider" ).slider({
                value:100,
                min: 0,
                max: 15,
                step: 1,
                slide: function( event, ui ) {
            $( "#amount" ).val(  ui.value + " Lanes");
            }
    });
    $( "#amount" ).val( $( "#slider" ).slider( "value" ) + " Lanes");
  });
  


    });

// load the first settings menu.
        function showSettings(field)
        {
       		$(field).show();
             console.log( "test" );
        }


function showUserSettings(field, sender, placeBtn)
        {
            $(field).show();
            $(sender).hide();
            $(placeBtn).show();
        }

function hideUserSettings(field, sender, placeBtn)
        {
            $(field).hide();
            $(sender).hide();
            $(placeBtn).show();

        }



// close the settings menu.
        function hideSettings(field)
        {
       		$(field).hide();
        }
// the swap function between setting boxes.
        function goToPane(field, target)
        {
        $(field).fadeOut(1000, function(){
            $(field).hide();
        });
        $(target).fadeIn(1000, function(){

        });
        }
 

        function sideMenuOpen(){
            var targetName = document.getElementById("list1");
            if($(targetName).width() == 300){
                $(targetName).transition({width:'39px'});
                $(targetName).width(39);
                
            }else{
                $(targetName).transition({width:'300px' });
                $(targetName).width(300);
           
            }
           
        }
 
