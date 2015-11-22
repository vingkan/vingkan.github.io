var GLOBAL_TIMESLOTS = [];
var GLOBAL_TIMESLOT_VIEWS = [];

function createTimeRangeArray(options, userTimeSlots) {
	var date = options['start'];
	var interval = options['interval'];
	var timeSlotList = userTimeSlots;
	//console.log(timeSlotList)

	var slots = [];
	for(var t = 0; t < options['length']; t+=interval){
		var div = document.createElement('div');
		var freeData = options['free'] || 0;

		if(userTimeSlots){
			var resultArray = compareSortedTimeSlotList(date, timeSlotList);
			//console.log(resultArray)
			var comparisonResult = resultArray[resultArray.length - 1];
			//console.log(comparisonResult)
			if(comparisonResult > 0){
				//console.log('MATCH!')
				freeData = comparisonResult;
				timeSlotList = resultArray.slice(0, timeSlotList.length - 1);
			}
		}

		var model = new TimeSlotModel({
			el: div,
			mid: options['mid'],
			time: date.getTime(),
			duration: interval,
			free: freeData,
			isPriority: options['isPriority']
		});
		slots.push(model);
		date.setUTCMinutes(date.getUTCMinutes() + interval);
	}
	return slots;
}

function renderTimeRange(outputID, timeSlotArray) {
	var output = document.getElementById(outputID);
	for (var i = 0, len = timeSlotArray.length; i < len; i++) {
		var view = new TimeSlotView({ model: timeSlotArray[i]});
		GLOBAL_TIMESLOT_VIEWS.push(view);
		view.render();
		output.appendChild(view.el);
	}
	timeSlotArray.forEach((timeslot) => GLOBAL_TIMESLOTS.push(timeslot));
}

function renderTimeRanges(outputID, timeRangeArray) {
	var output = document.getElementById(outputID);
	var size = timeRangeArray.length;
	for(var r = 0; r < size; r++){
		if(r > 0) {
			var rangeBreak = document.createElement('p');
			rangeBreak.className = 'range-break';
			rangeBreak.innerText = '...';
			output.appendChild(rangeBreak);
		}
		renderTimeRange(outputID, timeRangeArray[r])
	}
}

function checkSlots(targetID){
	var response = [];
	var slotsArray = xtag.query(document.getElementById(targetID), 'x-timeslot');
	var size = slotsArray.length;
	for(var s = 0; s < size; s++){
		if(slotsArray[s].free){
			console.log(moment(new Date(parseInt(slotsArray[s].time, 10))).format('h:mm A') + ' (' + slotsArray[s].duration + ')');
			response.push(slotsArray[s]);
		}
	}
	return response;
}

console.log('LOADED application.js');