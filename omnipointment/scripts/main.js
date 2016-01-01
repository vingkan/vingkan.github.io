//BROWERSIFY IMPORTS
var $ = require('jquery');
var moment = require('moment');
var vex = require('vex-js');
var vexDialog = require('vex-js/js/vex.dialog');
//LOCAL IMPORTS
import {Database} from './database';
import {TimeSlotModel, TimeSlotView} from './timeslot';
import {TimeGridModel, TimeGridView} from './timegrid';
import {RSVPModel, RSVPView} from './rsvp';
import {CreatorGridView} from './creator';
import {Front} from './frontend';
import {Menu} from './menu';
//DEVELOPMENT USE
import {FirebaseHandler} from './firebase-handler';
import {Meeting} from './meeting';

//FirebaseHandler.handle();
vex.defaultOptions.className = 'vex-theme-wireframe';

if(!Front.loadUser()){
	window.location = 'login.html';
}

function searchMeetings(value){
	loadMeeting(value);
}

var SAMPLE_ID = "github-party";

if(location.search.length > 1){
	var searchID = location.search.substr(1);
	SAMPLE_ID = searchID;
}

function loadMeeting(meetingID, callback){
	Menu.toggleSection('find-meeting');
	Front.displayLoadingMessage('grid');
	//RESTFUL API CODE:
		/*var meeting = new Meeting({ mid: meetingID });
		meeting.fetch({
			success: function (model) {
				var grid = new TimeGridView({
					model: model,
					el: document.getElementById('grid')
				});
			},
			error: function () {
				// remove the loading message
			}
		});*/
	var meetingPromise = Database.getMeetingById(meetingID);
		meetingPromise.then(function(meetingData){
			var gridModel = new Meeting(meetingData);
			var grid = new TimeGridView({
				model: gridModel,
				el: document.getElementById('grid')
			});
			if(callback){
				callback(grid);
			}
		}).catch(function(reason){
			console.log("Failed to load meeting: " + reason);
			document.getElementById('grid').innerHTML = `<p>${reason}</p>`;
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
	window.location = 'index.html';
});

$("#menu-button").on("click", function(){
	Menu.toggleSection('view-menu');
});

$("#search-button").on("click", function(){
	Front.checkMeetingName(this.id);
	searchMeetings(this.value);
});

$('#search-meetings').keypress(function(event){
	if(event.keyCode == 13){
		Front.checkMeetingName(this.id);
		searchMeetings(this.value);
	}
});

window.main_create = function(){

	function createMeeting(){
		var emptyModel = new Meeting({
			name: "Untitled Meeting"
		});
		var creator = new CreatorGridView({
			model: emptyModel,
			el: document.getElementById('creator')
		});
		return creator;
	}

	var creator = createMeeting();

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
		var checkID = Database.meetingIDExists(newMID);
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
							document.getElementById('meeting-creator').style.display = 'block';
							document.getElementById('choose-mid').style.display = 'none';
						}
					}
				})
			}
		});
	});

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

	$("#creator-time").on("click", function(){
		var option = Front.getTimeOptionFromInput('creator');
		view.addTimeOption(option);
		document.getElementById('time-range-options').style.display = 'none';
	});

	$("#creator-save").on("click", function(){
		view.model.saveMeeting();
	});

}

window.main_my_meetings = function(){
	Front.displayLoadingMessage('meetings-list');
	Menu.toggleSection("my-meetings");
	var promise = Database.getUserMeetings(Front.getUID());
	promise.then(function(meetings){
		var output = document.getElementById("meetings-list");
		output.innerHTML = "";
		meetings.forEach(meeting => {
			var html = '';
				html += `<button class="page-button" id="load-${meeting.mid}">`;
				html += meeting.name;
				html += `</button>`;
			output.innerHTML += html;
			$("#load-" + meeting.mid).on("click", function(){
				loadMeeting(meeting.mid);
			});
		});
	});
}

loadMeeting(SAMPLE_ID, function(view){
	view.rsvpToMeeting();
});

window.convertTimeGridToRSVP = function(id, model){
	var rsvpModel = new RSVPModel(model.attributes);
	var rsvpView = new RSVPView({
		model: rsvpModel,
		el: document.getElementById(id)
	});
}