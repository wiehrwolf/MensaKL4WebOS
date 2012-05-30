function OverviewAssistant() {

}

OverviewAssistant.prototype.setup = function() {
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, StageAssistant.appMenuModel);
	this.actOffset = 0;
	
	this.feedMenuModel = {
    visible: true,
    items: [{
        items: [
           { icon: "back", command: 'previous', label: ""},
           { label: "Heute", width: 200 },
           { icon: "forward", command: 'next', label: ""}
        	]
    	}]
	};
	this.controller.setupWidget(Mojo.Menu.viewMenu, { spacerHeight: 0, menuClass:'no-fade' }, this.feedMenuModel);
	
	this.cmdMenuModel = {
	    visible: true,
	    items: [{
			items: [
				{},
				{icon: "refresh", command: 'refresh'}
			]
		}]
	};
	this.controller.setupWidget(Mojo.Menu.commandMenu, {}, this.cmdMenuModel);
	
	this.mensakl = new mensaklcom();
	this.formatter = new dateFormat();
	
	//list
	this.controller.setupWidget("list",
		this.attributes = {
			itemTemplate: "overview/list-item",
			listTemplate: "overview/list-container",
			swipeToDelete: false,
			reorderable: false
		},
		this.listModel = {
			items: [{}]
		}
	).showAddItem(false);
	
	
	
	//Mojo.Event.listen(this.controller.sceneElement, Mojo.Event.forward, this.handleEvent);
	//Mojo.Event.listen(this.controller.sceneElement, Mojo.Event.back, this.handleEvent);
};

OverviewAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	  this.initOffset();
	  this.fillList(this.actOffset);
};

OverviewAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

OverviewAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	  this.controller.stopListening();
};

OverviewAssistant.prototype.fillList = function(offset) {
	this.clearList();	
	this.updateViewDate();
	this.mensakl.getMenu(offset,function(r) {
			for(i = 0; i < r.length; i++) {
				if(r[i].length == 9) {
					//format description prices
					var match = null;
					while((match = r[i][3].match(/[0-9]+,[0-9][0-9]&euro;/)) != null) {
						var price = /[0-9]+,[0-9][0-9]/.exec(match);
						r[i][3] = r[i][3].replace(/[0-9]+,[0-9][0-9]&euro;/,Mojo.Format.formatCurrency(price));
					}
					//format overall prices
					match = null;
					while((match = r[i][4].match(/[0-9]+\.[0-9][0-9]/)) != null) {
						var price = match[0].replace(/\./,",");
						if (match[0] != "0.00") {
							r[i][4] = r[i][4].replace(/[0-9]+\.[0-9][0-9]/,Mojo.Format.formatCurrency(price));
						} else {
							r[i][4] = r[i][4].replace(/[0-9]+\.[0-9][0-9]/,"");
						}
					}
					//style title for mensa 1 and 2
					if(r[i][2] === "1" || r[i][2] === "2") {
						r[i][2] = "Mensa "+r[i][2];
					} else if(r[i][2] === "2veg") {
						r[i][2] = "Mensa 2 veg";
					}
					//add picture if available
					if(r[i][7] != '') {
						r[i][7] = '<img width="100%" src="http://mensa-kl.de/mimg/'+r[i][7]+'">';
					}
					//add food type picture if available
					if(r[i][8] != '') {
						r[i][8] = '<img src="images/'+r[i][8]+'.png">';
					}
					//add rating stars
					var stars = parseFloat(r[i][5]);
					r[i][5] = "";
					var addedStars = 0;
					for(j = 1; j < stars; j++) {
						r[i][5] = r[i][5]+'<img src="images/star.png">';
						addedStars++;
					}
					if(addedStars < 5) {
						var remainder = stars % 1;
						if(remainder >= 0.25 && remainder < 0.75) {
							r[i][5] = r[i][5]+'<img src="images/starh.png">';
							addedStars++;
						} else if(remainder >= 0.75) {
							r[i][5] = r[i][5]+'<img src="images/star.png">';
							addedStars++;
						}
					}
					if(addedStars < 5) {
						for(j = addedStars+1; j < 6; j++) {
							r[i][5] = r[i][5]+'<img src="images/starn.png">';
						}
					}
					
					this.controller.get("list").mojo.noticeAddedItems(i, [{mensa: r[i][2], image: r[i][7], data: r[i][3], price: r[i][4], foodType: r[i][8], rating: r[i][5]+" "+r[i][6]}]);
				} else {
					if(r[0][0] == '-1') {
						this.controller.get("body-content").update("Keine weitere Vorschau m&ouml;glich.");
					}
				}
			}
		}.bind(this),
		function(f) {
			this.controller.get("body-content").update(f);
		}.bind(this)
	);
	//this.updateListener();
};

