mensaklcom = function() {
	
}

mensaklcom.prototype.getMenu = function(offset,success,failure) {
	var url = "http://mensa-kl.de/api.php?date="+offset;
	var pageAjax = new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport){
			var response = transport.responseText;
			if(transport.readyState == 4 && transport.status != 200) {
				failure("Keine Verbindung zum Internet!<br>Der Offline Modus wird mit einem der n&auml;chsten Updates kommen.");
			} else {
				success(this.parseToArray(response));
			}
		}.bind(this),
		onFailure: function(transport) {
			failure("Fehler beim Herstellen der Verbindung\nErrorcode:"+transport.status);
		}.bind(this),
		onException: function(transport, ex) {
			failure("Noch unbehandelter Fehler! "+ex);
		}.bind(this)
	});
};

mensaklcom.prototype.parseToArray = function(raw) {
	var lines = raw.split("\n");
	var arr = new Array(lines.length);
	for(i = 0; i < arr.length; i++) {
		arr[i] = lines[i].split("\|");
	}
	return arr;
};