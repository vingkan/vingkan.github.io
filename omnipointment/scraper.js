var MEETING_DATA = {
	mid: null,
	creator: "CREATED ON WHEN2MEET",
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

//SET MEETING MID
var midFromName = clean.replace(/ /g, "-").toLowerCase();
MEETING_DATA.mid = midFromName;

//SET MEETING MESSAGE
MEETING_DATA.message = "Converted from When2Meet with love by Omnipointment.";

//SET MEETING USERS
MEETING_DATA.users = PeopleIDs;

//GET MEETING RESPONDERS
var respondersById = {};
for(var k = 0; k < PeopleIDs.length; k++){
	respondersById[PeopleIDs[k]] = [];
}
//SORT AVAILABILITY DATA INTO TIMESLOTS BY PERSON ID
for(var t = 0; t < TimeOfSlot.length; t++){
	var time = getDateTime(TimeOfSlot[t]);
	var duration = 15;
	var free = 2;
	for(var a = 0; a < AvailableAtSlot[t].length; a++){
		var userID = AvailableAtSlot[t][a];
		var slotID = userID + "-" + time;
		var timeslot = {
			_id: slotID,
			duration: duration,
			time: time,
			userId: userID,
			free: free
		}
		respondersById[userID].push(timeslot);
	}
}
//CONVERT TO RESPONDERS FORMAT
var responders = [];
for(id in respondersById){
	var name = PeopleNames[PeopleIDs.indexOf(parseInt(id, 10))];
	responders.push({
		name: name,
		providerId: id,
		providerType: "when2meet",
		email: "[Email for: " + name + "]",
		timeslots: respondersById[id]
	});
}
MEETING_DATA.responders = responders;

//OUTPUT
var stringified = JSON.stringify(MEETING_DATA);

console.log("OUTPUT: JSON Meeting Object for Omnipointment:");
console.log(MEETING_DATA);
copy(MEETING_DATA);