//LOCAL IMPORTS
import {Front} from './frontend';

var STARTING_SECTION = 'login';

function toggleSection(currentSection, focusSection, override){
	var USER_ID = Front.getUID();
	if(USER_ID || override){
		var sections = document.getElementsByTagName('section');
		var size = sections.length;
		for(var s = 0; s < size; s++){
			sections[s].style.display = 'none';
		}
		/*if(focusSection === 'view-responses'){
			viewResponses();
		}
		if(focusSection === 'my-meetings'){
			getMyMeetings();
		}*/
		document.getElementById(focusSection).style.display = 'block';
		return focusSection;
	}
	else{
		if(currentSection === 'login'){
			return toggleSection(currentSection, 'about', true);
		}
		else{
			return toggleSection(currentSection, 'login', true);
		}
		//displayMessage("You must be logged in to continue");
	}
}

export var Menu = {
	currentSection: STARTING_SECTION,
	toggleSection: function(focusSection, override){
		this.currentSection = toggleSection(this.currentSection, focusSection, override);
	}
}