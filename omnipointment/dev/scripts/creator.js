//BROWERSIFY IMPORTS
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');
var moment = require('moment');
//LOCAL IMPORTS
import {TimeGridModel, TimeGridView} from './timegrid';
import {Front} from './frontend';
//IMPORT pickadate.js
import './pickadate/picker';
import './pickadate/picker.date';
import './pickadate/picker.time';
import './pickadate/legacy';

/*
 * REFERENCE S/O ARTICLE:
 * http://stackoverflow.com/questions/9403675/backbone-view-inherit-and-extend-events-from-parent
 */

function renderCreatorForm(){
	var currentDate = new Date();
	var currentDateString = moment(currentDate).format("YYYY-MM-DD");
	var html = '';
		html += `<button id="creator-add-date" class="page-button">Add Date</button>`;
		html += `<button id="creator-add-slot" class="page-button">Add Times</button>`;
		html += `</center><form class="time-slot-creator">`;
		html += `<input id="creator-date" type="text" value="${currentDateString}" style="display: none;">`;
		html += `<input id="creator-start" type="text" value="8:00 PM" style="display: none;">`;
		html += `<div id="start-picker" style="display: none;"><h2>Choose Start Time</h2></div>`;
		html += `<input id="creator-end" type="text" value="9:30 PM" style="display: none;">`;
		html += `<div id="end-picker" style="display: none;"><h2>Choose End Time</h2></div>`;
		html += `<label style="display: none;">`;
			html += `Priority:`;
			html += `<input id="creator-priority" type="checkbox">`;
		html += `</label>`;
		html += `</form><center>`;
	return html;
}

function renderMeetingName(attributes){
	var html = `<input type="text" id="creator-name" value="${attributes.name}" placeholder="New Meeting Name">`;
		html += `<input type="text" id='creator-mid' class="check-meeting-name" value="${attributes.mid}" placeholder="choose an appointment id for this meeting">`;
	return html;
}

function renderMessageBox(message){
	var html = `<textarea id="creator-message" placeholder="Type a new message here for your teammates to see!">${message}</textarea>`;
		html += renderCreatorForm();
	return html;
}

function renderColumnHeader(dateOption){
	var html = `<td class="grid-label">`;
		html += `${moment(dateOption).format("MM/DD")}`;
		html += `<button class="remove-date" id="remove-date-${dateOption}">x</button>`;
		html += `</td>`;
	return html;
}

function renderRowHeader(row){
	var html = `<td class="grid-label">`;
		html += `${moment(row.time).format("hh:mm A")}`;
		html += `<button class="remove-time" id="remove-time&${row.time}">x</button>`;
		html += `</td>`;
	return html;
}

function renderGridBody(view, attributes, parent){
	var html = '';
	console.log(attributes.dates, attributes.timeOptions)
	if(attributes.dates.length > 0 || attributes.timeOptions.length > 0){
		html += `<p>Click the "x" next to a date or time slot to remove it</p>`;
		console.log(parent)
		html += parent.renderGridBody(view, attributes);
	}
	else{
		html += `<p>When you add date/time options, your grid will be created here.</p>`;
	}
	return html
}

function setBindings(model){

	//Creator Form Bindings

	$(".remove-date").on("click", function(){
		var date = this.id.split("-")[2];
		console.log('REMOVE: ' + date);
		model.removeDateOption(date);
	});
	$(".remove-time").on("click", function(){
		var time = this.id.split("&")[1];
		console.log('REMOVE: ' + time);
		model.removeTimeOption(time);
	});
	$("#creator-name").on("change", function(){
		model.set({
			mid: this.value
		});
	});
	$("#creator-mid").on("change", function(){
		Front.checkMeetingName(this.id);
		model.set({
			mid: this.value
		});
	});
	$("#creator-message").on("change", function(){
		model.set({
			message: this.value
		});
	});
	



	//pickadate.js Bindings and Settings

	var creatorDatePicker = $("#creator-date").pickadate({
		format: "yyyy-mm-dd",
		onClose: function(){
			var date = Front.getDateOptionFromInput('creator');
			model.addDateOption(date);
		}
	});
	$("#creator-add-date").on("click", function(){
		var picker = creatorDatePicker.pickadate("picker");
		event.stopPropagation();
		picker.open();
	});

	var creatorStartTimePicker = $("#creator-start").pickatime({
		format: "h:i A",
		interval: 15,
		container: "#start-picker",
		onOpen: function(){
			document.getElementById("start-picker").style.display = "block";
		},
		onSet: function(){
			document.getElementById("start-picker").style.display = "none";
			var picker = creatorEndTimePicker.pickatime("picker");
			event.stopPropagation();
			picker.open();
		}
	});
	var creatorEndTimePicker = $("#creator-end").pickatime({
		format: "h:i A",
		interval: 15,
		container: "#end-picker",
		onOpen: function(){
			document.getElementById("end-picker").style.display = "block";
		},
		onClose: function(){
			document.getElementById("end-picker").style.display = "none";
			var option = Front.getTimeOptionFromInput('creator');
			model.addTimeOption(option);
		}
	});
	$("#creator-add-slot").on("click", function(){
		var picker = creatorStartTimePicker.pickatime("picker");
		event.stopPropagation();
		picker.open();
	});

	console.log(model.attributes);

}

export var CreatorGridView = TimeGridView.extend({
	/*render: function(){
		if(this.model.get('dates').length > 0 || this.model.get('timeOptions').length > 0){
			return TimeGridView.render();
		}
		else{
			return "kek";
		}
	},*/
	renderMeetingName: function(attributes){
		return renderMeetingName(attributes);
	},
	renderMessageBox: function(message){
		return renderMessageBox(message);
	},
	renderColumnHeader: function(dateOption){
		return renderColumnHeader(dateOption);
	},
	renderRowHeader: function(row){
		return renderRowHeader(row);
	},
	/*renderGridBody: function(view, attributes){
		return renderGridBody(view, attributes, TimeGridView);
	},*/
	afterRender: function(){
		var model = this.model;
		setBindings(model);
	}
});