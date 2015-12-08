/*
* Set to String Prototype based on this S/O Function:
* http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
*/
String.prototype.toTitleCase = function toTitleCase(){
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function convertTagName(tag, toReadable){
	var response;
	if(toReadable){
		response = tag.replace(/-/g, ' ').toTitleCase();
	}
	else{
		response = tag.replace(/\s+/g, '-').toLowerCase();
	}
	return response;
}

function checkMeetingName(inputID){
	var input = document.getElementById(inputID);
	var updatedName = convertTagName(input.value, false);
	input.value = updatedName;
}

function addMeeting(){
	var meetingID = document.getElementById('new-meeting-id').value;
	var dateStrings = [];
	var size = dateOptions.length;
	for(var d = 0; d < size; d++){
		dateStrings.push(dateOptions[d].getTime());
	}
	var meeting = {
		mid: meetingID,
		name: document.getElementById('new-meeting-name').value,
		dateOptions: JSON.stringify(dateStrings),
		timeOptions: JSON.stringify(timeOptions),
		creator: USER_ID,
		users: JSON.stringify([USER_ID]),
		timeslots: JSON.stringify([])
	}
	console.log('Sent meeting to database:');
	console.log(meeting);
	var database = new Firebase("https://omnipointment.firebaseio.com/meetings/" + meetingID);
		database.set(meeting);
}

function loadMeeting(){

	function loadTimeSlotsCallback(timeSlotList){
		var database = new Firebase("https://omnipointment.firebaseio.com/meetings/" + meetingID);
		database.once('value', function(snapshot){
			var meeting = snapshot.val();
			console.log('Found in database:');
			console.log(meeting);
			var dateStrings = JSON.parse(meeting.dateOptions);
			var size = dateStrings.length;
			var grid = {
				dateOptions: [],
				timeOptions: []
			}
			for(var d = 0; d < size; d++){
				grid.dateOptions.push(new Date(dateStrings[d]));
			}
			grid.timeOptions = JSON.parse(meeting.timeOptions);
			toggleSection('load-meeting');
			document.getElementById('load-meeting-name').innerHTML = meeting.name;
			createGrid(meetingID, 'load-grid', grid.dateOptions, grid.timeOptions, timeSlotList);
		});
	}

	var meetingID = document.getElementById('find-meeting-id').value;
	var userRef = new Firebase("https://omnipointment.firebaseio.com/users/" + USER_ID + "/meetings/" + meetingID);
	userRef.once('value', function(snapshot){
		var timeSlotList = JSON.parse(snapshot.val());
		//console.log(timeSlotList);
		loadTimeSlotsCallback(timeSlotList);
	});

}

function updateAvailability(){
	var meetingID = document.getElementById('find-meeting-id').value;
	var timeslots = getFreeSlots();
	console.log(timeslots)
	var data = JSON.stringify(timeslots);
	var userRef = new Firebase("https://omnipointment.firebaseio.com/users/" + USER_ID + "/meetings/" + meetingID);
	userRef.set(data);
	var meetingRef = new Firebase("https://omnipointment.firebaseio.com/meetings/" + meetingID + "/users");
	meetingRef.once('value', function(snapshot){
		var userArray = JSON.parse(snapshot.val());
		if($.inArray(USER_ID, userArray) === -1){
			userArray.push(USER_ID);
			var newArray = JSON.stringify(userArray);
			meetingRef.set(newArray);
		}
	});
}

console.log("LOADED backend.js");