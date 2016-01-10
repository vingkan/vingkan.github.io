//BROWERSIFY IMPORTS
var $ = require('jquery');
var Backbone = require('backbone');
var moment = require('moment');
var vex = require('vex-js');
var vexDialog = require('vex-js/js/vex.dialog');
//LOCAL IMPORTS
import {Database} from './database';
import {TimeSlotView} from './views/timeslot';
import {TimeSlotModel} from './models/timeslot';
import {Meeting} from './models/meeting';
import {TimeGridView} from './views/timegrid';
import {RSVPView} from './views/rsvp';
import {RSVPModel} from './models/rsvp';
import {CreatorGridView} from './creator';
import {Front} from './frontend';
import {Menu} from './menu';
import {DateTimeHelper} from './dateTimeHelper';
import Router from './router';
import ViewManager from './viewManager';
//DEVELOPMENT USE
import {FirebaseHandler} from './firebase-handler';

// window.router = new Router({ viewManager: ViewManager('app-container')});
// Backbone.history.start({pushState: true});

// Global 401 Unauthorized to tell the user to log in
var showingDialog = false;
$.ajaxSetup({
    statusCode: {
        401: function() {
            if (!showingDialog) {
                showingDialog = true;
                vex.open({
                    content: 'You are not logged in! Please <a href="/login">login</a>.',
                    showCloseButton: false,
                    escapeButtonCloses: false,
                    overlayClosesOnClick: false
                });
            }
        }
    }
});

// Close function for views to use so they don't become ghosts
Backbone.View.prototype.close = function(){
    this.remove();
    this.unbind();
    if (this.onClose){
        this.onClose();
    }
};

//FirebaseHandler.handle();
vex.defaultOptions.className = 'vex-theme-wireframe';

console.info('What makes working at Omnipointment better than say, Google? jobs@omnipointment.com');

Front.loadUser();

function searchMeetings(value){
	loadMeeting(value);
}

var SAMPLE_ID = "dj-session";

if(location.search.length > 1){
	var searchID = location.search.substr(1);
	loadMeeting(searchID)
}

function loadMeeting(meetingID, callback){
	Menu.toggleSection('find-meeting');
	Front.displayLoadingMessage('grid');
	//RESTFUL API CODE:
	var meeting = new Meeting({ mid: meetingID });
	meeting.fetch({
		success: function (model) {
			var grid = new TimeGridView({
				model: model,
				el: document.getElementById('grid')
			});
			if(callback) callback(grid);
		},
		error: function (model, response) {
			console.error("Failed to load meeting: " + response.responseText);
			$('#grid').html(`<p>${response.responseText}</p>`);
		}
	});
}

//BINDINGS

//Class Bindings

$(".check-meeting-name").on("change", function(){
	Front.checkMeetingName(this.id);
});

//ID Bindings

$("#image-bubble").on("click", function(){
	main_my_meetings();
});

$("#logo").on("click", function(){
	Menu.toggleSection('view-menu');
});

$("#menu-button").on("click", function(){
	Menu.toggleSection('view-menu');
});

$("#menu-find").on("click", function(){
	Menu.toggleSection('find-meeting');
});

$("#menu-create").on("click", function(){
	Menu.toggleSection('create-event');
});

$("#menu-about").on("click", function(){
	Menu.toggleSection('about');
});

$("#search-button").on("click", function(){
	Front.checkMeetingName(this.id);
	searchMeetings(this.value);
});

$("#search-meetings").keypress(function(event){
	if(event.keyCode == 13){
		Front.checkMeetingName(this.id);
		searchMeetings(this.value);
	}
});

