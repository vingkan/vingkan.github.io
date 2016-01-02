//BROWSERIFY IMPORTS
var $ = require('jquery');
var vex = require('vex-js');
var vexDialog = require('vex-js/js/vex.dialog');
//LOCAL IMPORTS
import {DateTimeHelper} from './dateTimeHelper';

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

function displayUserError(message){
	vexDialog.alert(message);
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
	var duration = (end.getTime() - start.getTime()) / DateTimeHelper.MINUTE;
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

function displayLoadingMessage(idPath, message = "Loading..."){
	var html = `<div class="loading">`;
			html += `<img src="style/img/clock-base.png">`;
			html += `<img src="style/img/clock-hour.png">`;
			html += `<img src="style/img/clock-minute.png">`;
			html += `<h3>${message}</h3>`;
		html += `</div>`;
	var output = document.getElementById(idPath);
		output.innerHTML = html;
}

export var Front = {
	checkMeetingName: checkMeetingName,
	displayLoadingMessage: displayLoadingMessage,
	getDateOptionFromInput: function(idPath){
		return getDateOptionFromInput(idPath, this);
	},
	getTimeOptionFromInput: function(idPath){
		return getTimeOptionFromInput(idPath, this);
	},
	displayUserError: function(message){
		displayUserError(message);
	},
	checkIfInView: function(element){
		console.log(element)
		var offset = element.offset().top - $(window).scrollTop();
		if(offset > window.innerHeight){
			$('html,body').animate({scrollTop: offset}, 1000);
			return false;
		}
		return true;
	},
	getUID: function(){
		var uid = sessionStorage.getItem('uid');
		var paths = window.location.pathname.split("/");
		if(paths[paths.length - 1] === "login.html"){
			//Do Nothing
		}
		else{
			if(uid === null){
				window.location = 'login.html';
			}
		}
		return uid;
	},
	loadUser: function(){
		this.getUID();
		this.showUserImage();
	},
	showUserImage: function(){
		var imgURL = sessionStorage.getItem('img');
		var bubble = document.getElementById('image-bubble');
		bubble.style.backgroundImage = "url(" + imgURL + ")";
	}
}