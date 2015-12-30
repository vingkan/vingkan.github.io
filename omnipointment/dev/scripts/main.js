//BROWERSIFY IMPORTS
var $ = require('jquery');
//LOCAL IMPORTS
import {Database} from './database';
import {TimeSlotModel, TimeSlotView} from './timeslot';
import {TimeGridModel, TimeGridView} from './timegrid';
import {CreatorGridView} from './creator';
import {Front} from './frontend';
import {Menu} from './menu';
//DEVELOPMENT USE
import {FirebaseHandler} from './firebase-handler';
import {Meeting} from './meeting';
window.Meeting = Meeting;
//FirebaseHandler.handle();

Front.setUserErrorOutput('error-output');

/*var slotModel = new TimeSlotModel({
	time: 1450489033624,
	duration: 30
});

var slot = new TimeSlotView({
	model: slotModel,
	el: document.getElementById('demo')
});

$("#demo-toggle").on("click", function(){
	slot.model.set("duration", 20);
});

slot.model.set("duration", 40);

console.log(slot);*/

function searchMeetings(value){
	loadMeeting(value);
}

var SAMPLE_ID = "entelechy-labs";

if(location.search.length > 1){
	var searchID = location.search.substr(1);
	SAMPLE_ID = searchID;
}

loadMeeting(SAMPLE_ID);

function loadMeeting(meetingID){
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
		}).catch(function(reason){
			console.log("Failed to load meeting: " + reason);
		});	
}

function createMeeting(){
	var emptyModel = new Meeting();
	var creator = new CreatorGridView({
		model: emptyModel,
		el: document.getElementById('creator')
	});
	return creator;
}

//BINDINGS

//Class Bindings

$(".check-meeting-name").on("change", function(){
	Front.checkMeetingName(this.id);
});

//ID Bindings

$("#image-bubble").on("click", function(){
	Menu.toggleSection('my-meetings');
});

$("#logo").on("click", function(){
	Menu.toggleSection('view-menu');
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

$("#creator-new").on("click", function(){
	var creator = createMeeting();
	sessionStorage.setItem('creator', creator);
});