window.main_create = function(inputModel, goToCreator){

	function createMeeting(editModel){
		var emptyModel = new Meeting({
			name: "Untitled Meeting"
		});
		var model = editModel || emptyModel;
		var creator = new CreatorGridView({
			model: model,
			el: document.getElementById('creator')
		});
		return creator;
	}

	var creator = createMeeting(inputModel);

	var view = creator;

	//Creator Form Bindings

	$("#creator-name").on("change", function(){
		view.model.set({
			name: this.value
		});
	});

	$("#creator-mid").on("change", function(){
		var newMID = this.value;
		Front.checkMeetingName(this.id);
		var checkID = new Promise(function (resolve, reject) {
			var testMeeting = new Meeting({ mid: newMID });
			testMeeting.fetch({
				// If it SUCCESSFULLY FETCHED A MEETING, the mid already exists
				success: function () {
					// so we say 'true' it alreadyExists
					resolve(true);
				},
				error: function (model, response) {
					if (response.status === 404) {
						// otherwise (on 404), it doesn't exist ('false')
						resolve(false);
					} else {
						reject(response.responseText);
					}
				}
			});
		});
		checkID.then(function(alreadyExists){
			if(alreadyExists){
				Front.displayUserError("Sorry, that id is already taken. Please choose a new one.");
			}
			else{
				view.model.set({
					creator: Front.getUID(),
					mid: newMID
				});
				vexDialog.open({
					message: `Is '${newMID}' the meeting ID you want?`,
					buttons: [
						$.extend({}, vexDialog.buttons.YES, {text: 'Yes'}),
						$.extend({}, vexDialog.buttons.NO, {text: 'No'})
					],
					callback: function(confirmed){
						if(confirmed){
							switchToMeetingEditor();
						}
					}
				})
			}
		});
	});

	function switchToMeetingEditor(){
		document.getElementById('meeting-creator').style.display = 'block';
		document.getElementById('choose-mid').style.display = 'none';
	}

	$("#creator-message").on("change", function(){
		view.model.set({
			message: this.value
		});
	});

	$("#add-dates").on("click", function(){
		document.getElementById('time-range-options').style.display = 'none';
		document.getElementById('date-range-options').style.display = 'block';
	});

	//For binding to daterangepicker callback
	window.addDateRange = function(start, end){
		view.addDateRange(start, end);
		document.getElementById('date-range-options').style.display = 'none';
	}

	$("#add-times").on("click", function(){
		document.getElementById('date-range-options').style.display = 'none';
		document.getElementById('time-range-options').style.display = 'block';
	});

	$("#creator-date").on("click", function(){
		var start = Front.getDateOptionFromInput('creator-date-start');
		var end = Front.getDateOptionFromInput('creator-date-end');
		if(start > end){
			Front.displayUserError("The end date you selected is before the start date.");
		}
		view.addDateRange(start, end);
		document.getElementById('date-range-options').style.display = 'none';
	});

	$("#creator-time").on("click", function(){
		var option = Front.getTimeOptionFromInput('creator');
		view.addTimeOption(option);
		document.getElementById('time-range-options').style.display = 'none';
	});

	$("#creator-save").on("click", function(){
		view.model.saveMeeting();
		vexDialog.alert("Meeting successfully saved!");
	});

	//Set current date/times for creator form:
	var today = new Date().getTime();
	document.getElementById('creator-date-start').value = moment(today).format("YYYY-MM-DD");
	document.getElementById('creator-date-end').value = moment(today + DateTimeHelper.DAY).format("YYYY-MM-DD");
	document.getElementById('creator-start').value = moment(today).format("HH:[00]");
	document.getElementById('creator-end').value = moment(today + DateTimeHelper.HOUR).format("HH:[00]");

	if(goToCreator){
		Menu.toggleSection('create-event', true);
		document.getElementById('creator-name').value = inputModel.get('name');
		document.getElementById('creator-message').value = inputModel.get('message');
		switchToMeetingEditor();
	}

}

window.logout = function () {
	sessionStorage.removeItem('uid');
	window.location = '/logout';
};

window.profile_information = function(meetings){
	/*var output = document.getElementById("profile-info");
		output.innerHTML = "";
		var html = '';
		console.log(meetings)*/
}

