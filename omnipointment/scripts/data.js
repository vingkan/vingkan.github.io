function TimeSlot(data){

	return {
		uid: USER_ID,
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

console.log('LOADED data.js');