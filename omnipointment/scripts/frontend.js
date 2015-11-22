var currentSection = 'login';

function toggleSection(focusSection, override){
	if(USER_ID || override){
		var sections = document.getElementsByTagName('section');
		var size = sections.length;
		for(var s = 0; s < size; s++){
			sections[s].style.display = 'none';
		}
		/*if(focusSection === 'login' && userID){
			userID = null;
			displayMessage("You have been logged out.");
		}
		if(focusSection === 'profile'){
			loadProfile();
		}
		if(focusSection === 'browse'){
			loadProfileData(loadBrowsingProfiles);
		}
		if(focusSection === 'contact'){
			loadProfileData(loadContactProfiles);
		}
		if(currentSection === 'profile'){
			updateProfile();
		}*/
		currentSection = focusSection;
		document.getElementById(focusSection).style.display = 'block';
	}
	else{
		if(currentSection === 'login'){
			openSection('about', true);
		}
		else{
			openSection('login', true);
		}
		//displayMessage("You must be logged in to continue");
	}
}

console.log("LOADED frontend.js");