window.main_my_meetings = function(){
	Front.displayLoadingMessage('meetings-list');
	Menu.toggleSection("my-meetings");
	var promise = me.getMeetings();
	promise.then(function(meetings){
		var output = $("#meetings-list");
		output.empty();
		if(meetings.length > 0 ){
			meetings.forEach(meeting => {
				var html = '';
				html += `<button class="page-button">`;
				html += meeting.name;
				html += `</button>`;
				var button = $.parseHTML(html)[0];
				button.addEventListener('click', () => loadMeeting(meeting.mid));
				output.append(button);
			});
		}
		else{
			var html = '';
			html += `<p>You do not have any meetings.</p>`;
			output.append(html);
		}
		//profile_information(meetings);
	});
}

/*loadMeeting(SAMPLE_ID, function(view){
	view.rsvpToMeeting();
	//view.getSlotData(1452555000000);
	//view.inviteUsers();
});*/

window.convertTimeGridToRSVP = function(id, model){
	var rsvpModel = new RSVPModel(model.attributes);
	var rsvpView = new RSVPView({
		model: rsvpModel,
		el: document.getElementById(id)
	});
}

window.convertRSVPToTimeGrid = function(id, model){
	var model = new Meeting(model.attributes);
	var grid = new TimeGridView({
		model: model,
		el: document.getElementById(id)
	});
}

window.giveFeedback = function(){
	vexDialog.prompt({
		message: "Hi! Care to give us some feedback on omnipointment?",
		placeholder: "ex. Cool name, app needs work.",
		callback: function(feedback){
			if(feedback){
				Database.postFeedback(feedback);
				vexDialog.alert(`Thank you!<br>Check us out <a href="https://github.com/vingkan/omnipointment/">on GitHub.</a>`);
			}
		}
	});
}

/*
 * VOICE RECOGNITION with annyang.js
 * Move to own file later
 */

function datesToOption(date1, date2, avb){
	console.log(date1.getTime())
	return {
		uid: '',
		mid: '',
		startHours: date1.getHours(),
		startMinutes: date1.getMinutes(),
		free: avb,
		duration: (date2.getTime() - date1.getTime()) / DateTimeHelper.MINUTE,
		isPriority: false
	}
}

function rsvpByVoice(avb, inTime1, inPM1, inTime2, inPM2){
	var free = (avb === 'am NOT' ? false : true);
	//var outAvb = nlp.pos(avb).to_future().text().toLowerCase();
	var outAvb = (free ? 'will be' : 'will NOT be');
	var clock1 = inTime1.split(":");
	var time1 = {
		hours: parseInt(clock1[0]) + (inPM1 === 'p.m.' ? 12 : 0),
		minutes: (clock1[1] ? parseInt(clock1[1]) : 0)
	}
	var clock2 = inTime2.split(":");
	var time2 = {
		hours: parseInt(clock2[0]) + (inPM2 === 'p.m.' ? 12 : 0),
		minutes: (clock2[1] ? parseInt(clock2[1]) : 0)
	}
	var datestamp = window.activeRSVP.datestamp;
	var date1 = new Date(0, 0, 0, time1.hours, time1.minutes);
	var date2 = new Date(0, 0, 0, time2.hours, time2.minutes);
	var timeOption = datesToOption(date1, date2, free);
	var timeList = DateTimeHelper.generateTimeList([timeOption], new Date(datestamp));
	annyang.pause();
	var viewList = timeList.map(timestamp => window.activeRSVP.getSlotViewByTime(timestamp.time));
	//console.log(viewList)
	viewList.forEach(view => {
		if(view){
			view.forceToggleFree(free ? 2 : 0);
		}
	});
	vexDialog.alert("I marked that you " + outAvb + " free for " + (timeOption.duration / 60) + " hours.");
}

window.allowedAnnyang = false;
window.initAnnyang = function(){
	if(annyang){
		annyang.debug();
		annyang.start();
		var commands = {
			'I *avb free from *inTime1 *inPM1 to *inTime2 *inPM2': rsvpByVoice
		}
		annyang.addCommands(commands);
		annyang.pause();
		allowedAnnyang = true;
	}
	else{
		vexDialog.alert("Unfortunately, voice respond failed on your browser.");
	}
}