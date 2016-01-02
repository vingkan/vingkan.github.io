//BROWERSIFY IMPORTS
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');
var moment = require('moment');
var vex = require('vex-js');
var vexDialog = require('vex-js/js/vex.dialog');
//LOCAL IMPORTS
import {Front} from './frontend';
import {DateTimeHelper} from './dateTimeHelper';
import {Database} from './database';

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

function setBindings(view){

	$("#self-rsvp").on("click", function(){
		view.rsvpToMeeting();
	});

	$("#self-invite").on("click", function(){
		view.inviteUsers();
	});

	$(".has-slot-data").on("click", function(){
		var timestamp = parseInt(this.id.split("-")[2]);
		view.getSlotData(timestamp);
	});
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
		setBindings(this);
	},
	renderMeetingName: function(attributes){
		return `<h1>${attributes.name}</h1>`;
	},
	renderMessageBox: function(message){
		return `<p>${message}</p>`;
	},
	renderColumnHeader: function(dateOption){
		var html = `<td class="grid-label">`;
			html += `<div class="grid-cell">`;
			html += `${moment(dateOption).format("M/D")}`;
			html += `</div>`;
			html += `</td>`;
		return html;
	},
	renderRowHeader: function(row){
		var html = `<td class="grid-label">`;
			html += `<div class="grid-cell">`;
			html += `${moment(row.time).format("h:mm A")}`;
			html += `</div>`;
			html += `</td>`;
		return html;
	},
	renderTimeCell: function(dateOption, row, timeMap){
		var cell = DateTimeHelper.dateTimeToDate(dateOption, row.time);
		var slot = DateTimeHelper.getSlotFromTimeMap(timeMap, cell.getTime());
		var classList = `time-slot ${row.isPriority ? 'priority-slot' : ''}`;
		var opacity = slot.data.numFree / slot.data.total;
		var styleSettings = `background: rgba(179, 255, 153, ${opacity});`;
		var html = `<td class="${classList}" style="${styleSettings}">`;
			html += `<div class="grid-cell has-slot-data" id="slot-data-${cell.getTime()}">`;
			html += `${slot.data.numFree}`;
			html += `</div>`;
			html += `</td>`;
		return html;
	},
	getSlotData: function(timestamp){
		var timeMapPromise = this.getTimeMap();
		timeMapPromise.then(function(timeMap){
			var slot = DateTimeHelper.getSlotFromTimeMap(timeMap, timestamp);
			var slotDateTime = moment(timestamp).format("M/D h:mm A");
				var html = '';
				html += `<h2>${moment(timestamp).format("M/D h:mm A")}</h2>`;
				if(slot.data.members.length > 0){
					var fraction = slot.data.numFree / slot.data.total;
					var punctuation = (fraction > 0.75) ? '!' : ((fraction > 0.45) ? '.' : ' :(');
					html += `<p>${(100 * (fraction)).toFixed(1)}% of your team is free${punctuation}</p>`;
					slot.data.members.forEach(member => {
						html += `<div class="member-data">`;
						html += `<div class="member-data-img" style="background-image: url('${member.img}');"></div>`;
						html += `<div class="member-data-name">${member.name}</div>`;
						html += `</div>`;
					});
				}
				else{
					html += `<p>No one is free :(</p>`;
				}
			vexDialog.alert(html);
		});
	},
	renderGridBody: function(view, attributes, timeMap){
		var datesList = view.model.getDateList();
		var html = `<table class="time-grid-view">`;
			//Top row of table with date labels
			html += `<tr>`;
			html += `<td class="grid-label"><div class="grid-cell">Time</div></td>`;
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
		var html = '';
			html += `<button id="self-rsvp" class="page-button">`;
			html += "RSVP to this Meeting";
			html += `</button>`;
			if(this.model.get('responder') === this.model.get('creator')){
				html += `<button id="self-invite" class="page-button">`;
				html += "Invite Others";
				html += `</button>`;
			}
		return html;
	},
	rsvpToMeeting: function(){
		convertTimeGridToRSVP(this.el.id, this.model);
	},
	inviteUsers: function(response = false, success = false){
		var view = this;
		var promise = this.model.getResponders();
		promise.then(function(responders){

			//Generate Dialog
			var html = ``;
			html += `<h2>Invite Teammates</h2>`;
			html += `<p>Invite by email. This meeting will be added to their meetings list.</p>`;
			html += `<input type="text" id="add-by-email" class="underscore-bar"><br>`;
			if(response){
				var classList = `p-alert${response.success ? ' success' : ' failure'}`;
				html += `<p class="${classList}" onclick="this.style.display='none';">${response.message} (click to close)</p>`;
			}
			html += `<h2>Your Team</h2>`;
			responders.forEach(member => {
				//Determine net availability
				var freeSlots = 0;
				member.slots.forEach(slot => {
					if(slot.free === 2){
						freeSlots++;
					}
				});
				var totalSlots = DateTimeHelper.getTimeMap(view.model.get('timeOptions')).length;
				var netAvb = freeSlots / totalSlots;
				//Add user information to dialog
				html += `<div class="member-data">`;
				html += `<div class="member-data-img" style="background-image: url('${member.user.img}');"></div>`;
				html += `<div class="member-data-name">`;
				html += `${member.user.name}`;
				html += ` (${(100*netAvb).toFixed(1)}% free)`;
				html += `</div>`;
				html += `</div>`;
			});
			vexDialog.alert(html);

			//Set Bindings
			$("#add-by-email").keypress(function(event){
				if(event.keyCode == 13){
					var promise = Database.addUserToMeeting(
						view.model.get('mid'),
						this.value
					);
					promise.then(function(success){
						var userList = _.clone(view.model.get('users'));
							userList.push(success.data);
						view.model.set({
							users: userList
						});
						view.inviteUsers(success, true);
					}).catch(function(reason){
						view.inviteUsers(reason, false);
					});
				}
			});

		});
	}
});