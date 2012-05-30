dateFormat = function() {
	this.dayNames = new Array("Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag");
};

/*dateFormat.prototype.ymd2julian = function(y,m,d) {
	if (m < 3) {
		var f = -1;
	} else {
		var f = 0;
	}
   
   return Math.floor((1461*(f+4800+y))/4)
       + Math.floor(((m-2-(f*12))*367)/12)
       - Math.floor(3*Math.floor((y+4900+f)/100)/4)
       + d
       - 32075;
};

dateFormat.prototype.dow = function(y,m,d) {
	return dayNames[((this.ymd2julian(y,m,d) % 7) + 1) % 7];
};

dateFormat.prototype.formatDay = function(date) {

	var matches = /([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])/.exec(date);
	
	var day = this.formatter.dow(matches[1], matches[2], matches[3]);	
	return day+", "+matches[3]+"."+matches[2];
};*/

dateFormat.prototype.getFormattedDate = function(actOffset) {
	var date = new Date();
	date.setTime(date.getTime() + (1000*60*60*24*actOffset));
	var dd = date.getDate();
	if(dd<10) dd = "0"+dd;
	var mm = date.getMonth()+1;
	if(mm<10) mm = "0"+mm;
	return this.dayNames[date.getDay()]+", "+dd+"."+mm;
};
