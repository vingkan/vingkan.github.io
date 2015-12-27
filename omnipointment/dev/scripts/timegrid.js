//BROWERSIFY IMPORTS
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');
var moment = require('moment');
//GLOBAL VARIABLES
var MINUTE = 60000; //in milliseconds

function onlyUnique(value, index, self){
	return self.indexOf(value) === index;
}

function getDateColumnList(timeOptions){
	var allDates = [];
	timeOptions.forEach(option => {
		allDates.push.apply(allDates, option.dates);
	});
	var dateList = allDates.filter(onlyUnique);
	dateList.sort();
	return dateList;
}

//-2209053600000 is the epoch timestamp for new Date(0, 0, 0);
function dateTimeToDate(date = -2209053600000, time = -2209053600000){
	var dateSetting = new Date(date);
	var timeSetting;
	if(typeof time === "number"){
		timeSetting = new Date(time);
	}
	else{
		timeSetting = new Date(0, 0, 0,
			parseInt(time['startHours']),
			parseInt(time['startMinutes'])
		);
	}
	var result = new Date(
		parseInt(dateSetting.getFullYear()), 
		parseInt(dateSetting.getMonth()), 
		parseInt(dateSetting.getDate()), 
		parseInt(timeSetting.getHours()),
		parseInt(timeSetting.getMinutes())
	);
	return result;
}

function getSlotFromTimeMap(map, time){
	var response = {
		time: 0,
		numFree: 0,
		isPriority: false
	};
	map.forEach(slot => {
		if(slot.time == time){
			response = slot;
		}
	});
	return response;
}

function getTimeMap(timeOptions){
	var timeMap = [];
	timeOptions.forEach(options => {
		options.dates.forEach(date => {
			var list = generateTimeList([options], date);
			timeMap.push.apply(timeMap, list);
		});
	});
	return timeMap;
}

function checkAvailabilityAtTime(slots, time){
	var response = 0;
	slots.forEach(slot => {
		if(slot.time === time){
			//Need to refactor to consider priority slots
			response = 2;
		}
	});
	return response;
}

function timeIsInOption(time, option){
	var start = new Date(0, 0, 0, option.startHours, option.startMinutes);
	var difference = start.getTime() - time;
}

function analyzeTimeOptions(option1, option2){
	//Determine which timeOption is earlier
	var start1 = dateTimeToDate(null, option1);
	var start2 = dateTimeToDate(null, option2);
	var earlier;
	var later;
	var sameTime = false;
	if(start2.getTime() - start1.getTime() > 0){
		earlier = option1;
		later = option2;
	}
	else if(start2.getTime() === start1.getTime()){
		sameTime = true;
		if(option2.duration > option1.duration){
			earlier = option1;
			later = option2;
		}
		else{
			earlier = option2;
			later = option1;
		}
	}
	else{
		earlier = option2;
		later = option1;
	}
	//Check if timeOptions overlap
	var overlap = false;
	var earlierEnd = dateTimeToDate(null, earlier).getTime() + (earlier.duration * MINUTE);
	if(earlierEnd > dateTimeToDate(null, later).getTime()){
		overlap = true;
	}
	//Check if timeOptions are adjacent and can be merged
	var merged = false;
	var adjacent = earlierEnd === dateTimeToDate(null, later).getTime();
	var samePriority = earlier.isPriority === later.isPriority;
	//Merge two slots by joining them end-to-end
	if(samePriority && adjacent){
		merged = _.clone(earlier);
		merged.duration = merged.duration + later.duration;
	}
	//Merge two overlapping slots by joining the unique part of the latter to the former
	if(samePriority && overlap){
		var overlapSize = (earlierEnd - dateTimeToDate(null, later).getTime()) / MINUTE;
		var addFromLater = later.duration - overlapSize;
		merged = _.clone(earlier);
		merged.duration += addFromLater;
	}
	//TODO Case: Slots that overlap, but have different priority levels.
	//Need to remove lower priority slots and merge them to high priority timeOption
	//Check if one timeOption is inside the other
	var inside = false; //denotes that the later timeOption is inside the earlier one
	if(overlap){
		//earlierEnd is within scope
		var laterEnd = dateTimeToDate(null, later).getTime() + (later.duration * MINUTE);
		var sameEnd = (earlierEnd === laterEnd);
		if(sameTime || sameEnd){
			inside = true;
		}
		else if(laterEnd < earlierEnd){
			inside = true;
		}
	}
	console.log(option1, option2)
	var information = {
		earlier: earlier,
		later: later,
		sameTime: sameTime,
		samePriority: samePriority,
		overlap: overlap,
		adjacent: adjacent,
		inside: inside,
		merged: merged
	}
	//console.log(information);
	return information;
}
//analyzeTimeOptions({startHours: 2, startMinutes: 30, duration: 120},{startHours: 4, startMinutes: 0, duration: 60})

