//<!-- created by Kirk Mapperson as a demo version of the sticky note process. -->
//<!-- Version 1.1-->
//<!-- Change log -->
//<!--
	//* ------- 1.1 ------- 
	//* Added buttons to notes
	//* Close button prompt and removes its own note
	//* Edit button still not working, continuing on this later.
	
	//* ------- 1.2 ------- 
	//* Edit button working
	//* Note wont create on empty message
	//* Fixed the cancel bug
	//				When you hit cancel, makes a note anyway
	//* Need to allow note to be edited with original text rather then complete override.
	
	//* ------- 1.3 ------- 
	//* Word wrapping and character limits
	
	//* ------- 1.4 ------- 
	//* Note clipping and dragging working
	//*		Will snap within wall space and within a dynamic number of walls
	//*		lanes global var sets lane amounts
//-->
//<!-- created by Kirk Mapperson as a demo version of the sticky note process. -->
//<!-- Version 1.1-->
//<!-- Change log -->
//<!--
	//* ------- 1.1 ------- 
	//* Added buttons to notes
	//* Close button prompt and removes its own note
	//* Edit button still not working, continuing on this later.
	
	//* ------- 1.2 ------- 
	//* Edit button working
	//* Note wont create on empty message
	//* Fixed the cancel bug
	//				When you hit cancel, makes a note anyway
	//* Need to allow note to be edited with original text rather then complete override.
//-->

function popup()
{
	var x;
	var msg = prompt("Enter your msg");
	
	if ((msg===null) || (msg==='') || (msg === ""))
	{
		return null;
	}
	else
	{
		x = msg;
		return x;
	}
	//better interface required, prompt wont due for added functionality
}

var captured = null;
var highestZ = 0;
var highestId = 0;
var lanes = 7;

function Note()
{
	var x = popup();
	if (x==null)
	{
		x="";
	}
	else
	{
		var self = this;

		var note = document.createElement('div');
		note.className = 'note';
		this.note = note;

		var edit = document.createElement('div');
		edit.className = 'edit';
		var fullText = document.createAttribute("fullText");
		fullText.value=x;
		if (x.length>220)
		{
			x = x.substr(0, 217);
			x += " ...";
		}
		edit.innerHTML = x;
		edit.setAttributeNode(fullText);
		note.appendChild(edit);
		this.editField = edit;//edit;

		var tb = document.createElement('div');
		tb.className = 'toolbar';
		tb.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);

		var closespan = document.createElement('span');
		var editspan = document.createElement('span');
		closespan.innerHTML = '<button class="closeButton" id="closeb" onclick="closeClick(this)"> Delete </button>';
		editspan.innerHTML = '<button class="editButton" id="editb" onclick="editClick(this)"> Edit </button>';
		tb.innerHTML = "User : _____.";
		tb.appendChild(closespan);
		tb.appendChild(editspan);
		
		note.appendChild(tb);

		//$(document.body).append($note);
		document.body.appendChild(note);
		return this;
	}
}

  function editClick(field)
  {
	var editParent = $(field).parent().parent().parent().children(".edit");
	var fullTextCurrent = $(field).parent().parent().parent().children(".edit").attr("fullText");
	var textEdit = editParent.text();
	var x = prompt("Enter your msg", fullTextCurrent);
	if (x==null)
	{
		x="";
	}
	else
	{	
		$(field).parent().parent().parent().children(".edit").attr("fullText", x);
		if (x.length>220)
		{
			x = x.substr(0, 217);
			x += " ...";
		}
		editParent.text(x);
	}
  }
  
  function closeClick(field)
  {
	var r=confirm("Delete Note? WARNING: Permanent");
	if (r==true)
	{
		//CODE HERE TO DELETE TABLE ENTRY
		//SQL REQUEST DELETE NOTE FROM WALL
		var test = $(field).parent().parent().parent();
	    $(field).parent().parent().parent().remove();
	}
  }

Note.prototype = {

    get id()
    {
        if (!("_id" in this))
            this._id = 0;
        return this._id;
    },

    set id(x)
    {
        this._id = x;
    },

    get text()
    {
        return this.editField.innerHTML;
    },

    set text(x)
    {
        this.editField.innerHTML = x;
    },

    get left()
    {
        return this.note.style.left;
    },

    set left(x)
    {
        this.note.style.left = x;
    },

    get top()
    {
        return this.note.style.top;
    },

    set top(x)
    {
        this.note.style.top = x;
    },

    get zIndex()
    {
        return this.note.style.zIndex;
    },

    set zIndex(x)
    {
        this.note.style.zIndex = x;
    },

    onMouseDown: function(e)
    {
        captured = this;
        this.startX = e.clientX - this.note.offsetLeft;
        this.startY = e.clientY - this.note.offsetTop;
        this.zIndex = ++highestZ;

        var self = this;
        if (!("mouseMoveHandler" in this)) {
            this.mouseMoveHandler = function(e) { return self.onMouseMove(e) }
            this.mouseUpHandler = function(e) { return self.onMouseUp(e) }
        }

        document.addEventListener('mousemove', this.mouseMoveHandler, true);
        document.addEventListener('mouseup', this.mouseUpHandler, true);

        return false;
    },

    onMouseMove: function(e)
    {
        if (this != captured)
            return true;

        this.left = e.clientX - this.startX + 'px';
        this.top = e.clientY - this.startY + 'px';
        return false;
    },

    onMouseUp: function(e)
    {
		var leftPos = this.note.offsetLeft;
		var topPos = this.note.offsetTop;
		
		for (var i=0; i<=lanes; i++)
		{
			if (i === 0)
			{
				var min = 10;
			}
			else
			{
				var min = (100*i);
			}
			if (i === lanes)
			{
				var max = screen.width;
			}
			else
			{
				var max = (99+(100*i));
			}
			
			if (min<=leftPos && leftPos<=max)
			{
				this.left = min+'px';
			}
		}

		
		if (leftPos < 10)
		{
			this.left = 10+'px';
		}
		if (topPos < 85)
		{
			this.top = 85+'px';
		}
        document.removeEventListener('mousemove', this.mouseMoveHandler, true);
        document.removeEventListener('mouseup', this.mouseUpHandler, true);
		
        return false;
    },
}

function newNote()
{
    var note = new Note();
    note.id = ++highestId;
    note.left = Math.round(200) + 'px';
    note.top = Math.round(200) + 'px';
    note.zIndex = ++highestZ;
}