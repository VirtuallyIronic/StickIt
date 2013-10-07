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



function note(content)
{
	var words = '<li> <a href="#">'+content+'</a></li>';
	return words;
}

function popup()
{
	var x;
	var msg = prompt("Enter your msg");
	
	if ((msg===null) || (msg==='') || (msg === ""))
	{
		//return null;
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
		note.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
		note.addEventListener('click', function() { return self.onNoteClick() }, false);
		this.note = note;

		var edit = document.createElement('div');
		edit.className = 'edit';

		edit.innerHTML = x;
		//var text = document.createTextNode(x);
		//text.renameNode("TEXTTEST");
		//edit.appendChild(text);
		note.appendChild(edit);
		this.editField = edit;//edit;

		var tb = document.createElement('div');
		tb.className = 'toolbar';
		tb.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);

		var closespan = document.createElement('span');
		var editspan = document.createElement('span');
		closespan.innerHTML = '<button class="closeButton" id="closeb" onclick="closeClick(this)"> Close </button>';
		editspan.innerHTML = '<button class="editButton" id="editb" onclick="editClick(this)"> Edit </button>';
		tb.innerHTML = "User : _____			.";
		tb.appendChild(closespan);
		tb.appendChild(editspan);
		
		note.appendChild(tb);
		this.lastModified = tb;

		document.body.appendChild(note);
		return this;
	}
}

  function editClick(field,txtval)
  {
	var editParent = $(field).parent().parent().parent().children(".edit");
	var textEdit = editParent.text();
	var x = prompt("Enter your msg",textEdit);
	if (x==null)
	{
		x="";
	}
	else
	{	
		editParent.text(x);
	}
  }
  
  function closeClick(field)
  {
	var r=confirm("Close Note?");
	if (r==true)
	{
		//CODE HERE TO DELETE TABLE ENTRY
		//SQL REQUEST DELETE NOTE FROM WALL
	    $(field).parent().parent().parent().hide();
	}
	else
	{
		//NOTHING
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
        document.removeEventListener('mousemove', this.mouseMoveHandler, true);
        document.removeEventListener('mouseup', this.mouseUpHandler, true);

        this.save();
        return false;
    },

    onNoteClick: function(e)
    {
        this.editField.focus();
        getSelection().collapseToEnd();
    },

    onKeyUp: function()
    {
        this.dirty = true;
        this.saveSoon();
    },
}

function newNote()
{
    var note = new Note();
    note.id = ++highestId;
    note.left = Math.round(Math.random() * 400) + 'px';
    note.top = Math.round(Math.random() * 500) + 'px';
    note.zIndex = ++highestZ;
    note.saveAsNew();
}