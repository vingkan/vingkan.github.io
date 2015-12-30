//BROWERSIFY IMPORTS
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');
var moment = require('moment');
//LOCAL IMPORTS
import {Front} from './frontend';
import {DateTimeHelper} from './dateTimeHelper';

function createGridTemplate(view, timeMap){
	var attributes = _.extend(view.model.getAttributes());
	var html = `
		<center>
		${view.renderMeetingName(attributes)}
		${view.renderMessageBox(attributes.message)}
		<div class="table-slider">
	`;
	html += view.renderGridBody(view, attributes, timeMap);
	html += `
		</div>
		</center>
		${view.renderAfterGrid(view.model)}
	`;
	var templateFunction = _.template(html);
	return templateFunction(attributes);
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

export var TimeGridView = Backbone.View.extend({
	initialize: function(){
		//console.log(this.model.attributes);
		this.listenTo(this.model, "change", this.render);
		this.render();
	},
	getTimeMap: function(){
		var timeMap = DateTimeHelper.getTimeMap(this.model.get('timeOptions'));
		var respondersPromise = this.model.getResponders();
		var timeMapPromise = new Promise(function(resolve, reject){
			respondersPromise.then(function(responders){
				timeMap.forEach(timeSlot => {
					timeSlot.data.total = responders.length;
					responders.forEach(response => {
						var avb = checkAvailabilityAtTime(response.slots, timeSlot.time);
						if(avb > 0){
							timeSlot.data.numFree++;
							timeSlot.data.members.push(response.user);
						}
					});	
				});
				resolve(timeMap);
			}).catch(function(reason){
				//Front.displayUserError(reason);
				resolve(timeMap);
			})
		});
		return timeMapPromise;
	},
	sortTimeOptions: function(){
		var list = _.clone(this.model.get('timeOptions'));
		list.sort(function(a, b){
			var aTime = DateTimeHelper.dateTimeToDate(null, a).getTime();
			var bTime = DateTimeHelper.dateTimeToDate(null, b).getTime();
			console.log(aTime, bTime);
			if(aTime > bTime){
				return 1;
			}
			else{
				return -1;
			}
			//No other case: should have been handled in merging/splitting
		});
		this.model.set({timeOptions: list});
	},
	template: function(view, timeMap){
		return createGridTemplate(view, timeMap);
	},
	render: function(){
		var view = this;
		Front.displayLoadingMessage(this.el.id);
		var timeMapPromise = this.getTimeMap();
		timeMapPromise.then(function(timeMap){
			view.$el.html(view.template(view, timeMap));
			view.afterRender();
		}).catch(function(reason){
			view.$el.html(view.template(view, []));
			view.afterRender();
			console.log('ERROR: ' + reason);
		});
		/*var timeMap = null;
		timeMapPromise.then(map => {
			timeMap = map;
			return this.model.getResponders();
		}).then(responders => {
			this.model.set('responders', responders);
			
		});*/
		return this;
	},
	afterRender: function(){
		//Do Nothing: Mainly to be overridden by child view object
	},
	renderMeetingName: function(attributes){
		return `<h1>${attributes.name}</h1>`;
	},
	renderMessageBox: function(message){
		return `<p>${message}</p>`;
	},
	renderColumnHeader: function(dateOption){
		return `<td class="grid-label">${moment(dateOption).format("M/D")}</td>`;
	},
	renderRowHeader: function(row){
		return `<td class="grid-label">${moment(row.time).format("h:mm A")}</td>`;
	},
	renderTimeCell: function(dateOption, row, timeMap){
		var cell = DateTimeHelper.dateTimeToDate(dateOption, row.time);
		var slot = DateTimeHelper.getSlotFromTimeMap(timeMap, cell.getTime());
		var classList = `time-slot ${row.isPriority ? 'priority-slot' : ''}`;
		//var opacity = slot.numFree / attributes.responses.length;
		var styleSettings = `background: rgba(179, 255, 153, ${opacity});`;
		var opacity = (1 - (slot.data.numFree / slot.data.total));
		var styleSettings = `background: rgba(255, 255, 255, ${opacity});`;
		var html = `<td class="${classList}" style="${styleSettings}">`;
			html += `${slot.data.numFree}`;
			html += `<div class="member-list"><ul>`;
			slot.data.members.forEach(member => {
				html += `<li>${member.name}</li>`;
			});
			html += `</ul></div>`;
			html += `</td>`;
		return html;
	},
	renderGridBody: function(view, attributes, timeMap){
		var datesList = view.model.getDateList();
		var html = `<table class="time-grid-view">`;
			//Top row of table with date labels
			html += `<tr>`;
			html += `<td class="grid-label">Time</td>`;
			datesList.forEach(dateOption => {
					html += view.renderColumnHeader(dateOption);
			});
			html += `</tr>`;
			//Fill rows with time slots
			var rowList = DateTimeHelper.generateTimeList(attributes.timeOptions);
			rowList.forEach(row => {
				html += `<tr>`;
				//First row cell with time label
				html += view.renderRowHeader(row);
				datesList.forEach(dateOption => {
					html += view.renderTimeCell(dateOption, row, timeMap);
				});
				html += `</tr>`;
			});
			html += `</table>`;
		return html;
	},
	renderAfterGrid: function(model){
		return '';
	}
});