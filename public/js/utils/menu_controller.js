//--------------
/*
**	VERSION 1.0.0
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
		//CHECKS IF EDIT MENU OR NEW MENU
		if (data.$el.selector == '.wall')
		{
			edit = false;
		}
		//CREATES MAIN MENU ELEMENT (BACKGROUND)
		$('#fullscreen').show();
		var $mainMenu = jQuery('<div/>', {
			class: 'popupMenu',
			title: 'Menu',
			id:'mainMenu',
			tempColour: '123',
		})
		$($mainMenu).appendTo("body");
		$("<span id='createTitle'>Note</span></br>").appendTo(".popupMenu");
		$("<div id='popupDetails'></div>").appendTo(".popupMenu");
		
		$("<div id='formDetails'></div>").appendTo("#popupDetails");
		
		//TEXT BOX
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
			//IF EDIT, ADD CURRENT TEXT
			$textEdit.val(data.model.get('text'));
		}
		//------------------------------------------------
		if (edit != true)
		{
			//LANE SELECT
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
		//COLOUR SELECT
		$("<p>Colour</p>").appendTo("#sideBar");

		var $colourSelect = jQuery('<div/>', {
			id: 'colourDrop',
			class:'colorpicker',
		});
		$colourSelect.appendTo("#sideBar");

		$("<div onclick='colourChange(this)'class='colourOption' style='background:#E6E6E6' title='White'></div><div onclick='colourChange(this)' class='colourOption' style='background:#A49381' title='Sand'></div><div onclick='colourChange(this)' class='colourOption' style='background:#CCCC00' title='Yellow'></div><div onclick='colourChange(this)' class='colourOption' style='background:#33CCFF' title='Blue'></div><div onclick='colourChange(this)' class='colourOption' style='background:#FF0000' title='Red'></div><div onclick='colourChange(this)' class='colourOption' style='background:#860e20' title=''></div><div onclick='colourChange(this)' class='colourOption' style='background:#4246ce' title=''></div><div onclick='colourChange(this)' class='colourOption' style='background:#5aa6c8' title=''></div><div onclick='colourChange(this)' class='colourOption' style='background:#ee740e' title=''></div><div onclick='colourChange(this)' class='colourOption' style='background:#1b5733' title=''></div><div onclick='colourChange(this)' class='colourOption' style='background:#605d60' title=''></div><div onclick='colourChange(this)' class='colourOption' style='background:#9717e5' title=''></div><div onclick='colourChange(this)'class='colourOption' style='background:#f4504a' title=''></div><div onclick='colourChange(this)' class='colourOption' style='background:#f7fa53' title=''></div>").appendTo("#colourDrop");

/*
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

*/
		//FONT SIZE SELECTOR
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
			//SET DEFAULT SETTINGS FOR COLOR AND FONT SIZE
			$("#sizeDrop > [value='"+data.model.get('fontsize')+"']").attr("selected", "true");
			document.getElementById('mainMenu').tempColour=data.model.get('colour');
		}
		
		//------------------------------------------------
		$("<p>TAG</p>").appendTo("#sideBar");
		// ADD TAG SECTION
		$('<input class="userText" type="text" name="user" placeholder="e.g. Worked Well">').appendTo('#sideBar');
		$("<button class='tagButton' onclick='addUserTag(this)'>Add Tag</button>").appendTo("#sideBar");
		//------------------------------------------------
		
		$("<div id='bottomBar'></div>").appendTo("#popupDetails");
		if (edit === true)
		{
			//CONFIRM EDIT BUTTON
			$("<button id='confirmEdit' class='confirmEditBtn' >Confirm</button>").appendTo("#bottomBar");
			$('#confirmEdit').on('click', data.processing);
		}		
		else {
			//CONFIRM NEW NOTE
			$("<button id='confirmPopup' class='confirmEditBtn' >Confirm</button>").appendTo("#bottomBar");
			$('#confirmPopup').on('click', data.prepareItem);
		}
		$("<button id='cancelPopup'class='cancelEditBtn' onclick='closeMenu()'>Cancel</button>").appendTo("#bottomBar");
				
		$("<div id='newTags' class='newTagBar'></div>").appendTo("#bottomBar");
		$("<div id='oldTags' class='oldTagBar'></div>").appendTo("#bottomBar");
		//ADD PRE-EXISTING TAGS
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
		
		var newColour = document.getElementById('mainMenu').tempColour;
		var oldColour = field.model.get('colour');
		
		var newFontSize = document.getElementById('sizeDrop').value;
		var oldFontSize = field.model.get('fontsize');
		
		//IF ANY NEW DATA DOES NOT MATCH OLD DATA, UPDATE THE NOTE AND MODEL.
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
		if (color.substring(0,3)=='rgb')
		{
			var newRGB = color.substring(3, color.length)
			newRGB = newRGB.split(",");
			var rA = newRGB[0].split('(');
			var rV = parseInt(rA[1]);
			var gV = parseInt(newRGB[1]);
			var bA = newRGB[2].split(')');
			var bV = parseInt(bA[0]);
			color = rgbToHex(rV,gV,bV);
		}	
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
		if (hexcolor.substring(0,3)=='rgb')
		{
			var newRGB = hexcolor.substring(3, hexcolor.length)
			newRGB = newRGB.split(",");
			var rA = newRGB[0].split('(');
			var rV = parseInt(rA[1]);
			var gV = parseInt(newRGB[1]);
			var bA = newRGB[2].split(')');
			var bV = parseInt(bA[0]);
			hexcolor = rgbToHex(rV,gV,bV);
		}		
		if (hexcolor.length >6) { hexcolor= hexcolor.substring(1,hexcolor.length)}
		var r = parseInt(hexcolor.substr(0,2),16);
		var g = parseInt(hexcolor.substr(2,2),16);
		var b = parseInt(hexcolor.substr(4,2),16);
		var yiq = ((r*299)+(g*587)+(b*114))/1000;
		return (yiq >= 128) ? 'black' : 'white';
	}
	
	//IF COLOR IS RGB, CONVERT TO HEX
	function converstionCheck(color)
	{	
		if (color == null)
		{
			return color;
		}
		else
		{
			if (color.substring(0,3)=='rgb')
			{
				var newRGB = color.substring(3, color.length)
				newRGB = newRGB.split(",");
				var rA = newRGB[0].split('(');
				var rV = parseInt(rA[1]);
				var gV = parseInt(newRGB[1]);
				var bA = newRGB[2].split(')');
				var bV = parseInt(bA[0]);
				color = rgbToHex(rV,gV,bV);
			}
			return color;
		}
	}
	//CONVERTS INT TO HEX
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	//CONVERTS TO HEX VALUE
	function rgbToHex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}
	
	/*
	CREATES NEW HTML ELEMENT NOTE
	*/
	function Note(input)
	{	
		var x = input.model.get('text');
		var lanePos = input.model.get('col');
		
		//MAIN NOTE
		var $note = jQuery('<div/>', {
			class: 'cssnote',
		});
		var fontColour = getContrastYIQ(input.model.get('colour'));
		$(input.el).css("background-color", input.model.get('colour'));
		
		$($note).appendTo($(input.el));
		
		//TOP DRAG BAR
		var $db = jQuery('<div/>', {
			class: 'dragbar',
		});
		$db.appendTo($note);
		
		//MAIN EDIT SECTION
		var $edit = jQuery('<div/>', {
			class: 'edit'
		});

		$edit.appendTo($note);
		
		//BOTTOM STATUS BAR
		var $eSpan = jQuery('<span/>', {
			class:'editSpan',
		});
		$($eSpan).css("fontSize", input.model.get('fontsize')+"px");
		$($eSpan).css("color", fontColour);
		$($eSpan).text(x);
		$($eSpan).appendTo($edit);
		linkify($eSpan);
			
		var $tb = jQuery('<div/>', {
			class: 'toolbar',
		});
		$tb.appendTo($note);
		var oldColour = input.model.get('colour');
		var colour = getTintedColor(oldColour, -75);
		$($db).css("background-color", colour);
		$($tb).css("background-color", colour);
		
		var voteScore = input.model.get('votes');
		var authorUser = input.model.get('username');
		
		//DETAIL SECTION
		//VOTES, AUTHOR, BUTTONS
		$("<span id='votespan'>Votes:"+voteScore+"   .</span>").appendTo($tb);
		$("<span id='userspan'>Created by: "+authorUser+"  </span>").appendTo($tb);
		$("<span id='closespan'><img class='deleteButton' src='images/delete-icon-transparent.png' style='width: 30px;'>  </img></span>").appendTo($tb);
		$("<span id='editspan'><img class='editButton' src='images/edit-icon-transparent.png' style='width: 30px;'>  </img></span>").appendTo($tb);
		$("<span id='expandspan'><img class='expandButton' src='images/Expand-icon.png' style='width: 30px;'>  </img></span>").appendTo($tb);

		var checkVote = false;
		//ADD PROPER CHECK HERE LATER TODO
		if (checkVote != false)
		{
			$("<span id='voteBtnspan'><img class='removeVoteButton'> -1 </img></span>").appendTo($tb);
		}
		else
		{
			$("<span id='voteBtnspan'><img class='voteButton' src='images/Like-button-transparent.png' style='width: 30px;'> </img></span>").appendTo($tb);
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
		var fontColour = getContrastYIQ(field.model.get('colour'));
		//create a new div with all details of the original
		$('#fullscreen').show();
		var $exMenu = jQuery('<div/>', {
			class: 'popupMenu',
		});
		$($exMenu).appendTo("body");
		
		$($exMenu).css("background-color", field.model.get('colour'));
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
		
		var tags = field.model.get('text');
		
		$("<span class='taggedUser'> Tag: " + tags + "</span><br />").appendTo("#bottomBar");
		/**
		//var tagged = field.model.get('tagged');
		var tagged = new Array();
		//alert(field.tagging.length);
		var tagCount = 0;
		field.tagging.each(function (obj){
			//alert('test');
			//alert(obj);
			tagged[tagCount] = obj;
			tagCount++;
		},this);
		var tagSize = _.size(tagged);
		for (var i=0; i<tagSize; i++)
		{
			$('<span value='+tagged[i].get('tagID')+' class="taggedUser">Tag: '+tagged[i].get("tagItem")+'</span><br/>').appendTo("#bottomBar");
		}		
		**/
		$("<button id='cancelPopup' class='cancelEditBtn' onclick='closeMenu()'>Close</button>").appendTo("#bottomBar");
		document.getElementById('cancelPopup').focus();
	}
	
function confirmSettings() {
	//var privacy=$('#privacySelect option:selected').text();    
   // var wallSize=$('#wallSizeSelect option:selected').text();    
	hideSettings();
}

//REMOVE TAGS FROM DATA MODEL
//UNSURE IF WORKING
function q(ev) {
	var alertString = ev.textContent.split(':');
	var r=confirm("Delete tag: "+alertString[1]);
	if (r==true)
	{
		
		tagid = ev.attributes[1].nodeValue;
		//alert(tagid);
		tagDelete(parseInt(tagid));
		//tagid.destroy();
		listView.trigger('RIPtag');
		ev.remove();
		
	}
	else
	{
		x="You pressed Cancel!";
	} 
}