function getFreeSlots(){
	var response = [];
	var size = GLOBAL_TIMESLOTS.length;
	for(var s = 0; s < size; s++){
		console.log(GLOBAL_TIMESLOTS[s])
		if(GLOBAL_TIMESLOTS[s].attributes.free > 0){
			//console.log(GLOBAL_TIMESLOTS[s].attributes.timeText);
			response.push(GLOBAL_TIMESLOTS[s].getDataObject());
		}
	}
	return response;
}

console.log('LOADED slotManager.js');