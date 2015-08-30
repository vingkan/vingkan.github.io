function createSlot(date){
	var timestamp = date.getTime();
	var html = '<div class="slot" id="' + timestamp + '" unselectable="on" onmousedown="from(' + timestamp + ')" onmouseup="to(' + timestamp + ')">' + timestamp + '</div>';
	return html;
}

function toggle(timestamp){
	var slot = document.getElementById(timestamp);
	if(slot.style.background == '#80ff00'){
		slot.style.background = '#cccccc';
	}
	else{
		slot.style.background = '#80ff00';
	}
}

var fromSlot = null;
var toSlot = null;
var minuteInterval = 15;

function toggleGrid(){
	var fifteenMinutes = 1000 * 60 * 15; //1000 milliseconds * 60 seconds * 15 minutes
	var oneDay = 1000 * 60 * 60 * 24; //1000 ms * 60 s * 60 minutes * 24 hours
	var fromDate = new Date(fromSlot);
	var toDate = new Date(toSlot);
	var difference = new Date(toDate.getTime() - fromDate.getTime());
	console.log("Days Difference: " + difference.getTime()/oneDay);
	var daysDifference = difference.getTime()/oneDay;
	var dayColumns = Math.ceil(daysDifference);
	console.log("DaysX: " + dayColumns)
	var timestamp = 0;
	for(var d = 0; d < dayColumns; d++){
		timestamp = fromDate.getTime() + (d * oneDay);
		console.log(timestamp)
		toggle(timestamp);
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