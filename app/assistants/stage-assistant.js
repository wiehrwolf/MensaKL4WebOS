function StageAssistant(){
	/* this is the creator function for your stage assistant object */
}

StageAssistant.appMenuModel = {
	visible: true,
    items: [
        {label: "About", command: 'do-myAbout'}
	    ]
};

StageAssistant.prototype.setup = function() {
	this.controller.pushScene("overview");
};

StageAssistant.prototype.handleCommand = function(event) {
    this.controller = Mojo.Controller.stageController.activeScene();
	
    if(event.type === Mojo.Event.command) {
        switch(event.command) {
            case 'do-myAbout':
                this.controller.showAlertDialog({
                    onChoose: function(value) {},
                    title: $L("Mensa-KL v0.2"),
					allowHTMLMessage: true,
                    message: $L("(c) 2010 by Malte Brunnlieb<br>MIT Open Source Lizenz<br>Die in diesem App verwendeten Informationen und Grafiken stammen von http://mensa-kl.de und unterliegen dem (c) 2010 by Johannes Schildgen"),
                    choices:[
                        {label:$L("OK"), value:""}
                    ]
                });
                break;
            case 'do-appPrefs':
                //this.controller.pushScene("myAppPrefs");
                break;
 
            case 'do-appHelp':
                //this.controller.pushScene("myAppHelp");
                break;
        }
    }
};
