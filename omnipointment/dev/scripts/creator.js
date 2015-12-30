//BROWERSIFY IMPORTS
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');
var moment = require('moment');
//LOCAL IMPORTS
import {TimeGridModel, TimeGridView} from './timegrid';
import {Front} from './frontend';
import {DateTimeHelper} from './dateTimeHelper';
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
		html += `<div id="calendar-picker" style="display: none;"><h2>Choose Date</h2></div>`;
		html += `<div id="start-picker" style="display: none;"><h2>Choose Start Time</h2></div>`;
		html += `<div id="end-picker" style="display: none;"><h2>Choose End Time</h2></div>`;
		html += `<button id="creator-add-date" class="page-button half-button">Add Date</button>`;
		html += `<button id="creator-add-slot" class="page-button half-button">Add Times</button>`;
		html += `</center>`;
		html += `<form class="time-slot-creator">`;
		html += `<input id="creator-date" type="text" value="${currentDateString}" style="display: none;">`;
		html += `<input id="creator-start" type="text" value="8:00 PM" style="display: none;">`;
		html += `<input id="creator-end" type="text" value="9:30 PM" style="display: none;">`;
		html += `<label style="display: none;">`;
			html += `Priority:`;
			html += `<input id="creator-priority" type="checkbox">`;
		html += `</label>`;
		html += `</form>`;
		html += `<center>`;
	return html;
}

function setBindings(view){

	//Creator Form Bindings

	$(".remove-date").on("click", function(){
		var date = this.id.split("-")[2];
		view.removeDateOption(date);
	});
	$(".remove-time").on("click", function(){
		var time = this.id.split("&")[1];
		view.removeTimeOption(time);
	});
	$("#creator-name").on("change", function(){
		view.model.set({
			mid: this.value
		});
	});
	$("#creator-mid").on("change", function(){
		Front.checkMeetingName(this.id);
		view.model.set({
			mid: this.value
		});
	});
	$("#creator-message").on("change", function(){
		view.model.set({
			message: this.value
		});
	});
	$("#creator-save").on("click", function(){
		view.model.saveMeeting();
		/*console.log("NEW MEETING OUTPUT");
		console.log(view.model.attributes);
		console.log(JSON.stringify(view.model.attributes));*/
	});
	
	//pickadate.js Bindings and Settings

	var creatorDatePicker = $("#creator-date").pickadate({
		format: "yyyy-mm-dd",
		container: "#calendar-picker",
		onOpen: function(){
			//Scroll so the whole timeOption is visible: need something more sustainable
			//$('html,body').animate({scrollTop: window.screen.availHeight + 100}, 1000);
			document.getElementById("calendar-picker").style.display = "block";
		},
		onClose: function(){
			document.getElementById("calendar-picker").style.display = "none";
			var date = Front.getDateOptionFromInput('creator');
			view.addDateOption(date);
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
			//Scroll so the whole timeOption is visible: need something more sustainable
			//$('html,body').animate({scrollTop: window.screen.availHeight + 100}, 1000);
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
			//Scroll so the whole timeOption is visible: need something more sustainable
			//$('html,body').animate({scrollTop: window.screen.availHeight + 100}, 1000);
			document.getElementById("end-picker").style.display = "block";
		},
		onClose: function(){
			document.getElementById("end-picker").style.display = "none";
			var option = Front.getTimeOptionFromInput('creator');
			view.addTimeOption(option);
		}
	});
	$("#creator-add-slot").on("click", function(){
		var picker = creatorStartTimePicker.pickatime("picker");
		event.stopPropagation();
		picker.open();
	});

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
		var html = `<input type="text" id="creator-name" value="${attributes.name}" placeholder="New Meeting Name">`;
			html += `<input type="text" id='creator-mid' class="check-meeting-name" value="${attributes.mid}" placeholder="choose an appointment id for this meeting">`;
		return html;
	},
	renderMessageBox: function(message){
		var html = `<textarea id="creator-message" placeholder="Type a new message here for your teammates to see!">${message}</textarea>`;
			html += renderCreatorForm();
		return html;
	},
	renderColumnHeader: function(dateOption){
		var html = `<td class="grid-label">`;
			html += `${moment(dateOption).format("M/D")}`;
			html += `<button class="remove-date" id="remove-date-${dateOption}">x</button>`;
			html += `</td>`;
		return html;
	},
	renderRowHeader: function(row){
		var html = `<td class="grid-label">`;
			html += `${moment(row.time).format("h:mm A")}`;
			html += `<button class="remove-time" id="remove-time&${row.time}">x</button>`;
			html += `</td>`;
		return html;
	},
	renderTimeCell: function(dateOption, row, timeMap){
		var cell = DateTimeHelper.dateTimeToDate(dateOption, row.time);
		var slot = DateTimeHelper.getSlotFromTimeMap(timeMap, cell.getTime());
		var classList = `time-slot ${row.isPriority ? 'priority-slot' : ''}`;
		var format = moment(slot.time).format("M/D h:mm A")
		return `<td class="${classList}">${format}</td>`;
	},
	renderGridBody: function(view, attributes, timeMap){
		var html = '';
		if(attributes.dates.length > 0 || attributes.timeOptions.length > 0){
			html += `<p>Click the "x" next to a date or time slot to remove it</p>`;
			html += TimeGridView.prototype.renderGridBody(view, attributes, timeMap);
		}
		else{
			html += `<p>When you add date/time options, your grid will be created here.</p>`;
		}
		return html
	},
	renderAfterGrid: function(model){
		return `<button id="creator-save" class="page-button">Save Meeting</button>`;
	},
	afterRender: function(){
		setBindings(this);
	},
	addTimeOption: function(option){
		var list = _.clone(this.model.get('timeOptions'));
		option.dates = this.model.getDateList();
		list = DateTimeHelper.checkIncomingTimeOption(list, option);
		this.sortTimeOptions();
		this.model.set({timeOptions: list});
	},
	removeTimeOption: function(option){
		var cloneTimeOptions = _.clone(this.model.get('timeOptions'));
		var optionTime = parseInt(option);
		var optionDate = new Date(optionTime);
		var removalOption = {
			dates: [],
			duration: 15,
			isPriority: false,
			startHours: optionDate.getHours(),
			startMinutes: optionDate.getMinutes(),
			time: optionTime
		}
		this.sortTimeOptions();
		this.model.set({
			timeOptions: DateTimeHelper.removeTimeOption(cloneTimeOptions, removalOption)
		});
	},
	addDateOption: function(date){
		console.log('ADD: ' + date)
		var datesList = this.model.getDateList();
		if(datesList.indexOf(date) > -1){

		}
		else{
			if(this.model.get('timeOptions').length > 0){
				var timeOptionsList = DateTimeHelper.addDateOption(this.model.get('timeOptions'), date);
				var newList = _.clone(timeOptionsList);
				this.model.set({
					timeOptions: newList
				});
				//Not sure why I had to force this to render, even when the list was cloned
				this.render();
			}
			else{
				var dateList = this.model.getDateList();
					dateList.push(date);
					dateList.sort();
				//Creates an empty timeOption:
				var emptyOption = {
					dates: dateList,
					duration: 0,
					isPriority: false,
					startHours: 0,
					startMinutes: 0
				}
				this.model.set({
					timeOptions: [emptyOption]
				});
			}			
		}
	},
	removeDateOption: function(date){
		this.model.set({
			timeOptions: DateTimeHelper.removeDateOption(this.model.get('timeOptions'), date)
		});
		this.model.set({
			dates: this.model.getDateList()
		});
	}
});