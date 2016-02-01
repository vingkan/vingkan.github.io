var MEETING_DATA = {
	mid: null,
	creator: null,
	name: null,
	message: null,
	users: [],
	timeOptions: [],
	responders: []
}

var GLOBAL = {
	DAY: 86400000,
	MINUTE: 60000
}

function getDateTime(timestamp){
	var date = new Date(timestamp * 1000);
	date.setUTCHours(date.getUTCHours() + 6)
	return date;
}

function scrapeCellTime(div){
	var cellID = div.id;
	var timestamp = parseInt(cellID.replace('GroupTime', ''), 10);
	return getDateTime(timestamp);
}

//GET DATE AND TIME RANGE
var allDivs = document.getElementsByTagName("div");
var timeDivs = [];
for(var d = 0; d < allDivs.length; d++){
	if(allDivs[d].id.indexOf("GroupTime") > -1){
		timeDivs.push(allDivs[d]);
	}
}
var start = scrapeCellTime(timeDivs[0]);
var end = scrapeCellTime(timeDivs[timeDivs.length-1]);
/*console.log("START TIME: ")
console.log(moment(start).format("M/D/YYYY dddd hh:mm A"));
console.log("END TIME: ")
console.log(moment(end).format("M/D/YYYY dddd hh:mm A"));*/
var datesList = [];
var currentTime = start.getTime();
while(currentTime <= end.getTime()){
	datesList.push(currentTime);
	currentTime += GLOBAL.DAY;
}
var endDay = new Date(start.getTime());
	endDay.setHours(end.getHours());
	endDay.setMinutes(end.getMinutes());
	//^In order to get the end time on the starting date
var duration = (endDay.getTime() - start.getTime()) / GLOBAL.MINUTE;
var priority = false;
var option = {
	dates: datesList,
	duration: duration,
	isPriority: priority,
	startHours: start.getHours(),
	startMinutes: start.getMinutes()
}
MEETING_DATA.timeOptions.push(option);

//GET MEETING NAME
var nameDiv = document.getElementById("NewEventNameDiv");
var dirty = nameDiv.innerText;
var clean = dirty.substr(0, dirty.indexOf("\n"));
MEETING_DATA.name = clean;

console.log(MEETING_DATA);
copy(MEETING_DATA);