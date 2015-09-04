function createSlot(date){
	var timestamp = date.getTime();
	//var html = '<div class="slot" id="' + timestamp + '" onmousedown="from(' + timestamp + ')" onmouseup="to(' + timestamp + ')">' + timestamp + '</div>';
	var html = '<div class="slot" id="' + timestamp + '" onclick="toggle(' + timestamp + ')">' + timestamp + '</div>';
	return html;
}

function toggle(timestamp){
	var slot = document.getElementById(timestamp);
	if(slot != null){
		if(slot.style.background == '#80ff00' || slot.style.background == 'rgb(128, 255, 0)'){
			slot.style.background = '#cccccc';
		}
		else{
			slot.style.background = '#80ff00';
		}
	}
	else{
		console.log('ERROR: Timestamp: ' + timestamp + ' not included in grid.')
	}
}

var fromSlot = null;
var toSlot = null;
var minuteInterval = 15;
var oneSlot = 1000 * 60 * minuteInterval; //1000 milliseconds * 60 seconds * 15 minutes
/* Apparently the diference between two same times, one day apart from each other is equal to the below, but times 27 hours instead of 24...
I'll get to the bottom of it eventually, but for now, it's magic number time!
var oneDay = 1000 * 60 * 60 * 24; //1000 ms * 60 s * 60 minutes * 24 hours */
var oneDay = 97200000; //Yippeeeee Magic Numbers!

/* NEW METHODS */

/*
* Checks if two timestamps are in the same row on a table
*/
function sameRow(timestamp1, timestamp2){
	var same = false;
	var slotDifference = Math.abs(timestamp2 - timestamp1);
	var rowDifference = 104400000; //Yippeeeee Magic Numbers!
	var modulus = slotDifference%rowDifference;
	if(modulus == 0){
		same = true;
	}
	return same;
}

/*
* Checks if two timestamps are in the same column on a table
*/
function sameColumn(timestamp1, timestamp2){
	var same = false;
	var slotDifference = Math.abs(timestamp2 - timestamp1);
	var columnDifference = 1000 * 60 * minuteInterval; //Yippeeeee Magic Numbers!
	var modulus = slotDifference%columnDifference;
	if(modulus == 0){
		same = true;
	}
	return same;
}


/* NEW METHODS */

function toggleRow(firstDate, days){
	var targetSlot = null;
	console.log("From: " + firstDate + " and go over " + days + " days.")
	while(days != 0){
		targetSlot = firstDate + ((days) * oneDay);
		toggle(targetSlot);
		if(days > 0){
			days--;
		}
		else if(days < 0){
			days++;
		}
	}
	toggle(firstDate);
	if(targetSlot != null){
		return targetSlot;
	}
	else{
		console.log("toggleRow() says: NULL SLOT RETURNED.");
	}
}

function toggleGrid(){
	var fromDate = new Date(fromSlot);
	var toDate = new Date(toSlot);

	var direction = null;
	var daysDifference = (toSlot - fromSlot) / oneDay;
	var days = 0;
	if(daysDifference > 0){
		if((toSlot - fromSlot) < oneDay){
			days = Math.ceil(daysDifference);
			direction = -1;
		}
		else{
			days = Math.floor(daysDifference);
			direction = 1;
		}
	}
	else if(daysDifference < 0){
		if((fromSlot - toSlot) > oneDay){
			days = Math.ceil(daysDifference);
			direction = -1;
		}
		else{
			days = Math.floor(daysDifference);
			direction = 1;
		}
	}

	var firstSlot = fromSlot;
	var lastSlot = null;
	var filled = false;
	while(!filled){
		lastSlot = toggleRow(firstSlot, days);
		firstSlot += direction * oneSlot;
		if(sameRow(toSlot, firstSlot) || sameRow(toSlot, lastSlot)){
			filled = true;
		}
		
	}
}

function from(slot){
	fromSlot = slot;
}

function to(slot){
	toSlot = slot;
	toggleGrid();
}

function createSchedule(startDate, hours, days){
	var schedule = document.getElementById('scheduleBody');
		var slotWidth = 100;
		var scheduleWidth = (slotWidth + 10) * (days + 1);
		schedule.style.width = scheduleWidth + 'px';
	var html = '';
	var dateTime = startDate;
	for(var d = -1; d < days; d++){
		html += '<div class="day">';
		if(d > -1){
			html += '<h2>' + (dateTime.getMonth() + 1) + '/' + dateTime.getDate() + '</h2>';
			for(var s = 0; s < hours; s++){
				for(var h = 0; h < 4; h++){
					html += createSlot(dateTime);
					dateTime.setMinutes(dateTime.getMinutes() + minuteInterval);
				}
				//dateTime.setHours(dateTime.getHours() + 1);
			}
		}
		else{
			var tempDate = new Date(startDate.getTime());
			for(var s = 0; s < hours; s++){
				html += '<div class="hourLabel">' + formatDate(tempDate, "hh:mm TT") + '</div>';
				tempDate.setHours(dateTime.getHours() + 1);
			}
		}
		html += '</div>';
		dateTime.setDate(dateTime.getDate() + 1);
	}
	schedule.innerHTML = html;
}