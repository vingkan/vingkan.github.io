function TimeSlot(data){

	return {
		uid: USER_ID,
		mid: data['mid'],
		time: data['time'],
		duration: data['duration'],
		free: data['free'],
		isFree: function(){
			return this.free;
		},
		toString: function(){
			var response = this.uid + ' is ';
			if(this.free){
				response += 'free';
			}
			else{
				response += 'not free';
			}
			response += ' at ' + moment(new Date(parseInt(this.time, 10))).format('llll');
			response += ' for ' + this.duration + ' minutes.';
			return response;
		}
	}

}

function slotsAreEqual(slot1, slot2){
	var equal = false;
	var sameStart = (slot1.time === slot2.time);
	var sameDuration = (slot1.duration === slot2.duration);
	if(sameStart && sameDuration){
		equal = true;
	}
	return equal;
}

console.log('LOADED data.js');