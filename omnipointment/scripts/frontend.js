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