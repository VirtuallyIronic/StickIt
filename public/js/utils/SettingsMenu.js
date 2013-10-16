    /*
	/	Version 1.1
	/	
	/
	*/
	var online = true;

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

		function showUserSettings(field, sender, placeBtn)
        {
           $('sender').transition({ rotate: '45deg' });
            $(field).show();
            $(sender).hide();
            $(placeBtn).show();
        }

		function hideUserSettings(field, sender, placeBtn)
        {
             $('sender').transition({ rotate: '45deg' });
            $(field).hide();
            $(sender).hide();
            $(placeBtn).show();

        }
        function hideSettings()
        {
			var targetName = document.getElementById("wrapper");
       		$(targetName).fadeOut(10, function() {
       			$(targetName).hide();
       		});

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
            var targetName = document.getElementById("sidebarSlider");
            var targetName2 = document.getElementById("sidemenu");
            if($(targetName).width() == 300){
                $(targetName).transition({y:'0'});
                $(targetName2).transition({y:'0'});
                $(targetName).delay(30).hide(0);
                $(targetName).transition({width:'39px'});
                $(targetName2).transition({width:'100'});

                
                
            }else{
                $(targetName).transition({width:'300px' });
                
                $(targetName).show();
                $(targetName).transition({y:'50'});
           		$(targetName2).transition({width:'190'});           		
				
            }
           
        }

 		function sideMenuOpen2(){
            var targetName = document.getElementById("sidebarSlider");
            var targetName2 = document.getElementById("sidemenu");
	//closing the menu
            if($(targetName2).width() == 300){
                $(targetName).delay(30).fadeOut(800, function(){   });
                $(targetName2).transition({width:'100'});

                
                


	//opening the menu                
            }else{

                $(targetName).fadeIn(800, function(){     });
           
                $(targetName2).transition({width:'300'});           		

				
            }
           
        }

    function colourChange(field){
    console.log("colour clicked");
    	var c=field.style.background;
    	//$('#mainMenu').attr('tempColour',c);
    	document.getElementById('mainMenu').tempColour=c;
	
		var c=document.getElementsByClassName('colourOption')
    	for(var i=0; i<c.length;i++){
    		c[i].id='';
    	};
    		
    	field.id='colourSelected';

    }
