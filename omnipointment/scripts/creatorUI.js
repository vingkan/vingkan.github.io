var dateOptions = [];
var timeOptions = [];

function parseTimeAspects(formID){
	var input = document.getElementById(formID).value;
	var hours = parseInt(input.substr(0, 2), 10);
	var minutes = parseInt(input.substr(3, 2), 10);
	return {
		hours: hours,
		minutes: minutes
	};
}

function parseDateAspects(date){
	var year = parseInt(date.substr(0, 4), 10);
	var month = parseInt(date.substr(5, 2), 10) - 1;
	var day = parseInt(date.substr(8, 2), 10);
	return {
		year: year,
		month: month,
		day: day
	};
}

function dateToHTMLIcon(aspects){
	return '<div class="date-icon">' + aspects.month + '/' + aspects.day + '</div>';
}

function selectDate(input){
	var aspects = parseDateAspects(input.value);
	dateOptions.push(new Date(aspects.year, aspects.month, aspects.day, 0, 0));
	document.getElementById('selected-dates').innerHTML += dateToHTMLIcon(aspects);
	createUserEventGrid();
}

function padZero(number){
	return (number < 10) ? ("0" + number) : number;
}

function setUpTimeSelectors(){
	var TIME_LIST = '';
	var currentHour = 0;
	var currentMinute = 0;
	var timeString = '';
	var timeView = '';
	var hourVal = 0;
	for(var t = 0; t < 12; t++){
		for(var m = 0; m < 60; m+=15){
			hourVal = t;
			if(t === 0){
				hourVal = 12;
			}
			timeString = padZero(hourVal) + ':' + padZero(m);
			timeView = padZero(hourVal) + ':' + padZero(m) + ' AM';
			TIME_LIST += '<option value="' + timeString + '">' + timeView + '</option>';
		}
	}
	for(var h = 0; h < 12; h++){
		for(var m = 0; m < 60; m+=15){
			hourVal = t+h;
			displayVal = h;
			if(h === 0){
				hourVal = 12;
				displayVal = 12;
			}
			timeString = padZero(hourVal) + ':' + padZero(m);
			timeView = padZero(displayVal) + ':' + padZero(m) + ' PM';
			TIME_LIST += '<option value="' + timeString + '">' + timeView + '</option>';
		}
	}
	var selectors = document.getElementsByClassName('time-intervals');
	var size = selectors.length;
	for(var s = 0; s < size; s++){
		selectors[s].innerHTML += TIME_LIST;
	}
}

setUpTimeSelectors();

function addTimeRange(isPriority){
	var start = parseTimeAspects('interval-start');
	var end = parseTimeAspects('interval-end');

	function getMinutes(aspects){
		return (aspects.hours * 60) + aspects.minutes;
	}

	var duration = getMinutes(end) - getMinutes(start);
	
	timeOptions.push({
		startHours: start.hours,
		startMinutes: start.minutes,
		duration: duration,
		free: 0,
		isPriority: isPriority
	});

	createUserEventGrid();

}

function createUserEventGrid(){
	createGrid('user-grid', dateOptions, timeOptions);
}

function createRangeLabelsArray(options){
	var date = options['start'];
	var interval = options['interval'];

	var slots = [];
	for(var t = 0; t < options['length']; t+=interval){
		var timeLabel = moment(date).format('h:mm A');
		var label = '<div class="timeslot"><div class="slot">' + timeLabel + '</div></div>';
		slots.push(label);
		date.setUTCMinutes(date.getUTCMinutes() + interval);
	}
	return slots;
}

function renderRangeLabels(columnID, rangeLabelsArray){
	var output = document.getElementById(columnID);
	var size = rangeLabelsArray.length;
	for(var r = 0; r < size; r++){
		if(r > 0) {
			var rangeBreak = document.createElement('p');
			rangeBreak.className = 'range-break';
			rangeBreak.innerText = '...';
			output.appendChild(rangeBreak);
		}
		var arraySize = rangeLabelsArray[r].length;
		for(var s = 0; s < arraySize; s++){
			output.innerHTML += rangeLabelsArray[r][s];
		}
	}
}

function createGrid(tableID, columns, rows){
	var table = document.getElementById(tableID);
	while (table.firstChild) {
	    table.removeChild(table.firstChild);
	}
	var headers = document.createElement('tr');
	headers.id = tableID + '-headers';
	table.appendChild(headers);
	var slots = document.createElement('tr');
	slots.id = tableID + '-slots';	
	table.appendChild(slots);

	var nCol = columns.length;
	var nRows = rows.length;
	for(var c = -1; c < nCol; c++){
		if( c > -1){
			var currentDate = columns[c];
			var columnID = tableID + '-' + currentDate.getTime();
			var th = document.createElement('th');
			th.innerText = moment(currentDate).format('ddd M/D');
			document.getElementById(tableID + '-headers').appendChild(th);
			var td = document.createElement('td');
			td.id = columnID;
			document.getElementById(tableID + '-slots').appendChild(td);
			var timeRangeArray = [];
			for(var r = 0; r < nRows; r++){
				currentDate.setHours(rows[r].startHours);
				currentDate.setMinutes(rows[r].startMinutes);
				var rangeOptions = {
					start: currentDate,
					interval: GLOBAL_INTERVAL,
					length: rows[r].duration,
					free: rows[r].free,
					isPriority: rows[r].isPriority
				};
				timeRangeArray.push(createTimeRangeArray(rangeOptions));
			}
			renderTimeRanges(columnID, timeRangeArray);
		}
		else{
			var currentDate = new Date(2015, 10, 22, 0, 0);
			var columnID = tableID + '-labelsSection';
			document.getElementById(tableID + '-headers').innerHTML += '<th>Times</th>';
			document.getElementById(tableID + '-slots').innerHTML += '<td id="' + columnID + '" class="grid-label"></td>';
			var rangeLabelsArray = [];
			for(var r = 0; r < nRows; r++){
				currentDate.setHours(rows[r].startHours);
				currentDate.setMinutes(rows[r].startMinutes);
				var rangeOptions = {
					start: currentDate,
					interval: GLOBAL_INTERVAL,
					length: rows[r].duration,
					isPriority: false
				};
				rangeLabelsArray.push(createRangeLabelsArray(rangeOptions));
				
			}
			renderRangeLabels(columnID, rangeLabelsArray);
		}

	}
}

console.log('LOADED creatorUI.js');