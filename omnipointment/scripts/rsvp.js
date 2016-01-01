//BROWERSIFY IMPORTS
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');
var moment = require('moment');
var vex = require('vex-js');
var vexDialog = require('vex-js/js/vex.dialog');
//LOCAL IMPORTS
import {Meeting} from './meeting';
import {TimeSlotModel, TimeSlotView} from './timeslot';
import {TimeGridModel, TimeGridView} from './timegrid';
import {Front} from './frontend';
import {DateTimeHelper} from './dateTimeHelper';
import {Database} from './database';

export var RSVPModel = Meeting.extend({
	defaults: {
		responder: '', //user id of user RSVPing
		slots: [] //timeslots the user has RSVPed with
	},
    initialize: function () {
    	var userID = Front.getUID();
    	var model = this;
    	var timeslotsPromise = Database.getUserTimeSlots(userID, this.get('mid'));
    	timeslotsPromise.then(function(data){
    		var slots = []
    		if(data.slots){
    			slots = data.slots;
    		}
    		model.set('slots', slots);
    		model.set("responder", userID);
    	});
    },
    saveResponses: function(){
    	Database.postUserResponses(
    		this.get("responder"),
    		this.get("mid"),
    		this.get("slots")
    	);
    }
});

function setBindings(view){

	$(".toggle-time-slot").on("click", function(){
		var time = parseInt(this.id.split("-")[1]);
		view.toggleSlot(time);
	});

	$("#faq-flicker").on("click", function(){
		vexDialog.alert("Q: Why does the time grid flicker when I click a slot?<br>A: Oh, you're a curious one! Right now, the table you are RSVPing to refreshes whenever a slot inside it changes. In an upcoming upgrade, we will make slots only refresh themselves.")
	});

	$("#self-view").on("click", function(){
		view.viewAllResponses();
	});

}

function getResponseButton(view, time){
	var html = '';
	var response = DateTimeHelper.getSlotFromTimeMap(view.model.get('slots'), time);
	//console.log(response)
		var classList = "toggle-time-slot" + (response.free === 2 ? " free-slot" : " busy-slot");
		html += `<button id="toggle-${time}" class="${classList}">`;
		html += `${response.free === 2 ? "&#10004;" : "X"}`;
		html += `</button>`;
	return html;
}

export var RSVPView = TimeGridView.extend({
	renderTimeCell: function(dateOption, row, timeMap){
		var cell = DateTimeHelper.dateTimeToDate(dateOption, row.time);
		var slot = DateTimeHelper.getSlotFromTimeMap(timeMap, cell.getTime());
		var classList = `time-slot ${row.isPriority ? 'priority-slot' : ''}`;
		var format = moment(slot.time).format("M/D h:mm A")
		//return `<td class="${classList}">${format}</td>`;
		var html = `<td class="${classList}">`;
			html += `<div class="grid-cell">`;
			html += getResponseButton(this, cell.getTime());
			html += `</div>`;
			html += `</td>`;
		return html;
	},
	renderAfterGrid: function(model){
		var html = `<a id="faq-flicker"><p>FAQ: Why does the time grid flicker when I click a slot?</p></a>`;
			html += `<button id="self-view" class="page-button">`;
			html += "View All Responses";
			html += `</button>`;
		return html;
	},
	afterRender: function(){
		setBindings(this);
		this.model.saveResponses();
	},
	toggleSlot: function(time){
		var allSlots = _.clone(this.model.get('slots'));
		var targetIndex = -1;
		for(var s = 0; s < allSlots.length; s++){
			if(parseInt(allSlots[s].time) === parseInt(time)){
				targetIndex = s;
			}
		}
		var slot;
		if(targetIndex < 0){
			slot = {
				uid: this.model.get("responder"),
				mid: this.model.get("mid"),
				time: time,
				duration: 15,
				free: 0
			};
		}
		else{
			slot = _.clone(allSlots[targetIndex]);
			allSlots.splice(targetIndex, 1);
		}
		/*console.log(targetIndex)
		console.log(slot)
		console.log(`TOGGLE ${time} FROM ${slot.free} TO ${slot.free === 2 ? 0 : 2}`)*/
		slot.free = slot.free === 2 ? 0 : 2;
		//console.log(slot)
		allSlots.push(slot);
		this.model.set({
			slots: allSlots
		});
	},
	viewAllResponses: function(){
		convertRSVPToTimeGrid(this.el.id, this.model);
	}
});