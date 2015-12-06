var ADMIN_ONLY_ACCESS = true;

function openAccess(){
	ADMIN_ONLY_ACCESS = false;
}

function viewResponses(){
	var meetingID = document.getElementById('responses-meeting-id').value;
	console.log(meetingID)
	viewMeetingHeatMap(meetingID);
	loadDisplayViz();
}

function viewMeetingHeatMap(loadMeetingID){

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

console.log("LOADED visual.js");