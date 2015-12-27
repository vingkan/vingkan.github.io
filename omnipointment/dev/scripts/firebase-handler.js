var PATH = "https://omnipointment.firebaseio.com/";

/*  USED TO REFORMAT MEETING DATA TO NEW MONGOOSE SCHEME
	var firebase = new Firebase(`${PATH}/meetings/`);
		firebase.once("value", function(snapshot){
			var meetings = snapshot.val();
			console.log(meetings);
			for(var key in meetings){
				var meeting = meetings[key];
				var timeOptions = JSON.parse(meeting.timeOptions);
				timeOptions.forEach(option => {
					option.dates = meeting.dateOptions;
					if(option.free === 0){
						delete option.free;
					}
				});
				delete meeting.dateOptions;
					meeting.timeOptions = JSON.stringify(timeOptions);
					var meetingRef = new Firebase(`${PATH}/meetings/${meeting.mid}/`);
						meetingRef.set(meeting);
			}
		});
*/

function main(){

}

export var FirebaseHandler = {
	handle: function(){
		main();
	}
};