function getTimeOptionsInRange(timeOptions, option){
	var inRange = [];
	var outRange = [];
	timeOptions.forEach(timeOption => {
		var pair = analyzeTimeOptions(timeOption, option);
		if(pair.adjacent || pair.overlap){
			inRange.push(timeOption);
		}
		else{
			outRange.push(timeOption);
		}
	});
	return {
		inRange: inRange,
		outRange: outRange
	};
}

function checkIncomingTimeOption(timeOptions, option){
	var newList = [];
	var list = getTimeOptionsInRange(timeOptions, option);
	newList.push.apply(newList, list.outRange);
	var merged = false;
	list.inRange.forEach(timeOption => {
		if(!merged){
			var pair = analyzeTimeOptions(timeOption, option);
			if(pair.merged){
				merged = pair.merged;
			}
		}
		else{
			newList.push(timeOption);
		}
	});
	if(merged){
		newList = checkIncomingTimeOption(newList, merged);
	}
	else{
		newList.push(option);
	}
	return newList;
}

function constructTimeOption(epochTime, numOfSlots, isPriority = false, dateList){
	var optionDate = new Date(epochTime);
	var option = {
			dates: dateList,
			duration: (numOfSlots * 15),
			isPriority: isPriority,
			startHours: optionDate.getHours(),
			startMinutes: optionDate.getMinutes()
		}
	return option;
}

function splitTimeOption(option, split){
	var splitSlots = [];
	//Note that this process assumes that the option being split is bigger than or equal to the duration of the splitter
	//This process also assumes splits are only being made in intervals of 15 minutes
	var times = generateTimeList([option]);
	var beforeSlots = 0;
	var afterSlots = 0;
	var splitMade = false;
	var firstStartTime = false;
	var newStartTime = false;
	times.forEach(time => {
		if(splitMade){
			afterSlots++;
			if(!newStartTime){
				newStartTime = time.time;
			}
		}
		else if(time.time === split.time){
			splitMade = true;
		}
		else{
			beforeSlots++;
			if(!firstStartTime){
				firstStartTime = time.time;
			}
		}
		//console.log(`${time.time} vs ${split.time} (${beforeSlots}, ${afterSlots})`);
	});
	if(beforeSlots > 0){
		var beforeOption = constructTimeOption(
			firstStartTime,
			beforeSlots,
			option.isPriority,
			option.dates
		);
		splitSlots.push(beforeOption);
	}
	if(afterSlots > 0){
		var afterOption = constructTimeOption(
			newStartTime,
			afterSlots,
			option.isPriority,
			option.dates
		);
		splitSlots.push(afterOption);
	}
	return splitSlots;
}

function removeTimeOption(timeOptions, option){
	var newList = [];
	timeOptions.forEach(timeOption => {
		var pair = analyzeTimeOptions(timeOption, option);
		console.log(pair)
		if(pair.inside){
			var splitOptions = splitTimeOption(timeOption, option);
			newList.push.apply(newList, splitOptions);
		}
		else{
			newList.push(timeOption);
		}
	});
	return newList;
}

function addDateOption(timeOptions, date){
	timeOptions.forEach(option => {
		option.dates.push(date);
	});
	return timeOptions;
}

function removeDateOption(timeOptions, date){
	var date = parseInt(date);
	timeOptions.forEach(option => {
		var dateIndex = option.dates.indexOf(date);
		if(dateIndex > -1){
			option.dates.splice(dateIndex, 1);
		}
	});
	return timeOptions;
}

