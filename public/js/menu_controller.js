//--------------
/*
**	VERSION 3.3
**	20/09/2013
**	PRE-TESTING
**
**	--FEATURES--
**		- CLOSE CURRENT MENU
**		- CREATE NEW NOTE MENU / EDIT NOTE MENU
**		- APPEND  PRE-MADE TAG TO TEXT BOX
**		- TRIGGER LISTENER FOR NEW NOTE
**		- SEND EDIT DATA TO NOTE
**		- CALCULATE COLOUR OF NOTE BORDER AND TEXT
**		- CREATE NEW HTML ELEMENT NOTE
**		- CHANGE HTTP OR WWW TEXT TO URL HYPERLINK
**		- CREATE LARGER VIEW OF NOTE FOR ALL TEXT
*/
//--------------

	/*
	CLOSES ANY POPUP MENU OPEN
	*/
	function closeMenu()
	{
		$('#fullscreen').hide();
		$('.popupMenu').remove();
	}

	/*
	OPENS POP-UP MENU (NEW OR EDIT)
	*/
	function popMenu(data)
	{
		var edit = true;
		var bonusTry = data;
		if (data.$el.selector == '.wall')
		{
			edit = false;
		}
		$('#fullscreen').show();
		var $mainMenu = jQuery('<div/>', {
			class: 'popupMenu',
			title: 'Menu',
			tempData: bonusTry,
		})
		$($mainMenu).appendTo("body");
		$("<span id='createTitle'>Note</span></br>").appendTo(".popupMenu");
		$("<div id='popupDetails'></div>").appendTo(".popupMenu");
		
		$("<div id='formDetails'></div>").appendTo("#popupDetails");
		
		var $textEdit = jQuery('<textarea/>', {
			placeholder:"Your text goes here.",
			id: 'formText',
			rows: '10',
			cols: '24',
		});
		$textEdit.appendTo("#formDetails");
		$textEdit.focus();
		$("<div id='sideBar'></div>").appendTo("#formDetails");
		

		if (edit == true)
		{
			$textEdit.val(data.model.get('text'));
		}
		//------------------------------------------------
		if (edit != true)
		{
			$("<p>Lane</p>").appendTo("#sideBar");
			var $laneSelect = jQuery('<select/>', {
				id: 'laneDrop',
			});
			$laneSelect.appendTo("#sideBar");

			for (i=1; i<=lanes; i++)
			{
				var arrayFix = (i-1);
				$("<option value="+i+">"+wallHeadings[arrayFix]+"</option>").appendTo("#laneDrop");
			}
		}
		//------------------------------------------------

		$("<p>Colour</p>").appendTo("#sideBar");

		var $colourSelect = jQuery('<select/>', {
			id: 'colourDrop',
		});
		$colourSelect.appendTo("#sideBar");

		$("<option value='#E6E6E6'>white</option>").appendTo("#colourDrop");
		$("<option value='#CCCC00'>yellow</option>").appendTo("#colourDrop");
		$("<option value='#33CCFF'>blue</option>").appendTo("#colourDrop");
		$("<option value='#FF0000'>red</option>").appendTo("#colourDrop");
		
		$("<option value='#860e20'>860e20</option>").appendTo("#colourDrop");
		$("<option value='#4246ce'>4246ce</option>").appendTo("#colourDrop");
		$("<option value='#5aa6c8'>5aa6c8</option>").appendTo("#colourDrop");
		$("<option value='#ee740e'>ee740e</option>").appendTo("#colourDrop");
		$("<option value='#1b5733'>1b5733</option>").appendTo("#colourDrop");
		$("<option value='#605d60'>605d60</option>").appendTo("#colourDrop");
		$("<option value='#9717e5'>9717e5</option>").appendTo("#colourDrop");
		$("<option value='#f4504a'>f4504a</option>").appendTo("#colourDrop");
		$("<option value='#f7fa53'>f7fa53</option>").appendTo("#colourDrop");

		//------------------------------------------------

		$("<p>Font Size</p>").appendTo("#sideBar");

		var $sizeSelect = jQuery('<select/>', {
			id: 'sizeDrop',
		});
		$sizeSelect.appendTo("#sideBar");
		var sizeFont = 15;
		for (var i=0; i<17; i++)
		{
			$("<option value='"+sizeFont+"'>"+sizeFont+"</option>").appendTo("#sizeDrop");
			sizeFont = sizeFont+5;
		}
		
		if (edit == true)
		{
			$("#sizeDrop > [value='"+data.model.get('fontsize')+"']").attr("selected", "true");
			$("#colourDrop > [value='"+data.model.get('color')+"']").attr("selected", "true");
		}
		
		//------------------------------------------------
		$("<p>TAG</p>").appendTo("#sideBar");

		$('<input class="userText" type="text" name="user" placeholder="e.g. Worked Well">').appendTo('#sideBar');
		$("<button class='tagButton' onclick='addUserTag(this)'>Add Tag</button>").appendTo("#sideBar");
		//------------------------------------------------
		
		$("<div id='bottomBar'></div>").appendTo("#popupDetails");
		if (edit === true)
		{
			$("<button id='confirmEdit' >Confirm</button>").appendTo("#bottomBar");
			$('#confirmEdit').on('click', data.processing);
		}		
		//if (edit === false)
		else {
			$("<button id='confirmPopup' >Confirm</button>").appendTo("#bottomBar");
			$('#confirmPopup').on('click', data.prepareItem);
		}
		$("<button id='cancelPopup' onclick='closeMenu()'>Cancel</button>").appendTo("#bottomBar");
				
		$("<div id='newTags' class='newTagBar'></div>").appendTo("#bottomBar");
		$("<div id='oldTags' class='oldTagBar'></div>").appendTo("#bottomBar");
		if (edit === true)
		{
			//var tags = data.model.get('tagged');
			//var tagName = $(e.target).parent().children('.userText').val();
					//var tagged = field.model.get('tagged');
			var tags = new Array();
			//alert(field.tagging.length);
			var tagCount = 0;
			data.tagging.each(function (obj){
				//alert('test');
				//alert(obj);
				tags[tagCount] = obj.get('tagItem');
				tagCount++;
			},this);
			var tagSize = _.size(tags);//.length;

			if (!tags[0])
			{
			}
			else
			{
				for (var i=0; i<tagSize; i++)
				{
					$("<span class='tagSpan' <span>TAGGED: </span><span class='taggedUser'> "+tags[i]+"</span> </span><br/>").appendTo(".oldTagBar");	
				}	
			}			
		}
	}
	
	/*
	UNUSED(?): APPENDS TEXT TO NOTE TEXT BOX
	*/
	function addUserTag(field){
		var tagName = $(field).parent().children('.userText').val();
		if (tagName != 'undefined' && tagName != '')
		{
			$("<span class='tagRemoval' <span>New: </span><span class='taggedUser'> "+tagName+"</span> (click to remove)</span><br/>").appendTo(".newTagBar");	
		}
		var tagName = $(field).parent().children('.userText').val('');
	}
			

	/*
	BUTTON STOPPED WORKING, WORKAROUND
	*/
	function newNoteWorkaround(){
		listView.trigger('newNote');
	}

	/*
	GETS DATA FROM EDIT FOR NOTE
	*/
	function confirmEdit(field)
	{
		var tags = document.getElementById('newTags');
		var tagged = new Array();
		var tagSize = $(tags).children().length;
		var count = 0;

		for (var i=1; i<tagSize; i=i+3)
		{
			tagged[count] = $(tags).children().eq(i).text();
			count=count+1;
		}
		var checkSize = _.size(tagged);
		var fullTextCurrent = field.model.get('text');
		var fieldText = document.getElementById('formText').value;
		var subText = null;
		if (fieldText != fullTextCurrent)
		{
			subText = fieldText;
			if (subText.length>144)
			{
				subText = subText.substr(0, 140);
				subText += " ...";
			};
		}
		
		var newColour = document.getElementById('colourDrop').value;
		var oldColour = field.model.get('color');
		
		var newFontSize = document.getElementById('sizeDrop').value;
		var oldFontSize = field.model.get('fontsize');
		
		if ((newColour != oldColour) || (subText != null) || (newFontSize != oldFontSize) || (checkSize>0))
		{
			var r=confirm("Confirm?");
			if (r==true)
			{
				var output = [];
				output[0] = fieldText;
				output[1] = newColour;
				output[2] = newFontSize;
				if (checkSize >0)
				{
					output[3] = tagged;
				}
				else
				{
					output[3] = 0;
				}
				return output;
			}
		}
		else
		{
			return null;
		}
	}

	/*
	SET TOP AND BOTTOM BARS TO A DARKER SHADE OF NOTE COLOUR
	*/
	function getTintedColor(color, v) {
		if (color.length >6) { color= color.substring(1,color.length)}		
		var rgb = parseInt(color, 16); 
		var r = Math.abs(((rgb >> 16) & 0xFF)+v); if (r>255) r=r-(r-255);
		var g = Math.abs(((rgb >> 8) & 0xFF)+v); if (g>255) g=g-(g-255);
		var b = Math.abs((rgb & 0xFF)+v); if (b>255) b=b-(b-255);
		r = Number(r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r).toString(16); 
		if (r.length == 1) r = '0' + r;
		g = Number(g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g).toString(16); 
		if (g.length == 1) g = '0' + g;
		b = Number(b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b).toString(16); 
		if (b.length == 1) b = '0' + b;
		return "#" + r + g + b;
	}
	
	/*
	CHECK IF TEXT SHOULD BE WHITE OR BLACK DEPENDING ON BACKGROUND
	*/
	function getContrastYIQ(hexcolor){
		if (hexcolor.length >6) { hexcolor= hexcolor.substring(1,hexcolor.length)}
		var r = parseInt(hexcolor.substr(0,2),16);
		var g = parseInt(hexcolor.substr(2,2),16);
		var b = parseInt(hexcolor.substr(4,2),16);
		var yiq = ((r*299)+(g*587)+(b*114))/1000;
		return (yiq >= 128) ? 'black' : 'white';
	}
	
	/*
	CREATES NEW HTML ELEMENT NOTE
	*/
	function Note(input)
	{	
		//alert();
		var x = input.model.get('text');
		var lanePos = input.model.get('col');
		
		var $note = jQuery('<div/>', {
			class: 'cssnote',
		});
		var fontColour = getContrastYIQ(input.model.get('color'));
		$(input.el).css("background-color", input.model.get('color'));
		$($note).appendTo($(input.el));
		
		var $db = jQuery('<div/>', {
			class: 'dragbar',
		});
		$db.appendTo($note);
		
		var $edit = jQuery('<div/>', {
			class: 'edit'
		});
		/*
		if (x.length>144)
		{
			x = x.substr(0, 140);
			x += " ...";
		};
		*/
		$edit.appendTo($note);
		
		var $eSpan = jQuery('<span/>', {
			class:'editSpan',
		});
		$($eSpan).css("fontsize", input.model.get('fontsize')+"px");
		$($eSpan).css("color", fontColour);
		$($eSpan).text(x);
		$($eSpan).appendTo($edit);
		linkify($eSpan);
			
		var $tb = jQuery('<div/>', {
			class: 'toolbar',
		});
		$tb.appendTo($note);
		var oldColour = input.model.get('color');
		var colour = getTintedColor(oldColour, -75);
		$($db).css("background-color", colour);
		$($tb).css("background-color", colour);
		
		var voteScore = input.model.get('votes');
		var authorUser = input.model.get('username');
		//var authorUser = input.model.get();
		$("<span id='votespan'>Votes:"+voteScore+"   .</span>").appendTo($tb);
		$("<span id='userspan'>Created by: "+authorUser+"  </span>").appendTo($tb);
		$("<span id='closespan'><button class='deleteButton'> Delete </button></span>").appendTo($tb);
		$("<span id='editspan'><button class='editButton' > Edit </button></span>").appendTo($tb);
		$("<span id='expandspan'><button class='expandButton'> Expand </button></span>").appendTo($tb);
		
		
		var votedList = input.model.get('voted');
		var votedLength = _.size(votedList);
		var alreadyVoted;
		for (var i=0; i<votedLength; i++)
		{
			if (currentUser == votedList[i])
			{
				alreadyVoted = 1;
			}
		}
		if (alreadyVoted != 1)
		{
			$("<span id='voteBtnspan'><button class='voteButton'> +1 </button></span>").appendTo($tb);
		}
		else
		{
			$("<span id='voteBtnspan'><button class='removeVoteButton'> -1 </button></span>").appendTo($tb);
		}
	}

	/*
	CREATES URL FROM PLAIN TEXT
	*/
	function linkify(eSpan) 
	{
		var replacePattern2;
		var inputText = $(eSpan).text();
		$(eSpan).text("");
		
		//URLs starting with http://, https://, or www.
		replacePattern2 = /((www|https?:\/\/)[^ ]+)/;
		var replacedArray = inputText.split(replacePattern2);
		
		for (var i =0; i<replacedArray.length; i++)
		{
			var temp = "";
			if (replacePattern2.test(replacedArray[i]))
			{
				temp = replacedArray[i].replace(replacePattern2, '<a href="$1" target="_blank">$1</a>');
				$(temp).appendTo(eSpan);
				i=i+1;
			}
			else
			{
				$(eSpan).append(document.createTextNode(replacedArray[i]));
			}
		}
		
		//Change email addresses to mailto:: links.
		//replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
		//replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
	}
		
	/*
	OPENS EXPANDED TEXT BOX FOR NOTE
	*/
	function expandNote(field)
	{	
		var fullText = field.model.get('text');
		var fontColour = getContrastYIQ(field.model.get('color'));
		//create a new div with all details of the original
		$('#fullscreen').show();
		var $exMenu = jQuery('<div/>', {
			class: 'popupMenu',
		});
		$($exMenu).appendTo("body");
		
		$($exMenu).css("background-color", field.model.get('color'));
		$("<span id='expandTitle'>Note</span></br>").appendTo(".popupMenu");
		$('#expandTitle').css("color", fontColour);
		$("<div id='popupDetails'></div>").appendTo(".popupMenu");
		
		var $fullT = jQuery('<span/>', {
			id: 'expandFulltext',
		});
		$($fullT).appendTo("#popupDetails");
		
		$("#expandFulltext").html(fullText);
		$('#expandFulltext').css("color", fontColour);
		linkify($fullT);
		$("<br></br>").appendTo("#popupDetails");
		$("<div id='bottomBar'></div>").appendTo("#popupDetails");
		
		//var tagged = field.model.get('tagged');
		var tagged = new Array();
		//alert(field.tagging.length);
		var tagCount = 0;
		field.tagging.each(function (obj){
			//alert('test');
			//alert(obj);
			tagged[tagCount] = obj.get('tagItem');
			tagCount++;
		},this);
		var tagSize = _.size(tagged);
		for (var i=0; i<tagSize; i++)
		{
			$("<span class='taggedUser'>Tag: "+tagged[i]+"</span><br/>").appendTo("#bottomBar");
		}		
		$("<button id='cancelPopup' onclick='closeMenu()'>Cancel</button>").appendTo("#bottomBar");
		document.getElementById('cancelPopup').focus();
	}