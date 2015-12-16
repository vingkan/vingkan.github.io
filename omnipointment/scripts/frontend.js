var currentSection = 'login';

function toggleSection(focusSection, override){
	if(USER_ID || override){
		var sections = document.getElementsByTagName('section');
		var size = sections.length;
		for(var s = 0; s < size; s++){
			sections[s].style.display = 'none';
		}
		if(focusSection === 'view-responses'){
			viewResponses();
		}
		if(focusSection === 'my-meetings'){
			getMyMeetings();
		}
		currentSection = focusSection;
		document.getElementById(focusSection).style.display = 'block';
	}
	else{
		if(currentSection === 'login'){
			toggleSection('about', true);
		}
		else{
			toggleSection('login', true);
		}
		//displayMessage("You must be logged in to continue");
	}
}

function searchMeetings(){
	toggleSection('view-responses');
}

function getMyMeetings(){
	var output = document.getElementById('my-meeting-list');
		output.innerHTML = '';
	var path = "https://omnipointment.firebaseio.com/users/" + USER_ID + "/meetings/";
	var userMeetings = new Firebase(path);

	var meetingKeys = [];

	userMeetings.once("value", function(snapshot){
		var meetings = snapshot.val();
		for(var key in meetings){
			console.log(key)
			var meetingData = JSON.parse(meetings[key]);
			if(meetingData.length > 0){
				//var meetingID = meetingData[0]['mid'];
				var meetingPath = "https://omnipointment.firebaseio.com/meetings/" + key + "/";
				console.log(meetingPath)
				var meetingRef = new Firebase(meetingPath);
				meetingRef.once("value", function(snapshot){
					var meetingObj = snapshot.val();
					output.innerHTML += '<li onclick="loadMeetingById(&quot;' + meetingObj.mid + '&quot;);">' + meetingObj.name + '</li>';
				});
			}
		}
	});
}


/*--------------------------------------------*/
/*---> KEY BINDINGS <-------------------------*/
/*--------------------------------------------*/

$('#find-meeting-id').keypress(function(event){
	if(event.keyCode == 13){
		checkMeetingName('find-meeting-id');
		searchMeetings();
	}
});

console.log("LOADED frontend.js");