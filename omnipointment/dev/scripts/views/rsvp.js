//BROWERSIFY IMPORTS
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');
var moment = require('moment');
var vex = require('vex-js');
var vexDialog = require('vex-js/js/vex.dialog');
//LOCAL IMPORTS
import {Meeting} from '../models/meeting';
import {TimeSlotView} from './timeslot';
import {TimeSlotModel} from '../models/timeslot';
import {TimeGridView} from './timegrid';
import {Front} from '../frontend';
import {DateTimeHelper} from '../dateTimeHelper';
import {Database} from '../database';

function setBindings(view){

	//Assign models to their respective cells
	view.slotViews = [];
	var slotList = view.model.get('slots')
	var timeMap = view.getTimeMap();
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
		view.slotViews.push(slotView);
	});

}

function getResponseButton(view, time){
	var html = '';
		html = `<div id="time-slot-button-${time}"></div>`;
	return html;
}

export var RSVPView = TimeGridView.extend({
	slotViews: [],
	events: {
		'click #self-view' : 'viewAllResponses',
		'click #self-invite': 'inviteUsers',
		'click .voice-respond': 'voiceRespondToDate'
	},
	renderMessageBox: function(message){
		var html = `<p>${message}</p>`;
			html += `<p class="quotation"><b>Experimental Feature</b><br>Press a <img class="icon" src="style/img/icon-microphone-charcoal.png"> to fill out that column with voice Command!</p>`;
		return html;
	},
	renderColumnHeader: function(dateOption){
		var html = `<td class="grid-label">`;
			html += `<div class="grid-cell">`;
			html += `${moment(dateOption).format("M/D")}`;
			var timestamp = new Date(dateOption).getTime();
			html += `<button id="voice-date-${timestamp}" `;
			html += `class="voice-respond"></button>`;
			html += `</div>`;
			html += `</td>`;
		return html;
	},
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
	renderBeforeGrid: function(model){
		var html = '';
			//Switch to TimeGrid View
			html += `<button id="self-view" class="page-button before-button">`;
			html += "View All Responses";
			html += `</button>`;
		return html;
	},
	renderAfterGrid: function(model){
		var html = '';
			//Invite Others and View Team
			html += `<button id="self-invite" class="page-button">`;
			html += "Invite Others";
			html += `</button>`;
		return html;
	},
	afterRender: function(){
		setBindings(this);
	},
	viewAllResponses: function(){
		this.close();
		convertRSVPToTimeGrid(this.el.id, this.model);
	},
	voiceRespondToDate: function(e){
		if(allowedAnnyang){
			var element = e.target;
			var datestamp = parseInt(element.id.split("-")[2]);
			if(annyang){
				window.activeRSVP = _.extend(this, {datestamp: datestamp});
				annyang.resume();
				var html = `<h2>Voice Command Activated</h2>`;
					html += `<p>Tell me your availability for ${moment(datestamp).format("M/D")} in this format:</p>`;
					html += `<p class="quotation">I am/am NOT free from 9:30 AM to 6:30 PM.</p>`;
				vexDialog.alert(html);
			}
			else{
				vexDialog.alert("Unfortunately, voice respond failed on your browser.");
			}
		}
		else{
			initAnnyang();
			this.voiceRespondToDate(e);
		}
	},
	getSlotViewByTime: function(timestamp){
		console.log("target: " + timestamp)
		var response = null;
		this.slotViews.forEach(slot => {
			//console.log(slot.model.get('time'))
			if(slot.model.get('time') === timestamp){
				//console.log("found it"); ---> SHOWS UP 3 TIMES??
				response = slot;
			}
		})
		return response;
	}
});