/*OverviewAssistant.prototype.dragStart = function(event) {
	this.tap_down_x = event.down.x;
	//Mojo.Event.stopListen(this.controller.get("list"), Mojo.Event.dragStart);
};

OverviewAssistant.prototype.dragEnd = function(event) {
	this.tap_up_x = event.up.x;
	if(this.tap_down_x < this.tap_up_x+50) this.triggerNext();
	if(this.tap_up_x < this.tap_down_x+50) this.triggerPrevious();
	//Mojo.Event.stopListen(this.controller.get("list"), Mojo.Event.dragEnd);
};*/

/*OverviewAssistant.prototype.updateListener = function() {
	//Mojo.Event.stopListening();
	// Swipe left (next), right (prev)
	/*var tap_down_x = 0;
	var tap_up_x = 0;
	Mojo.Event.listen(this.controller.get("list"), Mojo.Event.dragStart, function(event) {
		tap_down_x = event.down.x;
		Mojo.Event.stopListen(this.controller.get("list"), Mojo.Event.dragStart);
	}.bind(this));
	Mojo.Event.listen(this.controller.get("list"), Mojo.Event.dragEnd, function(event) {
		tap_up_x = event.up.x;
		if(tap_down_x < tap_up_x+50) this.triggerNext();
		if(tap_up_x < tap_down_x+50) this.triggerPrevious();
		Mojo.Event.stopListen(this.controller.get("list"), Mojo.Event.dragEnd);
		this.controller.get("body-content").update(this.controller.get("body-content")+"blubber");
	}.bind(this));*/
	/*this.tap_down_x = 0;
	this.tap_up_x = 0;
	Mojo.Event.listen(this.controller.get("list"), Mojo.Event.dragStart, this.handleEvent);
	Mojo.Event.listen(this.controller.get("list"), Mojo.Event.dragEnd, this.handleEvent);
};*/

OverviewAssistant.prototype.updateViewDate = function() {
	this.feedMenuModel.items[0].items[1].label = this.formatter.getFormattedDate(this.actOffset);
	this.controller.modelChanged(this.feedMenuModel);
};

OverviewAssistant.prototype.clearList = function() {
	this.controller.get("body-content").update("");
	this.listModel.items = [];
	this.controller.modelChanged(this.listModel);
};

OverviewAssistant.prototype.initOffset = function() {
	var date = this.formatter.getFormattedDate(this.actOffset);
	if(/Samstag./.test(date)) {
		this.actOffset = this.actOffset+2;
	} else if(/Sonntag./.test(date)) {
		this.actOffset = this.actOffset+1;
	}
};

OverviewAssistant.prototype.triggerPrevious = function() {
	if(/Montag./.test(this.feedMenuModel.items[0].items[1].label)) {
		this.actOffset = this.actOffset-3;
	} else {
		this.actOffset = this.actOffset-1;
	}
	this.fillList(this.actOffset);
};

OverviewAssistant.prototype.triggerNext = function() {
	if(/Freitag./.test(this.feedMenuModel.items[0].items[1].label)) {
		this.actOffset = this.actOffset+3;
	} else {
		this.actOffset = this.actOffset+1;
	}
	this.fillList(this.actOffset);
};

OverviewAssistant.prototype.handleCommand = function(event) {
     if (event.type === Mojo.Event.command) {
         switch (event.command) {
			case 'previous':
				this.triggerPrevious();
				break;
			case 'next':
				this.triggerNext();
				break;
			case 'refresh':
				this.fillList(this.actOffset);
				break;
         }
     }
};

OverviewAssistant.prototype.handleEvent = function(event) {
	 if (event.type === Mojo.Event.forward) {
	 	this.triggerNext();
	 }
	 if (event.type === Mojo.Event.back) {
	 	this.triggerPrevious();
		event.stop();
	 }
	 this.controller.get("body-content").update(event.type);
};
