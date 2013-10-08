function enableItemView() {
//------VIEW HANDLER FOR NOTES--------
		ItemView = Backbone.View.extend({
			tagName: 'div', // name of tag to be created
			className: 'note',
			
			// `ItemView`s now respond to two clickable actions for each `Item`: swap and delete.
			events: {
				'click img.deleteButton': 'remove',//'remove',
				'click img.editButton': 'editMe',
				'click img.expandButton': 'expanding',
				'click img.voteButton': 'voting',
				'click img.removeVoteButton': 'cancelVote'
			},
			
			// `initialize()` now binds model change/removal to the corresponding handlers below.
			initialize: function(options){
				// every function that uses 'this' as the current object should be in here
				_.bindAll(this, 'render','editMe', 'cancelVote', 'unrender','addNewTag','voting','moveNote','removenoprompt','updatePos','processing', 'remove', 'expanding');
				this.model = options.model;
				this.model.bind('remove', this.unrender);
				this.voteObj = new options.voteModel;
				this.tagging = new options.tagModel;
				//this.newNoteStatus = 
				if(options.newNoteInput == 'tv')
				{
					this.incTagData = options.incTags;
					this.incVoteData = options.incVotes;
				}
				else if(options.newNoteInput == 'tf')
				{
					this.incTagData = options.incTags;
					this.incVoteData = false;
				}
				else if(options.newNoteInput == 'fv')
				{
					this.incTagData = false;
					this.incVoteData = options.incVotes;
				}
				else
				{
					this.incTagData = false;
					this.incVoteData = false;
				}

				this.model.on('laneRemove', this.removenoprompt);
				this.model.on('moveNote', this.moveNote);
				$(this.$el).on('custom', this.updatePos);
			},
			
			//------CREATES A NEW NOTE--------
			render: function(){
				if (this.incTagData != false)
				{
					//alert(this.incTagData);
					for (var k=0; k<this.incTagData.length; k++)
					{
						var addTags = new taggedFormat();
						addTags.set({
							'noteID': this.model.get('id'),
							'tagItem': this.incTagData[k].get('tagItem')
						});
						this.tagging.add(addTags);
					}
				}
				
				if (this.incVoteData != false)
				{
					for (var k=0; k<this.incVoteData.length; k++)
					{
						var addVotes = new voteFormat();
						addVotes.set({
							'noteID': this.incVoteData[k].get('noteID'),
							'votes_note': this.incVoteData[k].get('votes_note'),
						});
						this.voteObj.add(addVotes);
					}
				}
				
				Note(this);
				return this; // for chainable calls, like .render().el
			},
			
			//------OPENS EXPANDED TEXT BOX--------
			expanding: function(){
				//var asdasd = this.model.toJSON();
				expandNote(this);
			},

			addNewTag: function(e){
				var tags = this.model.get('tagged');
				var tagName = $(e.target).parent().children('.userText').val();
				var tagSize = _.size(tags);//.length;
				if (tagSize === 0)
				{
					tags[0] = tagName;
				}
				else
				{
					tags[tagSize] = tagName;
				}
				this.model.set('tagged',tags);
				$("<span>TAGGED: </span><span class='taggedUser'> "+tags[tagSize]+"</span><br/>").appendTo(".popupMenu");
			},
			
			//------+1 Vote--------
			voting: function(){
				if (confirmLogin == true)
				{
					/*
					var votes = this.model.get('votes');
					var checkVotes = voteGet(id);
					if (checkVotes != false) //need a better search criteria
					{
					
					}
					else
					{
						var newVotings = new voteFormat();
						newVotings.set({
							'noteID': this.model.get('noteId'),//noteID
							'votes_note': this.model
						});
						this.voteObj.add(newVotings);
						
						votes = (parseInt(votes)+1);//.toString();
						this.model.set('votes',votes);
						this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan").children().remove();
						$("<button class='removeVoteButton'> -1 </button>").appendTo($(this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan")));
						this.$el.children('.cssnote').children(".toolbar").children("#votespan").text('Votes: '+votes+'  .');
					}
					//TODO
					//SERVER UPDATE NOTE
					*/
					var votes = this.model.get('votes');
					var newVotings = new voteFormat();
					newVotings.set({
						'noteID': this.model.get('noteId'),//noteID
						'votes_note': this.model
					});
					this.voteObj.add(newVotings);
					
					votes = (parseInt(votes)+1);//.toString();
					this.model.set('votes',votes);
					this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan").children().remove();
					$("<img class='removeVoteButton' src='images/icons/dislike-button-transparent.png' style='width: 30px;'></img>").appendTo($(this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan")));
					this.$el.children('.cssnote').children(".toolbar").children("#votespan").text('Votes: '+votes+'  .');
				}				
				else
				{
					alert('PLEASE LOG IN');
				}
			},

			cancelVote: function(){
				if (confirmLogin == true)
				{
					/*
					var checkVotes = voteGet(id);
					var votes = this.model.get('votes');
					if (checkVotes != false) //need a better search criteria
					{
					
					}
					else
					{
						var voteSearch = this.voteObj.where({'noteID': this.model.get('noteId')});
						if (voteSearch.length != 0)
						{
							for (var q=0; q<voteSearch.length; q++)
							{
								voteSearch[q].destroy();
							}
						}	
						
						votes = (parseInt(votes)-1);//.toString();
						this.model.set('votes',votes);
						this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan").children().remove();
						$("<button class='voteButton'> +1 </button>").appendTo($(this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan")));
						this.$el.children('.cssnote').children(".toolbar").children("#votespan").text('Votes: '+votes+'  .');
					}
					*/
					var votes = this.model.get('votes');
					var voteSearch = this.voteObj.where({'noteID': this.model.get('noteId')});
					if (voteSearch.length != 0)
					{
						for (var q=0; q<voteSearch.length; q++)
						{
							voteSearch[q].destroy();
						}
					}	
					
					votes = (parseInt(votes)-1);//.toString();
					this.model.set('votes',votes);
					this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan").children().remove();
					$("<img class='voteButton' src='images/icons/Like-button-transparent.png' style='width: 30px;'></img>").appendTo($(this.$el.children('.cssnote').children(".toolbar").children("#voteBtnspan")));
					this.$el.children('.cssnote').children(".toolbar").children("#votespan").text('Votes: '+votes+'  .');					
				}				
				else
				{
					alert('PLEASE LOG IN');
				}
			},
			
			//------OPENS EDIT MENU--------
			editMe: function(){
				if (confirmLogin == true)
				{
					popMenu(this);
				}
				else
				{
					alert('PLEASE LOG IN');
				}
			},
			
			//------AFTER DELETE PROMPT, REMOVE NOTE WIDGET--------
			unrender: function(){
				removeWidgets($(this.el));
				//this.model.trigger('updateServer');
			},
			
			//------AFTER DRAG,CHANGES MODEL DATA--------
			updatePos: function(e){
				var newCol = globalData[0];
				//alert(newCol);
				var newRow = globalData[1];
				this.model.set('col', newCol);
				this.model.set('row', newRow);
				globalData = {};
				
				if (confirmLogin == true)
				{
					//TODO
					//SERVER UPDATE NOTE
					//updateNote(this.model);
				}
				else
				{
					alert('PLEASE LOG IN');
				}
			},
			
			//------AFTER EDIT, CHANGES MODEL DATA--------
			processing: function(){
				var data = confirmEdit(this);
				if (data != null)
				{
					var textEdit = data[0];
					var colour = data[1];
					var fontsize = data[2];
					var tags = data[3];
					this.$el.children('.cssnote').children('.edit').children(".editSpan").text(textEdit);
					linkify(this.$el.children('.cssnote').children('.edit').children(".editSpan"));

					this.$el.css('background-color', colour);

					var fontColour = getContrastYIQ(colour);
					var newColour = getTintedColor(colour, -75);
					this.$el.children('.cssnote').children('.dragbar').css('background-color', newColour);					
					this.$el.children('.cssnote').children('.toolbar').css('background-color', newColour);
					this.$el.children('.cssnote').children('.edit').children('.editSpan').css('fontSize', fontsize+"px");
					this.$el.children('.cssnote').children('.edit').children('.editSpan').css('color', fontColour);

					if (tags != 0)
					{
						//var oldTags = this.model.get('tagged');
						//var newTags = oldTags.concat(tags);

						for (var k=0; k<tags.length; k++)
						{
							var addTags = new taggedFormat();
							addTags.set({
								'noteID': this.model.get('id'),
								'tagItem': tags[k]
							});
							this.tagging.add(addTags);
						}

						this.model.set({
							'tagged': newTags,
							'text': textEdit,
							'fontsize': fontsize,
							'colour-note': colour
							// modify item defaults
						});
						//this.model.set('tagged',newTags);
					}
					else
					{
						this.model.set({
							'text': textEdit,
							'fontsize': fontsize,
							'colour-note': colour
							// modify item defaults
						});
					}
					closeMenu();
					//TODO
					//SERVER UPDATE NOTE
					//updateNote(this.model);
					//this.model.trigger('updateServer');
				}
				else
				{
					closeMenu();
				}
			},
			
			// CHECKS IF THE USER WANTS TO DELETE NOTE
			remove: function(){
				if (confirmLogin == true)
				{
					var r=confirm("Delete note?");
					if (r==true)
					{
						//TODO
						//SERVER UPDATE NOTE
						//removeNote(this.model);
						this.model.destroy();
						//this.model.set('col', oldCol);
					}	
				}
				else
				{
					alert('PLEASE LOG IN');
				}		
			},
			
			//------LANE DELETION FUNCTION -NOTE --------
			removenoprompt: function(){
				this.model.destroy();
			},
			
			//------Moves Note Data to the left--------
			moveNote: function(){
				var oldCol = this.model.get('col');
				oldCol = (oldCol-1).toString();
				this.model.set('col', oldCol);
			}

		});
	}