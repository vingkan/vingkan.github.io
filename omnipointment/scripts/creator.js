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

/*
 * REFERENCE S/O ARTICLE:
 * http://stackoverflow.com/questions/9403675/backbone-view-inherit-and-extend-events-from-parent
 */

function setBindings(view){

	$(".remove-date").on("click", function(){
		var date = this.id.split("-")[2];
		view.removeDateOption(date);
	});

	$(".remove-time").on("click", function(){
		var time = this.id.split("&")[1];
		view.removeTimeOption(time);
	});

}

export var CreatorGridView = TimeGridView.extend({
	renderColumnHeader: function(dateOption){
		var html = `<td class="grid-label">`;
			html += `<div class="grid-cell">`;
			html += `${moment(dateOption).format("M/D")}`;
			html += `<button class="remove-date" id="remove-date-${dateOption}">x</button>`;
			html += `</div>`;
			html += `</td>`;
		return html;
	},
	renderRowHeader: function(row){
		var html = `<td class="grid-label">`;
			html += `<div class="grid-cell">`;
			html += `${moment(row.time).format("h:mm A")}`;
			html += `<button class="remove-time" id="remove-time&${row.time}">x</button>`;
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
			html += `-`;
			html += `</div>`;
			html += `</td>`;
		return html;
	},
	renderGridBody: function(view, attributes, timeMap){
		var html = '';
		if(attributes.dates.length > 0 || attributes.timeOptions.length > 0){
			html += `<p>Click the "x" next to a date or time slot to remove it.</p>`;
			html += TimeGridView.prototype.renderGridBody(view, attributes, timeMap);
		}
		else{
			html += `<p>When you add date/time options, your grid will be created here.</p>`;
		}
		return html
	},
	renderAfterGrid: function(model){
		return '';
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
	addDateRange: function(start, end){
		var startTime = new Date(start).getTime();
		var endTime = new Date(end).getTime();
		var currentTime = startTime;
		while(currentTime < endTime){
			this.addDateOption(currentTime);
			currentTime += DateTimeHelper.DAY;
		}
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