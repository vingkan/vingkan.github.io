//BROWERSIFY IMPORTS
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');
var moment = require('moment');
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
    		model.set('slots', data.slots);
    		model.set("responder", userID);
    		console.log(model.attributes);
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
		var time = this.id.split("-")[1];
		view.toggleSlot(time);
	});

}

function getResponseButton(view, time){
	var html = '';
	var response = DateTimeHelper.getSlotFromTimeMap(view.model.get('slots'), time);
	//console.log(response)
		html += `<button id="toggle-${time}" class="toggle-time-slot">`;
		html += `${response.free}`;
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
		return '';
	},
	afterRender: function(){
		setBindings(this);
	},
	toggleSlot: function(time){
		var allSlots = _.clone(this.model.get('slots'));
		var targetIndex = -1;
		for(var s = 0; s < allSlots.length; s++){
			if(allSlots[s].time === time){
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
		console.log(slot)
		console.log(`TOGGLE ${time} FROM ${slot.free} TO ${slot.free === 2 ? 0 : 2}`)
		slot.free = slot.free === 2 ? 0 : 2;
		console.log(slot)
		allSlots.push(slot);
		this.model.set({
			slots: allSlots
		});
	}
});