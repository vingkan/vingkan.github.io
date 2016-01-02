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

	$("#self-view").on("click", function(){
		view.viewAllResponses();
	});

	$("#self-invite").on("click", function(){
		view.inviteUsers();
	});

	//Assign models to their respective cells
	var slotList = view.model.get('slots')
	var timeMapPromise = view.getTimeMap();
	timeMapPromise.then(function(timeMap){
		timeMap.forEach(cell => {
			var overrides = {
				uid: view.model.get('responder'),
				mid: view.model.get('mid')
			}
			var slot = DateTimeHelper.getSlotFromTimeMap(slotList, cell.time, overrides);
			var idPath = 'time-slot-button-' + slot.time;
			var data = _.extend(slot, {
				meeting: view.model
			});
			var slotModel = new TimeSlotModel(data);
			var slotView = new TimeSlotView({
				model: slotModel,
				el: document.getElementById(idPath)
			});
		});
	});

}

function getResponseButton(view, time){
	var html = '';
		html = `<div id="time-slot-button-${time}"></div>`;
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
		var html = '';
			html += `<button id="self-view" class="page-button">`;
			html += "View All Responses";
			html += `</button>`;
			if(this.model.get('responder') === this.model.get('creator')){
				html += `<button id="self-invite" class="page-button">`;
				html += "Invite Others";
				html += `</button>`;
			}
		return html;
	},
	afterRender: function(){
		setBindings(this);
		this.model.saveResponses();
	},
	viewAllResponses: function(){
		convertRSVPToTimeGrid(this.el.id, this.model);
	}
});