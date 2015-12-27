//BROWSERIFY IMPORTS
var $ = require('jquery');
//GLOBAL VARIABLES
var MINUTE = 60000; //in milliseconds

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

function displayUserError(message, outputID){
	if(!outputID){
		throw new Error("No output element is specified for showing user errors.");
	}
	else{
		var errorBox = document.getElementById(outputID);
		errorBox.innerHTML = `<p>${message}</p>`;
		errorBox.style.display = "block";
	}
}

function checkMeetingName(inputID){
	var input = document.getElementById(inputID);
	var updatedName = convertTagName(input.value, false);
	input.value = updatedName;
}

function getDateOptionFromInput(idPath, errorMinder){
	var dateInput = document.getElementById(idPath + "-date");
	var date = new Date(dateInput.value);
		//Because the date input returns a value that is zero-indexed for the day of the month... and no other field
		date.setDate(date.getDate() + 1);
	return date.getTime();
}

function getTimeOptionFromInput(idPath, errorMinder){
	var startInput = document.getElementById(idPath + "-start");
	var endInput = document.getElementById(idPath + "-end");
	var start = new Date(`1899-12-30 ${startInput.value}`);
	var end = new Date(`1899-12-30 ${endInput.value}`);
	var duration = (end.getTime() - start.getTime()) / MINUTE;
	var priority = document.getElementById(idPath + "-priority").checked;
	var option = {
		dates: [],
		duration: duration,
		isPriority: priority,
		startHours: start.getHours(),
		startMinutes: start.getMinutes()
	}
	if(duration > 0){
		return option;	
	}
	else{
		errorMinder.displayUserError("The end time you selected is before the start time.");
	}
}

export var Front = {
	userErrorId: "",
	checkMeetingName: checkMeetingName,
	getDateOptionFromInput: function(idPath){
		return getDateOptionFromInput(idPath, this);
	},
	getTimeOptionFromInput: function(idPath){
		return getTimeOptionFromInput(idPath, this);
	},
	setUserErrorOutput: function(outputID){
		this.userErrorId = outputID;
	},
	displayUserError: function(message){
		displayUserError(message, this.userErrorId);
	}
}