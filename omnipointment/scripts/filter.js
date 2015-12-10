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
		//console.log(jsonData);
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
    var freeArray = [];
    var keepArray = [];
    var size = timeSlotList.length;
    for(var t = 0; t < size; t++){
        if(currentDate.getTime() === timeSlotList[t].time){
            response = 'SOME_ONE';
            freeArray.push(timeSlotList[t]);
        }
        else{
            keepArray.push(timeSlotList[t]);
        }
    }
    var resultsObject = {
    	result: response,
    	freeSlots: freeArray,
    	keepSlots: keepArray
    }
    return resultsObject;
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
			var resultsObject = compareSortedTimeSlotListFilter(date, timeSlotList);
			var comparisonResult = resultsObject.result;
			if(comparisonResult != 'NO_ONE'){
				freeData = comparisonResult;
				timeSlotList = resultsObject.keepSlots;
			}
		}

		var userListHTML = '<div class="name-filter"><div class="pointer"></div><ul>';
		
		var numFree = 0;

		if(comparisonResult != 'NO_ONE'){
			var peopleSlots = resultsObject.freeSlots;
			var peopleFree = peopleSlots.length;
			for(var p = 0; p < peopleFree; p++){
				userListHTML += '<li>' + peopleSlots[p].name + '</li>';
				numFree++;
			}
			userListHTML += '</ul></div>';
		}
		else{
			userListHTML = '';
		}

		var timeLabel = moment(date).format('h:mm A');
		var timeLabelDiv = '<div class="time-label">' + timeLabel + '</div>';
		var opacity = numFree / options['totalUsers'];
		var peopleFreeDiv = '<div class="people-free" style="opacity: ' + opacity + ';">' + numFree + '</div>';
		numFree = 0;
		var label = '<div class="timeslot">' + timeLabelDiv + '<div class="slot">' + peopleFreeDiv + userListHTML + '</div></div>';
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

	function loadTimeSlotsCallback(timeSlotList, totalUsers){
		var database = new Firebase("https://omnipointment.firebaseio.com/meetings/" + meetingID);
		database.once('value', function(snapshot){
			var meeting = snapshot.val();
			document.getElementById('view-meeting-name').innerHTML = meeting.name;
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
			createVizGrid(meetingID, 'filter-responses', grid.dateOptions, grid.timeOptions, timeSlotList, totalUsers);
		});
	}

	var meetingID = document.getElementById('responses-meeting-id').value;

	//var currentUserID;
	var allMeetingTimeSlots = [];

	var meetingUsersRef = new Firebase("https://omnipointment.firebaseio.com/meetings/" + meetingID + "/users");
	meetingUsersRef.once('value', function(snapshot){

		var meetingUsersList = JSON.parse(snapshot.val());
		var usersSize = meetingUsersList.length;

		for(var u = 0; u < usersSize; u++){

			var currentUserID = meetingUsersList[u];
			//console.log(currentUserID + ' vs ' + meetingUsersList[u])

			var nameRef = new Firebase("https://omnipointment.firebaseio.com/users/" + currentUserID + "/google");
			nameRef.once('value', function(snapshot){

				var userGoogle = snapshot.val();
				var userName = userGoogle.name;
				var userKey = userGoogle.uid;

				var path = "https://omnipointment.firebaseio.com/users/" + userKey + "/meetings/" + meetingID;
				
				var userRef = new Firebase(path);
				userRef.once('value', function(snapshot){

					var timeSlotList = JSON.parse(snapshot.val());
					
					/*console.log(timeSlotList)
					console.log(timeSlotList[0].uid)*/
					
					var tSize = timeSlotList.length;
					for(var l = 0; l < tSize; l++){

						timeSlotList[l]['name'] = userName;

						//console.log(moment(timeSlotList[l]['time']).format('hh:mm: ') + timeSlotList[l]['name'])

						if(!isDuplicateTimeSlot(allMeetingTimeSlots, timeSlotList[l])){
							allMeetingTimeSlots.push(timeSlotList[l]);
						}
						
					}

						if(u === usersSize){
							loadTimeSlotsCallback(allMeetingTimeSlots, usersSize);
						}
					
				});

			});
			
		}

	});


	//loadTimeSlotsCallback(allMeetingTimeSlots);

}

function isDuplicateTimeSlot(list, slot){
	response = false;
	var size = list.length;
	for(var s = 0; s < size; s++){
		/*console.log(list[s]['uid'] + ' === ' + slot['uid']);
		console.log(list[s]['time'] + ' === ' + slot['time']);*/
		var sameTime = list[s]['time'] === slot['time'];
		var sameID = list[s]['uid'] === slot['uid'];
		if(sameTime && sameID){
			response = true;
		}
	}
	return response;
}

function createVizGrid(meetingID, tableID, columns, rows, userTimeSlots, totalUsers){
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
					isPriority: rows[r].isPriority,
					totalUsers: totalUsers
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