export var TimeGridModel = Backbone.Model.extend({
	defaults: {
		mid: '',
		creator: 'default-creator-id',
		message: '',
		name: '',
		timeOptions: [],
		users: [],
		responses: [],
		dates: []
	},
	initialize: function(){
		//Handle responses here
		this.attributes.responses.forEach(response => {
			response.availabilityAtTime = function(time){
				//console.log(`Is ${this.user.name} free at ${time}?`);
				//avb is an abbreviation for "availability"
				var avb = checkAvailabilityAtTime(this.slots, time);
				return avb;
			}
		});
		//Get the list of date-columns
		this.attributes.dates = [];
		this.attributes.dates = getDateColumnList(this.attributes.timeOptions);
		console.log(this.attributes)
		//Create meeting Time Map
		var timeMap = this.getTimeMap();
		timeMap.map(timeSlot => _.extend(timeSlot, {
			numFree: 0
		}));
		this.attributes.timeMap = timeMap;
	},
	getAttributes: function(){
		return _.extend(this.attributes);
	},
	getTimeMap: function(){
		var attributes = this.getAttributes();
		return getTimeMap(attributes.timeOptions);
	},
	populate: function(){
		this.attributes.timeMap.forEach(timeSlot => {
			this.attributes.responses.forEach(response => {
				var avb = response.availabilityAtTime(timeSlot.time);
				if(avb > 0){
					timeSlot.numFree++;
				}
			});	
		});
	},
	addTimeOption: function(option){
		/*
		 * Must clone and push a new array in order to trigger model change
		 * S/O Reference:
		 * http://stackoverflow.com/questions/18138141/backbone-model-array-property-change-and-change-event-listener-not-always-firing
		 */
		var list = _.clone(this.get('timeOptions'));
		option.dates = this.get('dates');
		list = checkIncomingTimeOption(list, option);
		this.set({dates: getDateColumnList(list)});
		this.set({timeOptions: list});
	},
	removeTimeOption: function(option){
		var cloneTimeOptions = _.clone(this.get('timeOptions'));
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
		this.set({
			timeOptions: removeTimeOption(cloneTimeOptions, removalOption)
		});
	},
	addDateOption: function(date){
		if(this.get('dates').indexOf(date) > -1){

		}
		else{
			if(this.get('timeOptions').length > 0){
				this.set({
					timeOptions: addDateOption(_.clone(this.get('timeOptions')), date)
				});
				//These must be in separate sets so that getDateColumnList() can read the new timeOptions and their date lists
				this.set({
					dates: getDateColumnList(this.get('timeOptions'))
				})
			}
			else{
				var dateList = _.clone(this.get('dates'));
					dateList.push(date);
					dateList.sort();
				this.set({
					dates: dateList
				});
			}			
		}
	},
	removeDateOption: function(date){
		this.set({
			timeOptions: removeDateOption(this.get('timeOptions'), date)
		});
		this.set({
			dates: getDateColumnList(this.get('timeOptions'))
		});
	}
});

function generateTimeList(optionsList, dateSetting = new Date(0, 0, 0)){
	var list = [];
	var increment = 15;
	optionsList.forEach(options => {
		var elapsed = 0;
		var date = dateTimeToDate(dateSetting, options);
		while(elapsed < options.duration){
			var timeOption = date.getTime();
			list.push({
				time: timeOption,
				isPriority: options.isPriority
			});
			var newTime = timeOption += (increment * MINUTE);
			date.setTime(newTime);
			elapsed += increment;
		}
	});
	return list;
}

function renderMeetingName(attributes){
	return `<h1>${attributes.name}</h1>`;
}

function renderMessageBox(message){
	return `<p>${message}</p>`;
}

function renderColumnHeader(dateOption){
	return `<td class="grid-label">${moment(dateOption).format("MM/DD")}</td>`;
}

function renderRowHeader(row){
	return `<td class="grid-label">${moment(row.time).format("hh:mm A")}</td>`;
}

function renderGridBody(view, attributes){
	var html = `<table class="time-grid-view">`;
		//Top row of table with date labels
		html += `<tr>`;
		html += `<td class="grid-label">Time</td>`;
		attributes.dates.forEach(dateOption => {
				html += view.renderColumnHeader(dateOption);
		});
		html += `</tr>`;
		//Fill rows with time slots
		var rowList = generateTimeList(attributes.timeOptions);
		rowList.forEach(row => {
			html += `<tr>`;
			//First row cell with time label
			html += view.renderRowHeader(row);
			attributes.dates.forEach(dateOption => {
				var cell = dateTimeToDate(dateOption, row.time);
				var slot = getSlotFromTimeMap(attributes.timeMap, cell.getTime());
				var classList = `time-slot ${row.isPriority ? 'priority-slot' : ''}`;
				//var opacity = slot.numFree / attributes.responses.length;
				var styleSettings = `background: rgba(179, 255, 153, ${opacity});`;
				var opacity = (1 - (slot.numFree / attributes.responses.length));
				var styleSettings = `background: rgba(255, 255, 255, ${opacity});`;
				html += `<td class="${classList}" style="${styleSettings}">${slot.numFree}</td>`;
			});
			html += `</tr>`;
		});
		html += `</table>`;
	return html;
}

function createGridTemplate(view){
	var attributes = _.extend(view.model.getAttributes());
	var html = `
		<center>
		${view.renderMeetingName(attributes)}
		${view.renderMessageBox(attributes.message)}
		<div class="table-slider">
	`;
	html += view.renderGridBody(view, attributes);
	html += `
		</div>
		</center>
	`;
	var templateFunction = _.template(html);
	return templateFunction(attributes);
}

export var TimeGridView = Backbone.View.extend({
	template: function(attributes){
		return createGridTemplate(attributes);
	},
	initialize: function(){
		console.log(this.model.attributes)
		this.model.populate();
		this.listenTo(this.model, "change", this.render);
		this.render();
	},
	render: function(){
		this.$el.html(this.template(this));
		this.afterRender();
		return this;
	},
	afterRender: function(){
		//Do Nothing: Mainly to be overridden by child view object
	},
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
	renderGridBody: function(view, attributes){
		return renderGridBody(view, attributes);
	}
});