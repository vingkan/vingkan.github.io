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
	//console.log(searchID);
	SAMPLE_ID = searchID;
}

//loadMeeting(SAMPLE_ID);

function loadMeeting(meetingID){
	var meetingPromise = Database.getMeetingById(meetingID);
		meetingPromise.then(function(meetingData){
			var gridModel = new TimeGridModel(meetingData);
			var grid = new TimeGridView({
				model: gridModel,
				el: document.getElementById('grid')
			});
			console.log(grid);
		});	
}

//New Meeting Creator
			var emptyModel = new TimeGridModel();
			var creator = new CreatorGridView({
				model: emptyModel,
				el: document.getElementById('creator')
			});
			console.log(creator);

//BINDINGS

//Class Bindings

$(".check-meeting-name").on("change", function(){
	Front.checkMeetingName(this.id);
});

$(".remove-date").on("click", function(){
	creator.model.removeDate()
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

$("#creator-save").on("click", function(){
	console.log("NEW MEETING OUTPUT");
	console.log(creator.model.attributes);
	console.log(JSON.stringify(creator.model.attributes));
});