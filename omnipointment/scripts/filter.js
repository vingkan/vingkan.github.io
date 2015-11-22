function viewFilteredResponses(){
	var meetingID = document.getElementById('responses-meeting-id').value;
	console.log('filter: ' + meetingID)
	viewMeetingFilterMap(meetingID);
}

function viewMeetingFilterMap(loadMeetingID){

	function formatDateString(date){
		var formatted = moment(date).format('YYYY-MM-DDThh:mm:ss');
		return formatted;
	}

	function heatMapCallback(heatMap){
		var jsonData = {
			data: heatMap
		};
		console.log(jsonData);
		initHeatMapDisplay(jsonData);
	}

	function getJSONHeatMapFromMeeting(meetingID){
		var timeMap = [];
		var heatMap = [];
		var meetingRef = new Firebase("https://omnipointment.firebaseio.com/meetings/" + meetingID + "/users");
		meetingRef.once('value', function(snapshot){
			var userArray = JSON.parse(snapshot.val());
			var size = userArray.length;
			for(var u = 0; u < size; u++){
				var userRef = new Firebase("https://omnipointment.firebaseio.com/users/" + userArray[u] + "/meetings/" + meetingID);
				userRef.once('value', function(snapshot){
					var timeSlotList = JSON.parse(snapshot.val());
					var listSize = timeSlotList.length;
					for(var t = 0; t < listSize; t++){
						var index = $.inArray(timeSlotList[t].time, timeMap);
						if(index > -1){
							heatMap[index]['value']['free'] += timeSlotList[t].free;
						}
						else{
							timeMap.push(timeSlotList[t].time);
							var date = new Date(timeSlotList[t].time);
							//console.log(date);
							var formatted = formatDateString(date);
							//console.log(formatted)
							heatMap.push({
								timestamp: formatted,
								value: {
									'free': timeSlotList[t].free
								}
							})
						}
					}
					heatMapCallback(heatMap);
				});
			};
		});
	}

	function validateCreator(meetingID){
		if(ADMIN_ONLY_ACCESS){
			var creatorRef = new Firebase("https://omnipointment.firebaseio.com/meetings/" + meetingID + "/creator");
			creatorRef.once('value', function(snapshot){
				var creator = snapshot.val();
				if(USER_ID == creator){
					getJSONHeatMapFromMeeting(meetingID);
				}
				else{
					alert("You are not authorized to view this.");
				}
			});
		}
		else{
			getJSONHeatMapFromMeeting(meetingID);
		}
	}

	validateCreator(loadMeetingID);

}


/*function createDisplayVizArray(options){
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
}*/

function compareSortedTimeSlotListFilter(currentDate, timeSlotList){
    var response = 'NO_ONE';
    var keepArray = [];
    var size = timeSlotList.length;
    for(var t = 0; t < size; t++){
        if(currentDate.getTime() === timeSlotList[t].time){
            response = timeSlotList[t].name;
        }
        else{
            keepArray.push(timeSlotList[t]);
        }
    }
    keepArray.push(response);
    return keepArray;
}

function createDisplayVizArray(options, userTimeSlots) {
	var date = options['start'];
	var interval = options['interval'];
	var timeSlotList = userTimeSlots;
	//console.log(timeSlotList)

	var slots = [];
	for(var t = 0; t < options['length']; t+=interval){
		var div = document.createElement('div');
		var freeData = options['free'] || 0;

		if(userTimeSlots){
			var resultArray = compareSortedTimeSlotListFilter(date, timeSlotList);
			//console.log(resultArray)
			var comparisonResult = resultArray[resultArray.length - 1];
			//console.log(comparisonResult)
			if(comparisonResult != 'NO_ONE'){
				//console.log('MATCH!')
				freeData = comparisonResult;
				timeSlotList = resultArray.slice(0, timeSlotList.length - 1);
			}
		}

		/*var model = new TimeSlotModel({
			el: div,
			mid: options['mid'],
			time: date.getTime(),
			duration: interval,
			free: freeData,
			isPriority: options['isPriority']
		});
		slots.push(model);*/

		var userListHTML = '';

		if(comparisonResult != 'NO_ONE'){
			userListHTML += '<div class="name-filter">' + freeData + '</div>';
		}

		var timeLabel = moment(date).format('h:mm A');
		var label = '<div class="timeslot"><div class="slot">' + timeLabel + userListHTML + '</div></div>';
		slots.push(label);


		date.setUTCMinutes(date.getUTCMinutes() + interval);
	}
	return slots;
}

function renderDisplayViz(columnID, displayVizArray){
	var output = document.getElementById(columnID);
	var size = displayVizArray.length;
	for(var r = 0; r < size; r++){
		if(r > 0) {
			var rangeBreak = document.createElement('p');
			rangeBreak.className = 'range-break';
			rangeBreak.innerText = '...';
			output.appendChild(rangeBreak);
		}
		var arraySize = displayVizArray[r].length;
		for(var s = 0; s < arraySize; s++){
			output.innerHTML += displayVizArray[r][s];
		}
	}
}

function loadDisplayViz(){

	function loadTimeSlotsCallback(timeSlotList){
		var database = new Firebase("https://omnipointment.firebaseio.com/meetings/" + meetingID);
		database.once('value', function(snapshot){
			var meeting = snapshot.val();
			console.log('Found in database:');
			console.log(meeting);
			var dateStrings = JSON.parse(meeting.dateOptions);
			var size = dateStrings.length;
			var grid = {
				dateOptions: [],
				timeOptions: []
			}
			for(var d = 0; d < size; d++){
				grid.dateOptions.push(new Date(dateStrings[d]));
			}
			grid.timeOptions = JSON.parse(meeting.timeOptions);
			//toggleSection('load-meeting');
			//document.getElementById('load-meeting-name').innerHTML = meeting.name;
			createVizGrid(meetingID, 'filter-responses', grid.dateOptions, grid.timeOptions, timeSlotList);
		});
	}

	var meetingID = document.getElementById('responses-meeting-id').value;
	var nameRef = new Firebase("https://omnipointment.firebaseio.com/users/" + USER_ID + "/google/name");
	nameRef.once('value', function(snapshot){

		var userName = snapshot.val();

		var userRef = new Firebase("https://omnipointment.firebaseio.com/users/" + USER_ID + "/meetings/" + meetingID);
		userRef.once('value', function(snapshot){
			var timeSlotList = JSON.parse(snapshot.val());
			var tSize = timeSlotList.length;
			for(var l = 0; l < tSize; l++){
				timeSlotList[l]['name'] = userName;
			}
			//console.log(timeSlotList);
			loadTimeSlotsCallback(timeSlotList);
		});

	});


}

function createVizGrid(meetingID, tableID, columns, rows, userTimeSlots){
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
					mid: meetingID,
					start: currentDate,
					interval: GLOBAL_INTERVAL,
					length: rows[r].duration,
					free: rows[r].free,
					isPriority: rows[r].isPriority
				};
				timeRangeArray.push(createDisplayVizArray(rangeOptions, userTimeSlots));
			}
			renderDisplayViz(columnID, timeRangeArray);
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

console.log("LOADED filter.js");