var DRAG_ENABLED = false;

var dragging = false;
var dragValue = 2;
var startTime = 0;
var stopTime = 0;
var dragSlots = [];

var columnInt = 86400000
var rowInt = 900000;

function toggleDrag(){
	var toggleButton = document.getElementById('toggle-drag');
	if(DRAG_ENABLED){
		DRAG_ENABLED = false;
		toggleButton.classList.remove('drag-enabled');
		toggleButton.classList.add('drag-disabled');
	}
	else{
		DRAG_ENABLED = true;
		toggleButton.classList.remove('drag-disabled');
		toggleButton.classList.add('drag-enabled');
	}
}

function handleDrag(timeslot){
	if(DRAG_ENABLED){
		if(dragging){
			if(timeslot.model.attributes.time > startTime){
				stopDrag(timeslot);	
			}
			else{
				alert("Error 324kek: Our deepest apologies, but you can only drag-select in the downwards-right direction at this time.");
				//Cleanup
				dragging = false;
				dragSlots = [];
			}
		}
		else{
			startDrag(timeslot);
		}
	}
}

function startDrag(timeslot){
	//Set Values
	dragging = true;
	startTime = timeslot.model.attributes.time;
	dragSlots.push(timeslot);
	//Determine value to be set on other selected slots
	dragValue = timeslot.model.attributes.free;
	console.log('startDrag(): ' + startTime);
}

function stopDrag(timeslot){
	//Set Values
	dragging = false;
	stopTime = timeslot.model.attributes.time;
	dragSlots.push(timeslot);
	//Determine drag range in columns and rows
	var rows = 0;
	var cols = 0;
	//Count Columns
	var colTime = startTime;
	while(colTime < stopTime){
		colTime += columnInt;
		cols++;
	}
	//Count Rows
	var stopRow = stopTime - ((cols - 1) * columnInt);
	var rowTime = startTime;
	if(startTime === (stopTime - columnInt)){
		rows = 0;
	}
	else{
		while(rowTime <= stopRow){
			rowTime += rowInt;
			rows++;
		}
	}
	console.log(cols + ' columns')
	console.log(rows + ' rows')
	//Select Slots within drag range
	for(var c = 0; c < cols; c++){
		var firstCell = startTime + (c * columnInt);
		for(var r = 0; r < rows; r++){
			var targetCell = firstCell + (r * rowInt);
			//console.log('(' + c + ', ' + r + ') ' + targetCell);
			var slot = getTimeSlotByTime(targetCell);
			dragSlots.push(slot);
		}
	}
	//Apply dragValue to slots in drag range
	dragSlots.forEach(function(slot, index){
		//Ooooh fancy forEach() loop that isn't deprecated!
		slot.forceToggle(dragValue);
	});
	//Cleanup, cleanup, everybody do your share
	dragSlots = [];
	console.log('stopDrag(): ' + stopTime);
}

function getTimeSlotByTime(time){
	var response = null;
	GLOBAL_TIMESLOT_VIEWS.forEach(function(slot, index){
		if(slot.model.attributes.time === time){
			response = slot;
		}
	});
	return response;
}

console.log("LOADED rsvpUI.js");