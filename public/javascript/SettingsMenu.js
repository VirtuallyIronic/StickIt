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
		
		wallNails();
		
    });

// load the first settings menu.
        function showSettings(field)
        {
       		$(field).show();
             console.log( "test" );
        }
		
		function wallNails(){
			//<li class="thumbnail"><a href="wall.html"><img src="images/Wall-Sample.png" style="width:300px; height:300px;"></a></li>
			var data = moreLanes();
			for (var i=0; i<data[0]; i++)
			{
				var imgpath = 'images/'+data[1][i];
				var webpath = data[2][i];
				var $thumbnail = jQuery('<li/>', {
					class: 'thumbnail'
				});
				$($thumbnail).appendTo(".multiLine");
				$('<a href="'+webpath+'"> <img src="'+imgpath+'" style="width:300px; height:300px;"> </a>').appendTo($thumbnail);
			}
		}
		
		function moreLanes()
		{	
			var wallNum = new Array();
			$.ajax({ 
				url: '/wallGet',
				type: 'GET',
				async: false,
				success: function(data){
					wallNum = data;
					online = true;
				}, 
				error: function(jqXHR, textStatus, err){
					//alert('text status '+textStatus+', err '+err);
					alert('Offline');
					var wallImg = new Array();
					var wallPath = new Array();
					for (var k=0; k<5; k++)
					{
						wallImg[k] = 'Wall-Sample.png';
						wallPath[k] = 'wall.html';
					}
					wallNum[0] = 5;
					wallNum[1] = wallImg;
					wallNum[2] = wallPath;
					online = false;
				}
			});
			return wallNum;
		}

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

// close the settings menu.
        function hideSettings()
        {
        	var targetName = document.getElementById("mainSettings");
       		$(targetName).fadeOut(5, function() {
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
            var targetName = document.getElementById("sidebar");
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
                $(targetName).transition({y:'100'});
           		$(targetName2).transition({width:'190'});           		
           		$(targetName2).transition({y:'310'});
				
            }
           
        }
 
